var container, stats;
var camera, scene, renderer;
var group, text, text2;
var groups = [];

var clock;

var clearIntro = true;
var startLogo = true;
var startParagraph = true;

var plane;

var sound;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Initializing scene
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 160, 200 );

	// set clear color as transparent, so the background doenst disappear
	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight );	
	container.appendChild( renderer.domElement );

	// initialize clock
	clock = new THREE.Clock();

	// initialize audio
	sound = new Audio("sounds/intro.mp3");

	createIntroText();

	createStats();

	window.addEventListener( 'resize', onWindowResize, false );

}

function createStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
}

function createIntroText() {
	var paragraph = [];

	paragraph.push("Em uma sala de aula na UFRJ,");
	paragraph.push("em pleno verao ...");

	for (var i = 0; i <= 1; i++) {
		var text3d = new THREE.TextGeometry( paragraph[i], {
			size: 20,
			height: 1,
			curveSegments: 5,
			font: "helvetiker"
		});

		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		// overdraw is the width of the 3d letters
		var textMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(80, 241, 242)', overdraw: 0.1} );
		text = new THREE.Mesh( text3d, textMaterial );

		text.position.x = centerOffset;
		text.position.y = 150 - 30*i;
		text.position.z = -100;

		group = new THREE.Object3D();
		group.add( text );
		groups.push(group);
		scene.add( group );
	}
}

function createLogo() {
	var texture = THREE.ImageUtils.loadTexture("images/space-shooter.png");
	var material = new THREE.MeshBasicMaterial({ map : texture });
	plane =  new THREE.Mesh(new THREE.PlaneGeometry(622, 200), material);

	plane.position.x = 0;
	plane.position.y = 150;
	plane.position.z = -100;

	scene.add(plane);
	console.log(scene.children);

	console.log(plane);
}

function createParagraph() {
	var paragraph = [];

	var title = "Episodio VIII";
	paragraph.push(title);

	paragraph.push("Turmoil has engulfed the");
	paragraph.push("Galatic Republic. The taxation");
	paragraph.push("of trade routed to outlying star");
	paragraph.push("systems is in dispute.");

	var size = 20;
	for (var i = 0; i < paragraph.length; i++) {

		if (paragraph[i] == title)	
			size = 40;
		else
			size = 20;

		var text3d = new THREE.TextGeometry( paragraph[i], {
			size: size,
			height: 1,
			curveSegments: 5,
			font: "helvetiker"
		});

		text3d.computeBoundingBox();
		var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
		// overdraw is the width of the 3d letters
		var textMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(244, 190, 25)', overdraw: 0.1} );
		// var textMaterial = new THREE.MeshLambertMaterial( { color: 0x50F1F2 } );
		text = new THREE.Mesh( text3d, textMaterial );

		text.position.x = centerOffset;
		text.position.y = -10*i;
		text.position.z = 300;

		if (i == 0)
			text.position.y = 60 - 10*i;

		text.rotation.x = 200;

		console.log(text.position);

		group = new THREE.Object3D();
		group.add( text );
		groups.push(group);
		scene.add( group );
	}
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

	if (clock.getElapsedTime() >= 5 && clearIntro) {
		clearIntro = false;
		var size = groups.length;
		for (var i = 0; i < size; i++){
			// groups[i].children[0].material.opacity = 0;
			scene.remove(groups[0]);
			groups.splice(0, 1);
		}
		sound.play();
	}

	if (clock.getElapsedTime() >= 7.7 && startLogo) {
		startLogo = false;
		createLogo();
	}

	if (clock.getElapsedTime() >= 15 && startParagraph) {
		startParagraph = false;
		createParagraph();
	}
}

function moveLogo() {
	plane.position.z -= 2;
	plane.scale.x -= 0.0012;
	plane.scale.y -= 0.0012;
}

function moveParagraph() {
	for (var i = 0; i < 6; i++) {
		var speed = [10,12,14,16,18,20];
		var delta = [1800, 1500, 1200, 900, 900, 900];
		for (var j = 0; j < groups.length; j++) {
			groups[j].children[0].position.y += i / delta[j];
			groups[j].children[0].position.z -= i / speed[j];
			groups[j].children[0].rotation.x -= 0.00001;
		}
	}
}

function render() {
	renderer.autoClear = false;
	renderer.clear();

	if (!startParagraph) {
		moveParagraph();
	}

	if (!startLogo) {
		moveLogo();
	}

	renderer.render( scene, camera );
}