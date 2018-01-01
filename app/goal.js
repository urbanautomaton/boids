import { Vector } from '../vendor/sylvester';
import { randomVector } from './vectorUtil';
import Models from './models';

class Goal {
  constructor(world, scene) {
    this.goalMarker = Models.goalMarker(10);
    this.setPosition(world);

    scene.add(this.goalMarker);
  }

  update() {
    this.goalMarker.position.set(this.pos.e(1), this.pos.e(2), this.pos.e(3));
  }

  setPosition(world) {
    this.pos = randomVector(world.size / 3, world.dimensions).add(Vector.create([0, 500, 0]));
    window.setTimeout(() => { this.setPosition(world); }, 5000);
  }
}

export default Goal;
