class World {
  constructor(size, dimensions) {
    this.size = size;
    this.dimensions = dimensions;
    this.birds = [];
  }

  update(deltaT) {
    this.birds.forEach((bird) => { bird.update(deltaT, this); });
    this.goal.update(deltaT, this);
  }
}

export default World;
