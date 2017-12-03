import * as THREE from 'three';

const Models = {};

const birdMaterial = new THREE.MeshPhongMaterial({
  color: 0x156289,
  emissive: 0x072534,
  side: THREE.DoubleSide,
});

const treeMaterial = new THREE.MeshPhongMaterial({
  color: 0x2c6d06,
  emissive: 0x072534,
  side: THREE.DoubleSide,
  shading: THREE.FlatShading,
});

Models.bird = (radius, height) => new THREE.Mesh(
  new THREE.ConeGeometry(radius, height),
  birdMaterial,
);

Models.tree = (radius, height) => {
  const combinedGeometry = new THREE.Geometry();

  [0, 1.5, 3.0].forEach((step) => {
    const coneGeometry = new THREE.ConeGeometry(radius - step, height);
    const coneMesh = new THREE.Mesh(coneGeometry);
    coneMesh.position.y = step * radius;
    coneMesh.updateMatrix();
    combinedGeometry.merge(coneMesh.geometry, coneMesh.matrix);
  });

  return new THREE.Mesh(combinedGeometry, treeMaterial);
};

export default Models;
