import * as THREE from 'three';
import OrbitControls from '../vendor/orbitcontrols';
import Stats from '../vendor/stats';
import Bird from './bird';
import Goal from './goal';
import Animation from './animation';
import Models from './models';
import World from './world';
import createGui from './gui';

const container = document.querySelector('#container');

const X = 1280;
const Y = 720;

const SIZE = Math.sqrt((X ** 2) + (Y ** 2));
const DIMENSIONS = 3;

const VIEW_ANGLE = 45;
const ASPECT = X / Y;
const NEAR = 0.1;
const FAR = 10000;

const BIRDS = 150;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(X, Y);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.y = 500;
camera.position.z = 1000;
scene.add(camera);

const axesHelper = new THREE.AxisHelper(100);
scene.add(axesHelper);

const controls = new OrbitControls(camera);
controls.enableZoom = true;
controls.enablePan = true;

const ground = Models.ground(4000, 4000);
ground.rotation.x = Math.PI / 2;
ground.doubleSided = true;
scene.add(ground);

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 500;
scene.add(pointLight);

scene.add(new THREE.AmbientLight(0x404040));

const birdConfig = {
  dimensions: DIMENSIONS,
  size: SIZE,
  min_velocity: 40,
  max_velocity: 200,
  neighbour_radius: 75,
  visible_angle: Math.PI * 0.8,
  goal_limit: 150,
};

const world = new World(SIZE, DIMENSIONS);

for (let i = 0; i < BIRDS; i += 1) {
  world.birds.push(new Bird(birdConfig, scene));
}

world.goal = new Goal(world, scene);

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function draw(deltaT) {
  stats.begin();
  world.update(deltaT);
  renderer.render(scene, camera);
  stats.end();
}

const animation = new Animation(document, window, draw);

createGui(world, animation, birdConfig);

animation.play();
