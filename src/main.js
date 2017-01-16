var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var birds = [
  [ 10, 10 ],
  [ 20, 20 ],
  [ 10, 20 ],
  [ 30, 20 ],
  [ 30, 30 ]
];

ctx.fillStyle = "green";

for (var i=0; i < birds.length; i++) {
  var bird = birds[i];

  ctx.fillRect(bird[0], bird[1], 5, 5)
}
