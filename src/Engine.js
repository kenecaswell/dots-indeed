(function() {
  'use strict';

  // 69 seems to be more accurate than 60
  const fps = 1000 / 69;

  class Engine {
    constructor() {
      this.requestFrame = 0;
      this.fpsInterval = fps;
      this.then = Date.now();
    }

    loop() {
      const self = window.dots.engine;
      self.requestFrame = requestAnimationFrame(self.loop);
      self.drawAtSpecificFPS();
    }

    drawAtSpecificFPS() {
      const now = Date.now();
      const elapsed = now - this.then;

      // If enough time has elapsed, draw the next frame.
      if (elapsed > this.fpsInterval) {

        // Get ready for next frame by setting then = now, but also adjust for
        // your specified fps not being a multiple of RAF's interval (16.7ms)
        this.then = now - (elapsed % this.fpsInterval);

        if (window.dots.game) {
          window.dots.game.draw();
        }
      }
    }

    pause() {
      const self = window.dots.engine;
      cancelAnimationFrame(self.requestFrame);
    }
  }

  // Add engine to the dots name space.
  window.dots.engine = new Engine();

})();
