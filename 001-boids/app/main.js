import { Vector } from '../vendor/sylvester';
import Birds from './birds';
import Animation from './animation';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const X = canvas.width;
const Y = canvas.height;
const SCALE = 0.5;
const BIRDS = 150;
const SHOW_ACCELERATION = false;

ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(SCALE, SCALE);

function drawCircle(centre, radius, color, stroke) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centre.e(1), centre.e(2), radius, 0, Math.PI * 2, true);
  ctx.fill();
  if (stroke) { ctx.stroke(); }
}

function drawTriangle(centre, heading, color, stroke) {
  const deltas = [
    Vector.create([-1.0, 0]),
    Vector.create([0, 3.0]),
    Vector.create([1.0, 0]),
    Vector.create([0, 0]),
  ];
  const angle = heading.angleFrom(Vector.create([0, 1])) * -Math.sign(heading.e(1));

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centre.e(1), centre.e(2));
  deltas.forEach((delta) => {
    const point = centre.add(delta.rotate(angle, Vector.create([0, 0])).x(5));
    ctx.lineTo(point.e(1), point.e(2));
  });
  ctx.fill();
  if (stroke) { ctx.stroke(); }
}

function drawVector(start, vector, color) {
  const newPos = start.add(vector);
  const originalStrokeStyle = ctx.strokeStyle;

  ctx.strokeStyle = color || 'black';
  ctx.beginPath();
  ctx.moveTo(start.e(1), start.e(2));
  ctx.lineTo(newPos.e(1), newPos.e(2));
  ctx.stroke();

  ctx.strokeStyle = originalStrokeStyle;
}

function drawBird(i, pos, vel, acc) {
  drawTriangle(pos, vel, 'green', true);
  if (SHOW_ACCELERATION) {
    drawVector(pos, acc, 'red');
  }
}

function updateFrameRate(delta) {
  const rate = 1 / delta;
  const element = document.getElementById('frame-rate');

  if (element) {
    element.textContent = Math.round(rate * 100) / 100;
  }
}

const simulation = new Birds(2, Math.sqrt((X ** 2) + (Y ** 2)), BIRDS);

function draw(deltaT) {
  updateFrameRate(deltaT);
  simulation.tick(deltaT);

  ctx.clearRect(-X / (2 * SCALE), -Y / (2 * SCALE), X / SCALE, Y / SCALE);
  simulation.eachBird(drawBird);
  drawCircle(simulation.goal, 3, 'red', true);
}

const animation = new Animation(document, window, draw);

const reset = document.getElementById('reset-sim');
const toggle = document.getElementById('toggle-anim');

if (reset) { reset.addEventListener('click', simulation.init.bind(simulation), false); }
if (toggle) { toggle.addEventListener('click', animation.toggle.bind(animation), false); }

animation.play();
