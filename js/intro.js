var scene, camera, renderer;
var backgroundScene  = new THREE.Scene();
var backgroundCamera = new THREE.Camera();

init();
render();

function init() {

	// Initializing global variables
	scene = new THREE.Scene(); // set up the scene
	// scene.fog = new THREE.FogExp2(0xffffff, 0.0003);
	camera = new THREE.PerspectiveCamera (75, window.innerWidth/window.innerHeight, 0.1, 1000);

	// Create lights
    var light = new THREE.PointLight(0xEEEEEE);
    light.position.set(20, 0, 20);
    scene.add(light);

    var lightAmb = new THREE.AmbientLight(0x777777);
    scene.add(lightAmb);

	// Set up the rendered
 	renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
 	// renderer.setClearColor(scene.fog.color);
	renderer.setSize(window.innerWidth, window.innerHeight); // set the size at which we want it to render our app
	document.body.appendChild(renderer.domElement);

	// Set up the main camera
    camera.position.z = 5;

	initBackground();

	var theText  = "Star Wars"
	var theText2 = "A long time ago, in a galaxy far, far away...."
	var theText3 = "It is a period of civil war. Rebel"
	var theText4 = "spaceships, striking from a hidden"
	var theText5 = "base, have won their first victory"
	var theText6 = "against the evil Galactic Empire."

	// Get text from hash
	var hash = document.location.hash.substr( 1 );
	if ( hash.length !== 0 ) {
		theText = hash;
	}

	var text3d2 = new THREE.TextGeometry (theText2, {
		size: 20,
		//height seems to change the volume of the text
		height: 5,
		curveSegments: 5,
		font: "helvetiker"
	});

	text3d2.computeBoundingBox();
	var centerOffset = -0.5 * ( text3d2.boundingBox.max.x - text3d2.boundingBox.min.x );
	var textMaterial2 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 0)', overdraw: 0.1 });
	text2 = new THREE.Mesh( text3d2, textMaterial2 );
	text2.position.x = centerOffset;
	text2.position.y = 60;
	text2.position.z = 300;
	//Gives the text an angle
	text2.rotation.x = 150;
	//text2.rotation.y = Math.PI * 2;
	group = new THREE.Object3D();
	group.add( text2 );
	scene.add( group );

	window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
	requestAnimationFrame(render);
	// camera.lookAt( scene.position );
	renderer.autoClear = false;
	renderer.clear();
	//renderer.render(backgroundScene , backgroundCamera );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function initBackground() {

    // Load the background texture
    var texture        = THREE.ImageUtils.loadTexture('images/background.png');
    
    texture.wrapS	= THREE.RepeatWrapping;
	texture.wrapT	= THREE.RepeatWrapping;
    
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        }));

    backgroundMesh.material.depthTest  = false;
    backgroundMesh.material.depthWrite = false;

    // Create your background scene
    backgroundScene.add(backgroundCamera);
    backgroundScene.add(backgroundMesh);
}
