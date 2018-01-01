import * as dat from '../vendor/dat.gui';

function createGui(world, animation, birdConfig) {
  const controls = {
    Reset: () => { world.birds.forEach((bird) => { bird.init(); }); },
    'Play/Pause': () => { animation.toggle(); },
  };

  const gui = new dat.GUI();
  gui.add(controls, 'Reset');
  gui.add(controls, 'Play/Pause');

  const sim = gui.addFolder('Simulation');
  sim.add(birdConfig, 'min_velocity', 0, 100);
  sim.add(birdConfig, 'max_velocity', 100, 300);
  sim.add(birdConfig, 'neighbour_radius', 10, 200);
  sim.add(birdConfig, 'goal_limit', 50, 200);
  sim.open();
}

export default createGui;
