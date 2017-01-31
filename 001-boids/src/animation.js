function Animation(doc, win, draw) {
  this._document = doc;
  this._window = win;
  this._animating = false;
  this._animation_request_ids = [];
  this._last = null;
  this._draw = draw;
  this.frameRate = 0;

  var obj = this;
  // sort this out so it doesn't clobber animating state
  this._document.addEventListener('visibilitychange', function() {
    if (obj._document.visibilityState === 'hidden') {
      obj.pause();
    } else {
      obj.play();
    }
  });
}

Animation.prototype._getNextFrame = function() {
  var obj = this;

  return this._window.requestAnimationFrame(
    function(timestamp) { obj._step(timestamp); }
  );
};

Animation.prototype.pause = function() {
  if (this._animating) {
    this._animating = false;
    for (var i=0; i<this._animation_request_ids.length; i++) {
      this._window.cancelAnimationFrame(this._animation_request_ids[i]);
    }
    this._animation_request_ids = [];
  }
};

Animation.prototype.play = function() {
  if (!this._animating) {
    this._animating = true;
    this._last = null;
    this._getNextFrame();
  }
};

Animation.prototype.toggle = function() {
  if (this._animating) {
    this.pause();
  } else {
    this.play();
  }
};

Animation.prototype.animating = function() {
  return this._animating;
};

Animation.prototype._step = function(timestamp) {
  this._animation_request_ids = [];
  if (!this._animating) { return; }
  if (!this._last) { this._last = timestamp }
  var delta_t = (timestamp - this._last) / 1000;
  this._last = timestamp;

  this._draw(delta_t);
  
  if (this._animating) {
    this._animation_request_ids.push(
      this._getNextFrame()
    );
  }
};
