var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var X = 600;
var Y = 600;
var BIRDS = 20;

var vel = [];
var pos = [];
var acc = [];
var last = null;

function randPlusMinus(limit) {
  return (Math.random() - 0.5) * limit * 2;
}

for (var i=0; i < BIRDS; i++) {
  vel[i] = $V([randPlusMinus(100), randPlusMinus(100)]);
  acc[i] = $V([0, 0]);
  pos[i] = $V([X/2 + randPlusMinus(100), Y/2 + randPlusMinus(100)]);
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
  drawVector(pos[bird], vel[bird]);
}

function eachNeighbour(bird, cb) {
  for (var i=0; i<BIRDS; i++) {
    if (bird === pos[i]) { continue }
    if (pos[i].subtract(bird).modulus() > 100) { continue }

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
    var delta = other.subtract(bird);
    var heading = delta.x(-1/delta.modulus());

    vector = vector.add(heading);
  });

  return vector;
}

function birdVelocity(bird) {
  var _centroid = flockCentroid().subtract(bird);
  var _heading = flockVector();
  var _repel = repelVector(bird).x(5);

  return _heading.add(_centroid).add(_repel);
}

function updateFrameRate(delta) {
  var rate = 1 / delta * 1000;

  var element = document.getElementById('frame-rate');
  element.textContent = Math.round(rate * 100) / 100;
}

function step(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!last) { last = timestamp }
  var delta = timestamp - last;
  updateFrameRate(delta);

  last = timestamp;

  for (var i=0; i < BIRDS; i++) {
    vel[i] = birdVelocity(pos[i]);
    pos[i] = pos[i].add(vel[i].x(delta / 1000));

    drawBird(i);
  }

  drawCircle(flockCentroid(), "red");
  drawVector(flockCentroid(), flockVector());

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
