// Get the canvas element from our HTML above
var canvas  = document.getElementById("renderCanvas");
var divTime = document.getElementById("clock");

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var stats, container;

var clock;
var scene;

init();
animate();

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
    if (elapsedTime.length == 1)
      elapsedTime = "0" + elapsedTime;
    elapsedTime = "00:" + elapsedTime;
  }
  else {
    var minutes = Math.floor(elapsedTime/60);
    if (minutes.toString().length == 1)
      minutes = "0" + minutes;
    var seconds = elapsedTime%60;
    if (seconds.toString().length == 1)
      seconds = "0" + seconds;
    elapsedTime = minutes + ":" + seconds;
  }
  divTime.innerHTML = elapsedTime;

  scene.render();
}

function createStats() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );
}

function createScene() {
    // Now create a basic Babylon Scene object 
    var scene = new BABYLON.Scene(engine);

    // Change the scene background color to blue.
    scene.clearColor = new BABYLON.Color3(0, 0, 1);

    // This creates and positions a free camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, -30, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount
    light.intensity = .5;

    // // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;

    // // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    // create cylinder to represent the space
    var spaceScale = 10.0;
    var space = BABYLON.Mesh.CreateCylinder("space", 10 * spaceScale, 0, 6 * spaceScale, 20, 20, scene);

    // create starfield shader to 
    var starfieldPT = new BABYLON.StarfieldProceduralTexture("starfieldPT", 512, scene);
    var starfieldMaterial = new BABYLON.StandardMaterial("starfield", scene);
    starfieldMaterial.diffuseTexture = starfieldPT;
    starfieldMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    starfieldMaterial.backFaceCulling = false;
    starfieldPT.beta = 0.1;

    // put the material to the space mesh
    space.material = starfieldMaterial;

    // makes the space moves towards the spaceship
    scene.registerBeforeRender(function () {
        starfieldPT.time += scene.getAnimationRatio() * 0.8;
    });

   	return scene;	
}