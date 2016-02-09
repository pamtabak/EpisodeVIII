// Get the canvas element from our HTML above
var canvas      = document.getElementById("renderCanvas");
var divTime     = document.getElementById("clock");
var divHealth   = document.getElementById("health");
var container;

var controlEnabled = false;

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var stats;

var clock;
var scene;
var camera;
var spaceship, planets, skybox;
var spaceshipSpeed;
var healthBar, health;

var difficulty;

document.addEventListener("DOMContentLoaded", function () { init(), animate(); }, false);

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Now, call the createScene function that you just finished creating
	scene = createScene();
	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop(function () { scene.render(); });

	createStats();

	// initialize clock
	clock = new THREE.Clock();

	// initializing spaceship variables
	spaceshipSpeed = 5.0;
	health         = 1.0;
	difficulty     = localStorage.getItem("difficulty");
	if (difficulty === "") { difficulty = "Easy"; }

	initMovement();
	initPointerLock();

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () { engine.resize(); });

}

function animate() {
	requestAnimationFrame( animate );

	render();

	stats.update();
}

function render() {
	// Updating timer
	var elapsedTime = clock.getElapsedTime().toString().split(".")[0];
	if (elapsedTime < 60) {
		if (elapsedTime.length == 1) { elapsedTime = "0" + elapsedTime; }
		elapsedTime = "00:" + elapsedTime;
	}
	else {
		var minutes = Math.floor(elapsedTime/60);
		if (minutes.toString().length == 1) { minutes = "0" + minutes; }
		var seconds = elapsedTime%60;
		if (seconds.toString().length == 1) { seconds = "0" + seconds; }
		elapsedTime = minutes + ":" + seconds;
	}
	divTime.innerHTML = elapsedTime;

	scene.render();
}

function createStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top      = '0px';
	container.appendChild( stats.domElement );
}

function createScene() {
    var scene = new BABYLON.Scene(engine);
    // engine.isPointerLock = true;

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    camera = createCamera(scene);

	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.0;

    createSkybox(scene);
    createSpaceship(scene);
    createPlanets(scene);
    createHealthStatus();

   	return scene;	
}

function createCamera (scene) {
	camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 100, 150), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, -200));
    camera.attachControl(canvas, true);

    // Remap keys to move with WASD
    camera.keysUp 			  = [87]; // W
    camera.keysDown 		  = [83]; // S
    camera.keysLeft 		  = [65]; // A
    camera.keysRight 		  = [68]; // D

    camera.ellipsoid       	  = new BABYLON.Vector3(2, 2, 2);
    camera.checkCollisions 	  = true;
    camera.speed 		   	  = 10.0;
    camera.inertia 		   	  = 0.9;
    camera.angularInertia 	  = 0;
    camera.angularSensibility = 2500;
    camera.layerMask 		  = 2;
    scene.activeCamera 		  = camera;

    return camera;
}

