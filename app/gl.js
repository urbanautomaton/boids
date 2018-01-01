import * as THREE from 'three';
import OrbitControls from '../vendor/orbitcontrols';
import { Vector } from '../vendor/sylvester';
import { randomVector } from './vectorUtil';
import Bird from './bird';
import Animation from './animation';
import Models from './models';
import createGui from './gui';

// Get the DOM element to attach to
const container = document.querySelector('#container');

// Set the scene size.
const X = 1280;
const Y = 720;

const SIZE = Math.sqrt((X ** 2) + (Y ** 2));
const DIMENSIONS = 3;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = X / Y;
const NEAR = 0.1;
const FAR = 10000;

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

camera.position.y = 500;
camera.position.z = 1000;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxisHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera);
controls.enableZoom = true;
controls.enablePan = true;

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(X, Y);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

const goalMarker = Models.goalMarker(10);
scene.add(goalMarker);

const ground = Models.ground(4000, 4000);
ground.rotation.x = Math.PI / 2;
ground.doubleSided = true;
scene.add(ground);

// create a point light
const pointLight = new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 500;

// add to the scene
scene.add(pointLight);

const BIRDS = 150;

function updateFrameRate(deltaT) {
  const rate = 1 / deltaT;
  const element = document.getElementById('frame-rate');

  if (element) {
    element.textContent = Math.round(rate * 100) / 100;
  }
}

const birdConfig = {
  dimensions: DIMENSIONS,
  size: SIZE,
  min_velocity: 40,
  max_velocity: 200,
  neighbour_radius: 75,
  visible_angle: Math.PI * 0.8,
  goal_limit: 150,
  goal: randomVector(SIZE / 3, DIMENSIONS),
};

function updateGoal() {
  birdConfig.goal = randomVector(SIZE / 3, DIMENSIONS).add(Vector.create([0, 500, 0]));
  window.setTimeout(() => { updateGoal(); }, 5000);
}

updateGoal();

const world = {
  birds: [],
};

for (let i = 0; i < BIRDS; i += 1) {
  world.birds.push(new Bird(birdConfig, scene));
}

function draw(deltaT) {
  const goal = birdConfig.goal;

  updateFrameRate(deltaT);
  world.birds.forEach((bird) => { bird.update(deltaT, world); });
  goalMarker.position.set(goal.e(1), goal.e(2), goal.e(3) - 600);

  renderer.render(scene, camera);
}

const animation = new Animation(document, window, draw);

createGui(world, animation, birdConfig);

animation.play();
