import * as THREE from 'three';
import { clamp, meanVector, randomVector } from './vectorUtil';
import { Vector } from '../vendor/sylvester';
import Models from './models';

const RADIUS = 5;
const HEIGHT = 15;

function repelVector(delta) {
  return delta.toUnitVector().x(-30 / delta.modulus());
}

class Bird {
  constructor(config, scene) {
    this.config = config;
    this.scene = scene;
    this.model = Models.bird(RADIUS, HEIGHT).clone();
    this.init();

    scene.add(this.model);
  }

  init() {
    this.vel = randomVector(100, this.config.dimensions);
    this.acc = Vector.Zero(this.config.dimensions);
    this.pos = randomVector(this.config.size / 2, this.config.dimensions)
      .add(Vector.create([0, 500, 0]));
  }

  update(deltaT, world) {
    this.updateAcceleration(world);
    this.updateVelocity(deltaT);
    this.updatePosition(deltaT);
    this.draw();
  }

  updateAcceleration(world) {
    let repel = Vector.Zero(this.config.dimensions);
    const headings = [];
    const centroids = [];

    world.birds.forEach((bird) => {
      const iToj = bird.pos.subtract(this.pos);

      if (bird !== this && this.sees(iToj)) {
        repel = repel.add(repelVector(iToj).x(15));
        headings.push(bird.vel);
        centroids.push(iToj);
      }
    });

    const heading = meanVector(headings, this.config.dimensions).x(1.5);
    const centroid = meanVector(centroids, this.config.dimensions);
    const goal = this.goalSeeking(this.pos);

    this.acc = repel.add(heading).add(centroid).add(goal);
  }

  updateVelocity(deltaT) {
    const v1 = this.vel.add(this.acc.x(deltaT));

    this.vel = clamp(v1, this.config.min_velocity, this.config.max_velocity);
  }

  updatePosition(deltaT) {
    this.pos = this.pos
      .add(this.vel.x(deltaT))
      .add(this.acc.x(0.5 * deltaT * deltaT));
  }

  draw() {
    const direction = new THREE.Vector3(this.vel.e(1), this.vel.e(2), this.vel.e(3)).normalize();
    const rotationAxis = new THREE.Vector3(0, 1, 0);

    this.model.position.set(this.pos.e(1), this.pos.e(2), this.pos.e(3));
    this.model.quaternion.setFromUnitVectors(rotationAxis, direction);
  }

  goalSeeking(from) {
    const heading = this.config.goal.subtract(from);

    return clamp(heading, 0, this.config.goal_limit);
  }

  sees(toOther) {
    return (
      toOther.modulus() <= this.config.neighbour_radius &&
      this.vel.angleFrom(toOther) < this.config.visible_angle
    );
  }
}

export default Bird;
