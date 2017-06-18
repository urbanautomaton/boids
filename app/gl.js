import * as THREE from 'three';
import Birds from './birds';
import Animation from './animation';

// Get the DOM element to attach to
const container = document.querySelector('#container');

// const SHOW_ACCELERATION = false;

// Set the scene size.
const X = 1280;
const Y = 720;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = X / Y;
const NEAR = 0.1;
const FAR = 10000;

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.z = 500;

const scene = new THREE.Scene();

const birds = [];

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(X, Y);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

// Set up the bird vars
const RADIUS = 5;
const HEIGHT = 15;

const goalMaterial = new THREE.MeshPhongMaterial({
  color: 0xCC0000,
  emissive: 0x340725,
  side: THREE.DoubleSide,
  shading: THREE.FlatShading,
});

const goalMarker = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS),
  goalMaterial,
);

scene.add(goalMarker);

// create the bird's material
const birdMaterial = new THREE.MeshPhongMaterial({
  color: 0x156289,
  emissive: 0x072534,
  side: THREE.DoubleSide,
  shading: THREE.FlatShading,
});

const birdModel = new THREE.Mesh(
  new THREE.ConeGeometry(RADIUS, HEIGHT),
  birdMaterial,
);

// create a point light
const pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

const BIRDS = 150;

// function drawBird(i, pos, vel, acc) {
function drawBird(i, pos, vel) {
  const direction = new THREE.Vector3(vel.e(1), vel.e(2), vel.e(3)).normalize();
  const rotationAxis = new THREE.Vector3(0, 1, 0);

  // if (SHOW_ACCELERATION) { do something }

  birds[i].position.set(pos.e(1), pos.e(2), pos.e(3) - 600);
  birds[i].quaternion.setFromUnitVectors(rotationAxis, direction);
}

function updateFrameRate(deltaT) {
  const rate = 1 / deltaT;
  const element = document.getElementById('frame-rate');

  if (element) {
    element.textContent = Math.round(rate * 100) / 100;
  }
}

const simulation = new Birds(3, Math.sqrt((X ** 2) + (Y ** 2)), BIRDS);

function draw(deltaT) {
  const goal = simulation.goal;

  updateFrameRate(deltaT);
  simulation.tick(deltaT);

  renderer.render(scene, camera);
  simulation.eachBird(drawBird);
  goalMarker.position.set(goal.e(1), goal.e(2), goal.e(3) - 600);
}

const animation = new Animation(document, window, draw);

simulation.eachBird((i, pos) => {
  const bird = birdModel.clone();
  birds.push(bird);
  bird.position.set(pos.e(1), pos.e(2), pos.e(3) - 600);
  scene.add(bird);
});

const reset = document.getElementById('reset-sim');
const toggle = document.getElementById('toggle-anim');

if (reset) { reset.addEventListener('click', simulation.init.bind(simulation), false); }
if (toggle) { toggle.addEventListener('click', animation.toggle.bind(animation), false); }

animation.play();
