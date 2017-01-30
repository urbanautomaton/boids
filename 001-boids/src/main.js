var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var X = canvas.width;
var Y = canvas.height;
var SCALE = 0.5;
var BIRDS = 150;
var ANIMATING = true;
var ANIMATION_REQUEST_IDS = [];

ctx.save();
ctx.translate(canvas.width/2, canvas.height/2);
ctx.scale(SCALE, SCALE);

var last;
var simulation = new Birds(2, Math.sqrt(X**2 + Y**2), BIRDS);
simulation.init();

function pause() {
  if (ANIMATING) {
    ANIMATING = false;
    for (var i=0; i<ANIMATION_REQUEST_IDS.length; i++) {
      window.cancelAnimationFrame(ANIMATION_REQUEST_IDS[i]);
    }
  }
}

function play() {
  if (!ANIMATING) {
    ANIMATING = true;
    last = null;
    window.requestAnimationFrame(step);
  }
}

function toggleAnimation() {
  if (ANIMATING) {
    pause();
  } else {
    play();
  }
}

function drawCircle(centre, radius, color, stroke) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centre.e(1), centre.e(2), radius, 0, Math.PI*2, true)
  ctx.fill();
  if (stroke) { ctx.stroke(); }
}

function drawTriangle(centre, heading, color, stroke) {
  var deltas = [
    $V([-1.0, 0]),
    $V([0, 3.0]),
    $V([1.0, 0]),
    $V([0, 0])
  ];
  var angle = heading.angleFrom($V([0, 1])) * -Math.sign(heading.e(1));

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centre.e(1), centre.e(2));
  for (var i=0; i<deltas.length; i++) {
    var point = centre.add(deltas[i].rotate(angle, $V([0, 0])).x(5));
    ctx.lineTo(point.e(1), point.e(2));
  }
  ctx.fill();
  if (stroke) { ctx.stroke(); }
}

function drawBird(pos, vel, acc) {
  // if (bird === 1) {
  //   drawCircle(pos[bird], NEIGHBOUR_RADIUS, "rgba(255, 0, 0, 0.1)");
  //   drawVector(pos[bird], allRepels[bird], "red");
  //   drawVector(pos[bird], allHeadings[bird], "green");
  //   drawVector(pos[bird], allCentroids[bird], "black");
  //   drawVector(pos[bird], allGoals[bird], "blue");
  // }
  drawTriangle(pos, vel, "green", true);
}

function drawVector(start, vector, color) {
  var newPos = start.add(vector);
  var originalStrokeStyle = ctx.strokeStyle;

  ctx.strokeStyle = color || "black";
  ctx.beginPath();
  ctx.moveTo(start.e(1), start.e(2));
  ctx.lineTo(newPos.e(1), newPos.e(2));
  ctx.stroke();

  ctx.strokeStyle = originalStrokeStyle;
}

function updateFrameRate(delta) {
  var rate = 1 / delta;

  var element = document.getElementById('frame-rate');
  if (element) {
    element.textContent = Math.round(rate * 100) / 100;
  }
}

function step(timestamp) {
  if (!ANIMATING) { return; }
  if (!last) { last = timestamp }
  var delta_t = (timestamp - last) / 1000;
  last = timestamp;

  ctx.clearRect(-X/(2*SCALE), -Y/(2*SCALE), X/SCALE, Y/SCALE);

  updateFrameRate(delta_t);
  simulation.tick(delta_t);
  simulation.eachBird(drawBird);
  drawCircle(simulation._goal, 3, "red", true);

  if (ANIMATING) {
    ANIMATION_REQUEST_IDS.push(window.requestAnimationFrame(step));
  }
}

ANIMATION_REQUEST_IDS.push(window.requestAnimationFrame(step));

function init() {
  simulation.init();
}

function updateGoal() {
  simulation.updateGoal();
  window.setTimeout(updateGoal, 5000);
}

updateGoal();

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    pause();
  } else {
    play();
  }
});
