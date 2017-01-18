var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var X = 600;
var Y = 600;
var BIRDS = 20;
var ANIMATING = true;
var MAX_VELOCITY = 100;

var vel, pos, acc, last;

function randPlusMinus(limit) {
  return (Math.random() - 0.5) * limit * 2;
}

function init() {
  vel = [];
  pos = [];
  acc = [];
  last = null;

  for (var i=0; i < BIRDS; i++) {
    vel[i] = $V([randPlusMinus(100), randPlusMinus(100)]);
    acc[i] = $V([0, 0]);
    pos[i] = $V([X/2 + randPlusMinus(100), Y/2 + randPlusMinus(100)]);
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

function drawCircle(centre, color) {
  ctx.fillStyle = color || "green";
  ctx.beginPath();
  ctx.arc(centre.e(1), centre.e(2), 3, 0, Math.PI*2, true)
  ctx.fill();
  ctx.stroke();
}

function drawBird(bird, color) {
  drawCircle(pos[bird], color);
  // drawVector(pos[bird], vel[bird]);
}

function eachNeighbour(bird, cb) {
  var birdPos = pos[bird];

  for (var i=0; i<BIRDS; i++) {
    if (bird === i) { continue }
    if (pos[i].subtract(birdPos).modulus() > 100) { continue }

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

function step(timestamp) {
  if (!ANIMATING) { return; }
  if (!last) { last = timestamp }
  var delta = (timestamp - last) / 1000;
  updateFrameRate(delta);
  last = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i=0; i < BIRDS; i++) {
    pos[i] = newPosition(i, delta);
    vel[i] = newVelocity(i, delta);
    acc[i] = newAcceleration(i, delta);

    drawBird(i);
  }

  drawCircle(flockCentroid(), "red");
  drawVector(flockCentroid(), flockVector());

  window.requestAnimationFrame(step);
}

init();
window.requestAnimationFrame(step);
