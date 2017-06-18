function Animation(doc, win, draw) {
  this.document = doc;
  this.window = win;
  this.animating = false;
  this.animation_request_ids = [];
  this.last = null;
  this.draw = draw;
  this.frameRate = 0;

  const obj = this;

  // sort this out so it doesn't clobber animating state
  this.document.addEventListener('visibilitychange', () => {
    if (obj.document.visibilityState === 'hidden') {
      obj.pause();
    } else {
      obj.play();
    }
  });
}

Animation.prototype.getNextFrame = function getNextFrame() {
  const obj = this;

  return this.window.requestAnimationFrame((timestamp) => { obj.step(timestamp); });
};

Animation.prototype.pause = function pause() {
  if (this.animating) {
    this.animating = false;
    this.animation_request_ids.forEach((id) => { this.window.cancelAnimationFrame(id); });
    this.animation_request_ids = [];
  }
};

Animation.prototype.play = function play() {
  if (!this.animating) {
    this.animating = true;
    this.last = null;
    this.getNextFrame();
  }
};

Animation.prototype.toggle = function toggle() {
  if (this.animating) {
    this.pause();
  } else {
    this.play();
  }
};

Animation.prototype.step = function step(timestamp) {
  this.animation_request_ids = [];
  if (!this.animating) { return; }
  if (!this.last) { this.last = timestamp; }
  const deltaT = (timestamp - this.last) / 1000;
  this.last = timestamp;

  this.draw(deltaT);

  if (this.animating) {
    this.animation_request_ids.push(this.getNextFrame());
  }
};

export default Animation;
