function Birds(dimensions, size, birds) {
  this._dimensions       = dimensions;
  this._size             = size;
  this._birds            = birds;
  this._min_velocity     = 40;
  this._max_velocity     = 150;
  this._neighbour_radius = 75;
  this._visible_angle    = Math.PI * .8;
  this._goal_limit       = 150;
  this.init();
}

Birds.prototype._meanVector = function(vs) {
  var sum = _.reduce(
    vs,
    function(sum, el) { return sum.add(el); },
    $V([0, 0])
  );

  if (vs.length > 1) {
    sum = sum.x(1/vs.length);
  }

  return sum;
}

Birds.prototype._clamp = function(vector, min, max) {
  var mod = vector.modulus();

  if (mod > max) {
    return vector.x(max / mod);
  } else if (mod < min) {
    return vector.x(min / mod);
  } else {
    return vector;
  }
}

Birds.prototype._randomVector = function(minMax) {
  return Vector.Random(this._dimensions).
    x(2 * minMax).
    map(function(e) { return e - minMax; })
};

Birds.prototype._sees = function(delta, velocity) {
  return (
    delta.modulus() <= this._neighbour_radius &&
    velocity.angleFrom(delta) < this._visible_angle
  );
}

Birds.prototype._repelVector = function(delta) {
  return delta.toUnitVector().x(-30/delta.modulus());
}

Birds.prototype._goalSeeking = function(from) {
  var heading = this._goal.subtract(from);

  return this._clamp(heading, 0, this._goal_limit);
}

Birds.prototype._updateGoal = function() {
  var obj = this;
  this._goal = this._randomVector(this._size / 3);
  window.setTimeout(function() { obj._updateGoal(); }, 5000);
}

Birds.prototype._updateAcceleration = function() {
  for (var i=0; i<this._birds; i++) {
    var repel = Vector.Zero(this._dimensions);
    var headings = [];
    var centroids = [];

    for (var j=0; j<this._birds; j++) {
      if (i !== j) {
        var iToj = this._pos[j].subtract(this._pos[i]);

        if (this._sees(iToj, this._vel[i])) {
          repel = repel.add(this._repelVector(iToj).x(15));
          headings.push(this._vel[j]);
          centroids.push(iToj);
        }
      }
    }

    var heading = this._meanVector(headings).x(1.5);
    var centroid = this._meanVector(centroids);
    var goal = this._goalSeeking(this._pos[i]);

    this._acc[i] = repel.add(heading).add(centroid).add(goal);
  }
}

Birds.prototype._updateVelocity = function(delta_t) {
  for (var i=0; i<this._birds; i++) {
    var v1 = this._vel[i].add(this._acc[i].x(delta_t));

    this._vel[i] = this._clamp(v1, this._min_velocity, this._max_velocity);
  }
}

Birds.prototype._updatePosition = function(delta_t) {
  for (var i=0; i<this._birds; i++) {
    this._pos[i] = this._pos[i].
      add(this._vel[i].x(delta_t)).
      add(this._acc[i].x(0.5 * delta_t * delta_t));
  }
}

Birds.prototype.init = function() {
  this._updateGoal();
  this._vel    = [];
  this._pos    = [];
  this._acc    = [];
  this._t_last = null;

  for (var i=0; i<this._birds; i++) {
    this._vel[i] = this._randomVector(100);
    this._acc[i] = Vector.Zero(this._dimensions);
    this._pos[i] = this._randomVector(this._size/2);
  }
};

Birds.prototype.tick = function(delta_t) {
  this._updateAcceleration();
  this._updateVelocity(delta_t);
  this._updatePosition(delta_t);
};

Birds.prototype.eachBird = function(cb) {
  for (var i=0; i<this._birds; i++) {
    cb(this._pos[i], this._vel[i], this._acc[i]);
  }
};
