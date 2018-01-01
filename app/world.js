import { Vector } from '../vendor/sylvester';
import { randomVector } from './vectorUtil';

class World {
  constructor(size, dimensions) {
    this.size = size;
    this.dimensions = dimensions;
    this.birds = [];

    this.updateGoal();
  }

  updateGoal() {
    this.goal = randomVector(this.size / 3, this.dimensions).add(Vector.create([0, 500, 0]));
    window.setTimeout(() => { this.updateGoal(); }, 5000);
  }
}

export default World;
