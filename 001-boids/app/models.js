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

export default Models;
