import * as THREE from 'three';
import * as dat from '../vendor/dat.gui';
import OrbitControls from '../vendor/orbitcontrols';
import Birds from './birds';
import Animation from './animation';
import Models from './models';

// Get the DOM element to attach to
const container = document.querySelector('#container');

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
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.z = 2000;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxisHelper(100);
scene.add(axesHelper);

const birds = [];

const controls = new OrbitControls(camera);
controls.enableZoom = true;

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
});

const goalMarker = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS),
  goalMaterial,
);

scene.add(goalMarker);

const ground = Models.ground(4000, 4000);
ground.receiveShadow = true;
ground.rotation.x = Math.PI / 2;
ground.doubleSided = true;
ground.position.y = -500;
scene.add(ground);

// create a point light
const pointLight = new THREE.DirectionalLight(0xFFFFFF);
// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

pointLight.castShadow = true;
// pointLight.shadow.camera.near = 0.5;    // default
pointLight.shadow.camera.far = 5000;

// add to the scene
scene.add(pointLight);

const lightMaterial = new THREE.MeshPhongMaterial({
  color: 0xf4f142,
  side: THREE.DoubleSide,
});
const lightMarker = new THREE.Mesh(
  new THREE.SphereGeometry(RADIUS),
  lightMaterial,
);
lightMarker.position.setFromMatrixPosition(pointLight.matrixWorld);
scene.add(lightMarker);

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(helper);

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
  const bird = Models.bird(RADIUS, HEIGHT).clone();
  bird.castShadow = true;
  birds.push(bird);
  bird.position.set(pos.e(1), pos.e(2), pos.e(3) - 600);
  scene.add(bird);
});

const paramStore = {
  Reset: () => { simulation.init(); },
  'Play/Pause': () => { animation.toggle(); },
};

const gui = new dat.GUI();
gui.add(paramStore, 'Reset');
gui.add(paramStore, 'Play/Pause');

const sim = gui.addFolder('Simulation');
sim.add(simulation, 'minvelocity', 0, 100);
sim.add(simulation, 'maxvelocity', 100, 300);
sim.add(simulation, 'neighbour_radius', 10, 200);
sim.add(simulation, 'goal_limit', 50, 200);
sim.open();

const geom = gui.addFolder('Positioning');
geom.add(ground.position, 'y', -1000, -500);
geom.open();

const cam = gui.addFolder('Camera');
cam.add(camera.position, 'x').listen();
cam.add(camera.position, 'y').listen();
cam.add(camera.position, 'z').listen();
cam.open();

animation.play();
