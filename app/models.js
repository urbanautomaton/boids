import * as THREE from 'three';

const Models = {};

const birdMaterial = new THREE.MeshPhongMaterial({
  color: 0x156289,
  emissive: 0x072534,
  side: THREE.DoubleSide,
});

Models.bird = (radius, height) => new THREE.Mesh(
  new THREE.ConeGeometry(radius, height),
  birdMaterial,
);

const groundMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});

Models.ground = (width, length) => new THREE.Mesh(
  new THREE.PlaneGeometry(width, length),
  groundMaterial,
);

const goalMaterial = new THREE.MeshPhongMaterial({
  color: 0xCC0000,
  emissive: 0x340725,
  side: THREE.DoubleSide,
});

Models.goalMarker = radius => new THREE.Mesh(
  new THREE.SphereGeometry(radius),
  goalMaterial,
);

export default Models;
