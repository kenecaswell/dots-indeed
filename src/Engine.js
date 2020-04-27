import { fps } from './constants'

class Engine {
  constructor(game ) {
    this.game = game;
    this.requestFrame = 0;
    this.fpsInterval = fps;
    this.then = Date.now();

    this.loop = this.loop.bind(this)
    this.pause = this.pause.bind(this)
  }

  loop() {
    this.requestFrame = requestAnimationFrame(this.loop);
    this.drawAtSpecificFPS();
  }

  drawAtSpecificFPS() {
    const now = Date.now();
    const elapsed = now - this.then;

    // If enough time has elapsed, draw the next frame.
    if (elapsed > this.fpsInterval) {

      // Get ready for next frame by setting then = now, but also adjust for
      // your specified fps not being a multiple of RAF's interval (16.7ms)
      this.then = now - (elapsed % this.fpsInterval);

      if (this.game) {
        this.game.draw();
      }
    }
  }

  pause() {
    cancelAnimationFrame(this.requestFrame);
  }
}

export { Engine }