function createSkybox (scene) {
	// The box creation
	var skybox = BABYLON.Mesh.CreateSphere("skyBox", 100.0, 10000.0, scene);

	// The sky creation
	var skyboxMaterial                               = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling                   = false;
	skyboxMaterial.diffuseColor                      = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor                     = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.reflectionTexture                 = new BABYLON.CubeTexture("assets/space", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

	// box + sky = skybox !
	skybox.material = skyboxMaterial;

	return skybox;
}

function createSpaceship (scene) {
	// Load spaceship model
    BABYLON.SceneLoader.ImportMesh("", "assets/", "spaceship.babylon", scene, function (meshes) {
    	spaceship          	         = meshes[0];
		spaceship.scaling  	         = new BABYLON.Vector3(0.08, 0.08, 0.08);
		spaceship.position 	         = new BABYLON.Vector3(0, -45, 120);
		spaceship.rotationQuaternion = null;
		spaceship.rotation.x         = (8.0 / 4.0) * Math.PI;
		spaceship.rotation.y         = Math.PI;
		spaceship.parent	         = scene.activeCamera;
    });
}

function createPlanets (scene) {
	// initializing return object
	var planets      		= [];
	var planetTextures = ["mercury.jpg", "venus.jpg", "earth.jpg", "mars.jpg",
						  "jupiter.jpg", "saturn.jpg", "uranus.jpg", "neptune.jpg", 
						  "pluto.jpg"];
	var planetSizes = [200.0, 600.0, 800.0, 500.0, 1500.0, 1200.0, 1000.0, 900.0, 150.0];

	for (var i = 0; i < planetTextures.length; ++i) {
		var planet 				= BABYLON.Mesh.CreateSphere(planetTextures[i].split(".")[0], 50.0, planetSizes[i], scene);
		planet.position 		= new BABYLON.Vector3(getRandomNumber(-3000.0, 3000.0), getRandomNumber(-3000.0, 3000.0), getRandomNumber(-3000.0, 3000.0));
		var material 			= new BABYLON.StandardMaterial(planetTextures[i].split(".")[0] + "texture", scene);
		planet.material 		= material;
		material.diffuseTexture = new BABYLON.Texture("assets/" + planetTextures[i], scene);
		planets.push(planet);
	}

    return planets;
}

function createHealthStatus () {
	divHealth.innerHTML = "";
	for (var i = 0; i < 10; i++){
		divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(0,255,0);stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
	}
}

function updateHealthStatus() {
	divHealth.innerHTML = "";
	if (health >= 0.7){
		for (var i = 0; i < health * 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(0,255,0);stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
		for (var i = health * 10; i < 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(0,255,0);opacity:0.4;stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
	}
	else if (health >= 0.5 && health < 0.7) {
		for (var i = 0; i < health * 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(255,255,0);stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
		for (var i = health * 10; i < 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(255,255,0);opacity:0.4;stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
	}
	else {
		for (var i = 0; i < health * 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(255,0,0);stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
		for (var i = health * 10; i < 10; i++)
			divHealth.innerHTML += "<svg width='20' height='20'><rect width='15' height='15' style='fill:rgb(255,0,0);opacity:0.4;stroke-width:3;stroke:rgb(0,0,0)' /></svg>"
	}
}

function createWarning (scene) {
	// It's a trap! You're out of the safety zone. 
	// Go back or you'll be redirected
	var background      = BABYLON.Mesh.CreateGround("background", 100, 100, 100, scene, false);
	var material        = new BABYLON.StandardMaterial("background", scene);
	background.material = material;
	
	var backgroundTexture      = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
	material.diffuseTexture    = backgroundTexture;
	material.specularColor     = new BABYLON.Color3(0, 0, 0);
	material.reflectionTexture = new BABYLON.CubeTexture("assets/space", scene);
	material.backFaceCulling   = false;

	backgroundTexture.drawText("It's a trap! You're out of the safety zone.", null, 10, "bold 70px Segoe UI", "yellow", "#555555");
	backgroundTexture.drawText("Go back or you'll be redirected", null, 100, "bold 70px Segoe UI", "yellow", "#555555");
}

function initMovement() {
	// When a key is pressed, set the movement
    var onKeyDown = function(evt) {
    	switch (evt.keyCode) {
    		case 65:
    			// key 'a' presseds
	    		// moveSpaceship(-spaceshipSpeed, 0);
				break;  
			case 68:
    			// key 'd' pressed
	    		// moveSpaceship(spaceshipSpeed, 0);
				break;
			case 83:
    			// key 's' presseds
	    		// moveSpaceship(0, -spaceshipSpeed);
				break;  
			case 87:
    			// key 'w' pressed
	    		// moveSpaceship(0, spaceshipSpeed);
				break; 
    	}
    };

    var onKeyUp = function(evt) {
    }

	// Register events with the right Babylon function
    BABYLON.Tools.RegisterTopRootEvents([{
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }]);
}

function initPointerLock () {
	// On click event, request pointer lock
    canvas.addEventListener("click", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerLockChange, false);
    document.addEventListener("mspointerlockchange", pointerLockChange, false);
    document.addEventListener("mozpointerlockchange", pointerLockChange, false);
    document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
}

function pointerLockChange (event) {
	controlEnabled = (     document.mozPointerLockElement === canvas
                        || document.webkitPointerLockElement === canvas
                        || document.msPointerLockElement === canvas
                        || document.pointerLockElement === canvas);


	 if (!controlEnabled) {
           camera.detachControl(canvas);
        } else {
            camera.attachControl(canvas);
        }
}

function getRandomNumber (min, max) {
	return Math.random() * (max - min + 1) + min;
}

// function moveSpaceship(speedX, speedY) {
// 	spaceship.position.x -= speedX;
// 	spaceship.position.z -= speedY;
// }