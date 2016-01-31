var container, stats;
var scene, camera, renderer, raycaster;
var planeEasy, planeMedium, planeHard, planeBack;
var raycaster;
var mouse = new THREE.Vector2(), INTERSECTED;

init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Initializing scene
	scene = new THREE.Scene();

	// initialize camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 160, 200 );

	// set clear color as transparent, so the background doenst disappear
	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight );	
	container.appendChild( renderer.domElement );

	// initialize raycaster
	raycaster = new THREE.Raycaster();

	createStats();
	createButtons();

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousedown' , onMouseLeftButtonDown, false );
}

function createButtons() {

	// Easy
	texture   = THREE.ImageUtils.loadTexture("images/easy.png");
	material  = new THREE.MeshBasicMaterial({ map : texture, transparent: true});
	planeEasy =  new THREE.Mesh(new THREE.PlaneGeometry(150, 70), material);
	planeEasy.position.x = 0;
	planeEasy.position.y = 230;
	planeEasy.position.z = -100;
	planeEasy.name = "Easy";
	scene.add(planeEasy);

	// Medium
	texture     = THREE.ImageUtils.loadTexture("images/medium.png");
	material    = new THREE.MeshBasicMaterial({ map : texture, transparent: true});
	planeMedium =  new THREE.Mesh(new THREE.PlaneGeometry(150, 70), material);
	planeMedium.position.x = 0;
	planeMedium.position.y = 160;
	planeMedium.position.z = -100;
	planeMedium.name = "Medium";
	scene.add(planeMedium);

	// Hard
	texture   = THREE.ImageUtils.loadTexture("images/hard.png");
	material  = new THREE.MeshBasicMaterial({ map : texture, transparent: true});
	planeHard =  new THREE.Mesh(new THREE.PlaneGeometry(150, 70), material);
	planeHard.position.x = 0;
	planeHard.position.y = 90;
	planeHard.position.z = -100;
	planeHard.name = "Hard";
	scene.add(planeHard);


	// Back
	var texture  = THREE.ImageUtils.loadTexture("images/back.png");
	var material = new THREE.MeshBasicMaterial({ map : texture, transparent: true});
	planeBack    =  new THREE.Mesh(new THREE.PlaneGeometry(50, 70), material);
	planeBack.position.x = 230;
	planeBack.position.y = 270;
	planeBack.position.z = -100;
	planeBack.name = "BackButton";
	scene.add(planeBack);
}

function createStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
	renderer.autoClear = false;
	renderer.clear();

	renderer.render( scene, camera );
}

function onMouseLeftButtonDown(event) {
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 -1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Get 3D vector from 3D mouse position using 'unproject' function
	var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	vector.unproject(camera);

	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		var clickedObject = intersects[0].object;
		if (clickedObject.name === "Easy") {
			// go to menu page
			location.replace("game.html");	
		}
		if (clickedObject.name === "BackButton") {
			// go to menu page
			location.replace("menu.html");	
		}
	}
}