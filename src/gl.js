// Get the DOM element to attach to
const container = document.querySelector('#container');

// Set the scene size.
const X = 640;
const Y = 480;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = X / Y;
const NEAR = 0.1;
const FAR = 10000;

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

camera.position.z = 500;

const scene = new THREE.Scene();

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(X, Y);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

// Set up the sphere vars
const RADIUS = 5;
const SEGMENTS = 16;
const RINGS = 16;

// create the sphere's material
const sphereMaterial = new THREE.MeshLambertMaterial( {
  color: 0xCC0000
});

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    RADIUS,
    SEGMENTS,
    RINGS),

  sphereMaterial);

// sphere.position.z = -300

// for (var i=0; i<100; i++) {
//   var range = 300
//   var clone = sphere.clone();
//   clone.position.x += (Math.random() * range) - range/2;
//   clone.position.y += (Math.random() * range) - range/2;
//   clone.position.z += (Math.random() * range) - range/2;
//   console.log(clone.position);
//   scene.add(clone);
// }

// create a point light
const pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

var BIRDS = 150;

function drawBird(i, pos, vel, acc) {
  spheres[i].position.set(pos.e(1), pos.e(2), pos.e(3) - 600);
}

function updateFrameRate(delta_t) {
  var rate = 1 / delta_t;

  var element = document.getElementById('frame-rate');
  if (element) {
    element.textContent = Math.round(rate * 100) / 100;
  }
}

function draw(delta_t) {
  updateFrameRate(delta_t);
  simulation.tick(delta_t);

  renderer.render(scene, camera);
  simulation.eachBird(drawBird);
  // drawCircle(simulation._goal, 3, "red", true);
}

var simulation = new Birds(3, Math.sqrt(X**2 + Y**2), BIRDS);
var animation = new Animation(document, window, draw);

var spheres = [];

simulation.eachBird(function(i, pos) {
  var bird = sphere.clone();
  spheres.push(bird);
  bird.position.set(pos.e(1), pos.e(2), pos.e(3) - 600);
  scene.add(bird);
});

animation.play();
