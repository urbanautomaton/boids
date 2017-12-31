import { Vector } from '../vendor/sylvester';

function clamp(vector, min, max) {
  const mod = vector.modulus();

  if (mod > max) {
    return vector.x(max / mod);
  } else if (mod < min) {
    return vector.x(min / mod);
  }

  return vector;
}

function meanVector(vs, dimensions) {
  let sum = vs.reduce(
    (acc, el) => (acc.add(el)),
    Vector.Zero(dimensions),
  );

  if (vs.length > 1) {
    sum = sum.x(1 / vs.length);
  }

  return sum;
}

function repelVector(delta) {
  return delta.toUnitVector().x(-30 / delta.modulus());
}

function randomVector(minMax, dimensions) {
  return Vector.Random(dimensions)
    .x(2 * minMax)
    .map(e => (e - minMax));
}

function Birds(dimensions, size, birds) {
  this.dimensions       = dimensions;
  this.size             = size;
  this.birds            = birds;
  this.min_velocity     = 40;
  this.max_velocity     = 200;
  this.neighbour_radius = 75;
  this.visible_angle    = Math.PI * 0.8;
  this.goal_limit       = 150;
  this.init();
}

Birds.prototype.sees = function sees(delta, velocity) {
  return (
    delta.modulus() <= this.neighbour_radius &&
    velocity.angleFrom(delta) < this.visible_angle
  );
};

Birds.prototype.goalSeeking = function goalSeeking(from) {
  const heading = this.goal.subtract(from);

  return clamp(heading, 0, this.goal_limit);
};

Birds.prototype.updateGoal = function updateGoal() {
  const obj = this;
  this.goal = randomVector(this.size / 3, this.dimensions);
  window.setTimeout(() => { obj.updateGoal(); }, 5000);
};

Birds.prototype.updateAcceleration = function updateAcceleration() {
  let i;
  let j;

  for (i = 0; i < this.birds; i += 1) {
    let repel = Vector.Zero(this.dimensions);
    const headings = [];
    const centroids = [];

    for (j = 0; j < this.birds; j += 1) {
      if (i !== j) {
        const iToj = this.pos[j].subtract(this.pos[i]);

        if (this.sees(iToj, this.vel[i])) {
          repel = repel.add(repelVector(iToj).x(15));
          headings.push(this.vel[j]);
          centroids.push(iToj);
        }
      }
    }

    const heading = meanVector(headings, this.dimensions).x(1.5);
    const centroid = meanVector(centroids, this.dimensions);
    const goal = this.goalSeeking(this.pos[i]);

    this.acc[i] = repel.add(heading).add(centroid).add(goal);
  }
};

Birds.prototype.updateVelocity = function updateVelocity(deltaT) {
  let i;

  for (i = 0; i < this.birds; i += 1) {
    const v1 = this.vel[i].add(this.acc[i].x(deltaT));

    this.vel[i] = clamp(v1, this.min_velocity, this.max_velocity);
  }
};

Birds.prototype.updatePosition = function updatePosition(deltaT) {
  let i;

  for (i = 0; i < this.birds; i += 1) {
    this.pos[i] = this.pos[i]
      .add(this.vel[i].x(deltaT))
      .add(this.acc[i].x(0.5 * deltaT * deltaT));
  }
};

Birds.prototype.init = function init() {
  this.updateGoal();
  this.vel    = [];
  this.pos    = [];
  this.acc    = [];
  let i;

  for (i = 0; i < this.birds; i += 1) {
    this.vel[i] = randomVector(100, this.dimensions);
    this.acc[i] = Vector.Zero(this.dimensions);
    this.pos[i] = randomVector(this.size / 2, this.dimensions);
  }
};

Birds.prototype.tick = function tick(deltaT) {
  this.updateAcceleration();
  this.updateVelocity(deltaT);
  this.updatePosition(deltaT);
};

Birds.prototype.eachBird = function eachBird(cb) {
  let i;

  for (i = 0; i < this.birds; i += 1) {
    cb(i, this.pos[i], this.vel[i], this.acc[i]);
  }
};

export default Birds;
