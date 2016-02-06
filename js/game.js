// Get the canvas element from our HTML above
var canvas  = document.getElementById("renderCanvas");
var divTime = document.getElementById("clock");

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var stats, container;

var clock;
var scene;
var camera;
var spaceship, planets, skybox;
var moveLeft, moveRight, moveForward, moveBackward;

document.addEventListener("DOMContentLoaded", function () { init(), animate(); }, false);

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Now, call the createScene function that you just finished creating
	scene = createScene();
	// Register a render loop to repeatedly render the scene
	  engine.runRenderLoop(function () {
	    scene.render();
	});

	createStats();

	// initialize clock
	clock = new THREE.Clock();

	// initializing spaceship movement variables
	moveLeft     = false;
	moveRight    = false;
	moveForward  = false;
	moveBackward = false;  

	spaceshipSpeed = 5.0;

	initMovement();

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () { engine.resize(); });

}

function animate() {
	requestAnimationFrame( animate );

	render();

	stats.update();
}

function render() {
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

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 100, 150), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, -200));
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount
    light.intensity = 0.5;

    createSkybox(scene);
    createSpaceship(scene);
    createPlanets(scene);

   	return scene;	
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
    	spaceship          = meshes[0];
		spaceship.scaling  = new BABYLON.Vector3(0.08,0.08,0.08);
		spaceship.position = new BABYLON.Vector3(0,0,0);
    });
}

function createPlanets (scene) {
	// initializing return object
	var planets      = [];

    var planet1      = BABYLON.Mesh.CreateSphere("planet1", 50.0, 100.0, scene);
    planet1.position = new BABYLON.Vector3(200, 100, -700);
    planets.push(planet1);

    var planet2      = BABYLON.Mesh.CreateSphere("planet2", 50.0, 200.0, scene);
    planet2.position = new BABYLON.Vector3(-400, -500, -400);
    planets.push(planet2);

    return planets;
}

function initMovement() {
	// When a key is pressed, set the movement
    var onKeyDown = function(evt) {
    	switch (evt.keyCode) {
    		case 65:
    			// key 'a' presseds
	    		moveSpaceship(-spaceshipSpeed, 0);
				break;  
			case 68:
    			// key 'd' pressed
	    		moveSpaceship(spaceshipSpeed, 0);
				break;
			case 83:
    			// key 's' presseds
	    		moveSpaceship(0, -spaceshipSpeed);
				break;  
			case 87:
    			// key 'w' pressed
	    		moveSpaceship(0, spaceshipSpeed);
				break; 
    	}
    };

    var onKeyUp = function(evt) {
    	moveLeft     = false;
		moveRight    = false;
		moveForward  = false;
		moveBackward = false;
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

function moveSpaceship(speedX, speedY) {
	spaceship.position.x -= speedX;
	spaceship.position.z -= speedY;

	camera.position.x -= speedX;
	camera.position.z -= speedY;
}