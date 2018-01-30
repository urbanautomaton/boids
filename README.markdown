# Boids

An attempt to build a starling simulation, starting with [Craig
Reynolds' Boids](https://en.wikipedia.org/wiki/Boids), and working up
(somehow) to something, like, better? Or at the very least, something
with a ton of boids in it.

## Usage

You need a recent node installed (it was 6.something when I started,
it's 8.9ish as I type).

    $ npm install
    ...
    $ make
    $ open gl.html

While there should be a working 2D version shown in `index.html`, this
is currently broken while I refactor the code towards a more game engine
oriented design (the intention being to support things like obstacles,
predators and wotnot).
