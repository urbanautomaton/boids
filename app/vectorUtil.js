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

function randomVector(minMax, dimensions) {
  return Vector.Random(dimensions)
    .x(2 * minMax)
    .map(e => (e - minMax));
}

export {
  clamp,
  meanVector,
  randomVector,
};
