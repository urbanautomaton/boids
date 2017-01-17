var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var X = 500;
var Y = 500;
var BIRDS = 20;

var vel = [];
var pos = [];

for (var i=0; i < BIRDS; i++) {
  vel[i] = $V([.2, .2]);
  pos[i] = $V([X/2 + Math.random() * 50, Y/2 + Math.random() * 50]);
}

ctx.fillStyle = "green";

function drawBird(i) {
  var bird = pos[i];

  ctx.fillRect(
    bird.e(1),
    bird.e(2),
    5,
    5
  );
}

function step(timestamp) {
  console.log("Doing a bird as it were");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!last) { last = timestamp }
  var delta = timestamp - last;

  for (var i=0; i < BIRDS; i++) {
    pos[i] = pos[i].add(vel[i].x(delta / 1000));

    drawBird(i);
  }
  window.requestAnimationFrame(step);
}

var last = null;

window.requestAnimationFrame(step);


// for (every frame) {
//   // calculate each bird's velocity (maybe?)
  
//   for (each bird) {
//     new_velocity = [
//       // some repulsion factor based on proximity
//       // some alignment factor based on neighbour vectors
//       // some centroid factor based on neighbour position
//     ]

//     new_position = old_position + new_velocity * tick;
//   }
// }
