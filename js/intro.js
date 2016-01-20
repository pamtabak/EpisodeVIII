var container, stats;
var camera, scene, renderer;
var group, text, text2;
var wholeText = [];
var groups = [];

var clock;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Initializing scene
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 160, 200 );

	// set clear color as transparent, so the background doenst disappear
	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight );	
	container.appendChild( renderer.domElement );

	clock = new THREE.Clock();

	createIntroText();

// 	var theText      = "Star Wars"
// 	var theText2     = "Em uma sala de aula na UFRJ, em pleno verao...";
//     var theText3     = "It is a period of civil war. Rebel"
// 	var theText4     = "spaceships, striking from a hidden"
// 	var theText5     = "base, have won their first victory"
// 	var theText6     = "against the evil Galactic Empire."

// 	// Get text from hash
// 	var hash = document.location.hash.substr( 1 );
// 	if ( hash.length !== 0 ) {
// 		theText = hash;
// 	}

// 	//--------------------------- TEST PART --------------------------
// 	//Adding each sentence separately cause I didn't get yet how to do it another way.

// 	var text3d2 = new THREE.TextGeometry( theText2, {
// 		size: 20,
// 		//height seems to change the volume of the text
// 		height: 5,
// 		curveSegments: 5,
// 		font: "helvetiker"
// 	});

// 	text3d2.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d2.boundingBox.max.x - text3d2.boundingBox.min.x );
// 	var textMaterial2 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 0)', overdraw: 0.1 });
// 	text2 = new THREE.Mesh( text3d2, textMaterial2 );

// 	text2.position.x = centerOffset;
// 	text2.position.y = 60;
// 	text2.position.z = 300;

// 	//Gives the text an angle
// 	text2.rotation.x = 150;
// 	//text2.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text2 );
// 	scene.add( group );

//     //--------------------- 3rd sentence -----------------

// 	var text3d3 = new THREE.TextGeometry( theText3, {
// 		size: 18,
// 		//height seems to change the volume of the text
// 		height: 5,
// 		curveSegments: 5,
// 		font: "helvetiker"
// 	});

// 	text3d3.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d3.boundingBox.max.x - text3d3.boundingBox.min.x );
// 	var textMaterial3 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 10)', overdraw: 0.1 });
// 	text3 = new THREE.Mesh( text3d3, textMaterial3 );

// 	text3.position.x = centerOffset;
// 	text3.position.y = 50;
// 	text3.position.z = 300;

// 	//Gives the text an angle
// 	text3.rotation.x = 150;
// 	//text2.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text3 );
// 	scene.add( group );

// //---------------------- 4th sentence ---------------------
// 	var text3d4 = new THREE.TextGeometry( theText4, {
// 		size: 16,
// 		//height seems to change the volume of the text
// 		height: 5,
// 		curveSegments: 5,
// 		font: "helvetiker"
// 	});

// 	text3d4.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d4.boundingBox.max.x - text3d4.boundingBox.min.x );

// 	var textMaterial4 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 10)', overdraw: 0.1 });
// 	text4 = new THREE.Mesh( text3d4, textMaterial4 );

// 	text4.position.x = centerOffset;
// 	text4.position.y = 40;
// 	text4.position.z = 300;

// 	//Gives the text an angle
// 	text4.rotation.x = 150;
// 	//text2.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text4 );
// 	scene.add( group );

// //------------------------- 5th sentence ------------------------

// 	var text3d5 = new THREE.TextGeometry( theText5, {
// 		size: 14,
// 		//height seems to change the volume of the text
// 		height: 5,
// 		curveSegments: 5,
// 		font: "helvetiker"
// 	});

// 	text3d5.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d5.boundingBox.max.x - text3d5.boundingBox.min.x );

// 	var textMaterial5 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 10)', overdraw: 0.1 });
// 	text5 = new THREE.Mesh( text3d5, textMaterial5 );

// 	text5.position.x = centerOffset;
// 	text5.position.y = 30;
// 	text5.position.z = 300;

// 	//Gives the text an angle
// 	text5.rotation.x = 150;
// 	//text2.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text5 );
// 	scene.add( group );

// //----------------------6th sentence-----------------------------

// 	var text3d6 = new THREE.TextGeometry( theText6, {
// 		size: 12,
// 		//height seems to change the volume of the text
// 		height: 5,
// 		curveSegments: 5,
// 		font: "helvetiker"
// 	});

// 	text3d6.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d6.boundingBox.max.x - text3d6.boundingBox.min.x );

// 	var textMaterial6 = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 10)', overdraw: 0.1 });
// 	text6 = new THREE.Mesh( text3d6, textMaterial6 );

// 	text6.position.x = centerOffset;
// 	text6.position.y = 20;
// 	text6.position.z = 300;

// 	//Gives the text an angle
// 	text6.rotation.x = 150;
// 	//text2.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text6 );
// 	scene.add( group );

// //---------------------------------------------------------------

// 	var text3d = new THREE.TextGeometry( theText, {
// 		size: 50,
// 		height: 10,
// 		curveSegments: 5,
// 		font: "helvetiker"

// 	});

// 	text3d.computeBoundingBox();
// 	var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

// 	// var textMaterial = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } );
// 	//The previous color of the text was randomised but I wanted it to be the Star Wars yellow.
// 	var textMaterial = new THREE.MeshBasicMaterial( { color: 'rgb(253, 221, 0)', overdraw: 0.1 } );
// 	//overdraw is the width of the 3D letters;
// 	text = new THREE.Mesh( text3d, textMaterial );

// 	text.position.x = centerOffset;
// 	text.position.y = 100;
// 	text.position.z = 200;

// 	//Gives the text an angle
// 	text.rotation.x = 150;
// 	text.rotation.y = Math.PI * 2;

// 	group = new THREE.Object3D();
// 	group.add( text );

// 	scene.add( group );

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

	var longTimeAgo1 = "Em uma sala de aula na UFRJ,";
	var longTimeAgo2 = "em pleno verao...";
	paragraph.push(longTimeAgo1);
	paragraph.push(longTimeAgo2);

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
		// var textMaterial = new THREE.MeshLambertMaterial( { color: 0x50F1F2 } );
		text = new THREE.Mesh( text3d, textMaterial );

		text.position.x = centerOffset;
		text.position.y = 150 - 30*i;
		text.position.z = -100;

		wholeText.push(text);

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

	if (clock.getElapsedTime() >= 5 && groups.length > 0){
		var size = groups.length;
		for (var i = 0; i < size; i++){
			// groups[i].children[0].material.opacity = 0;
			scene.remove(groups[0]);
			groups.splice(0, 1);
		}
	}
}

function render() {
	renderer.autoClear = false;
	renderer.clear();
	// Makes the text go slower and disappear
	// for(var i = 0; i < 6; i++){
	//  	text.position.z -= i / 4
	//  	text2.position.z -= i / 4
	//  	text3.position.z -= i / 5
	//  	text4.position.z -= i / 6
	//  	text5.position.z -= i / 7
	//  	text6.position.z -= i / 8
	// }
	// for(var i = 0; i < 6; i++){
	// 	for (var i = 0; i < wholeText.length; i++) {
	// 		wholeText[i].position.z -= i/4;
	// 	}
	// }

	renderer.render( scene, camera );
}