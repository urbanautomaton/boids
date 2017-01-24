var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var X = 600;
var Y = 600;
var BIRDS = 25;
var ANIMATING = true;
var MAX_VELOCITY = 100;
var NEIGHBOUR_RADIUS = 100;

var vel, pos, acc, last, visibility_matrix;

function randPlusMinus(limit) {
  return (Math.random() - 0.5) * limit * 2;
}

function init() {
  vel = [];
  pos = [];
  acc = [];
  last = null;
  visibility_matrix = new Array(BIRDS);

  for (var i=0; i < BIRDS; i++) {
    vel[i] = $V([randPlusMinus(100), randPlusMinus(100)]);
    acc[i] = $V([0, 0]);
    pos[i] = $V([X/2 + randPlusMinus(200), Y/2 + randPlusMinus(200)]);
    visibility_matrix[i] = new Array(BIRDS);
  }
}

function toggleAnimation() {
  if (ANIMATING) {
    ANIMATING = false;
  } else {
    ANIMATING = true;
    last = null;
    window.requestAnimationFrame(step);
  }
}

function drawCircle(centre, radius, color, stroke) {
  ctx.fillStyle = color
  ctx.beginPath();
  ctx.arc(centre.e(1), centre.e(2), radius, 0, Math.PI*2, true)
  ctx.fill();
  if (stroke) { ctx.stroke(); }
}

function drawBird(bird) {
  // drawCircle(pos[bird], NEIGHBOUR_RADIUS, "rgba(255, 0, 0, 0.1)");
  drawCircle(pos[bird], 3, "green", true);
  drawVector(pos[bird], repelVector(bird));
  // drawVector(pos[bird], vel[bird]);
}

function eachNeighbour(bird, cb) {
  var birdPos = pos[bird];

  for (var i=0; i<BIRDS; i++) {
    if (bird === i) { continue; }
    if (!isNeighbour(bird, i)) { continue; }

    cb(pos[i]);
  }
}

function drawVector(start, vector) {
  var newPos = start.add(vector);

  ctx.beginPath();
  ctx.moveTo(start.e(1), start.e(2));
  ctx.lineTo(newPos.e(1), newPos.e(2));
  ctx.stroke();
}

function flockCentroid() {
  var centroid = $V([0, 0]);

  for (var i=0; i<BIRDS; i++) {
    centroid = centroid.add(pos[i]);
  }

  return centroid.x(1/BIRDS);
}

function flockVector() {
  var vector = $V([0, 0]);

  for (var i=0; i<BIRDS; i++) {
    vector = vector.add(vel[i]);
  }

  return vector.x(1/BIRDS);
}

function repelVector(bird) {
  var vector = $V([0, 0]);

  eachNeighbour(bird, function(other) {
    var delta = other.subtract(pos[bird]);
    var heading = delta.x(-1/delta.modulus());

    vector = vector.add(heading);
  });

  return vector;
}

function updateFrameRate(delta) {
  var rate = 1 / delta;

  var element = document.getElementById('frame-rate');
  element.textContent = Math.round(rate * 100) / 100;
}

function newPosition(bird, delta_t) {
  return pos[bird].add(
    vel[bird].x(delta_t)
  ).add(
    acc[bird].x(0.5 * delta_t * delta_t)
  );
}

function newVelocity(bird, delta_t) {
  var v1 = vel[bird].add(acc[bird].x(delta_t));
  if (v1.modulus() > MAX_VELOCITY) {
    v1 = v1.x(MAX_VELOCITY / v1.modulus());
  }
  return v1;
}

function newAcceleration(bird, delta_t) {
  var _centroid = flockCentroid().subtract(pos[bird]);
  var _heading = flockVector();
  var _repel = repelVector(bird).x(5);
  var _center = $V([300, 300]).subtract(pos[bird]);

  return _heading.add(_centroid).add(_repel).add(_center);
}

function isNeighbour(bird, other) {
  if (visibility_matrix[bird][other]) {
    return true;
  }
}

function calculateVisibility() {
  for (var i=0; i<BIRDS; i++) {
    for (var j=i; j<BIRDS; j++) {
      if (i === j) {
        visibility_matrix[i][j] = 0;
      } else if (pos[i].subtract(pos[j]).modulus() > NEIGHBOUR_RADIUS) {
        visibility_matrix[i][j] = 0;
        visibility_matrix[j][i] = 0;
      } else {
        visibility_matrix[i][j] = 1;
        visibility_matrix[j][i] = 1;
      }
    }
  }
}

function step(timestamp) {
  if (!ANIMATING) { return; }
  if (!last) { last = timestamp }
  var delta = (timestamp - last) / 1000;
  updateFrameRate(delta);
  last = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i=0; i < BIRDS; i++) {
    calculateVisibility();
    pos[i] = newPosition(i, delta);
    vel[i] = newVelocity(i, delta);
    acc[i] = newAcceleration(i, delta);

    drawBird(i);
  }

  drawCircle(flockCentroid(), 3, "red", true);
  drawVector(flockCentroid(), flockVector());

  window.requestAnimationFrame(step);
}

init();
window.requestAnimationFrame(step);
