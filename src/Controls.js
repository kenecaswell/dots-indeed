(function() {
  'use strict';

  class Controls {
    constructor() {
      this.isPressed = false;
      this.startPosition = 0;
      this.startMouseX = 0;
      this.pauseButton = document.getElementsByClassName('pause-button')[0];
      this.sliderContainer = document.getElementsByClassName('game-slider')[0];
      this.sliderBar = document.getElementsByClassName('slider-bar')[0];
      this.sliderHandle = document.getElementsByClassName('slider-handle')[0];
      this.sliderBall = document.getElementsByClassName('slider-ball')[0]

      this.pauseButton.addEventListener('click', this.clickPlayPause);

      this.sliderHandle.addEventListener('mousedown', (event) => { this.pressSliderHandle(event); })
      this.sliderHandle.addEventListener('touchstart', (event) => { this.pressSliderHandle(event); })
      document.addEventListener('mousemove', (event) => { this.moveSliderHandle(event); })
      document.addEventListener('touchmove', (event) => { this.moveSliderHandle(event); })
      document.addEventListener('mouseup', (event) => { this.releaseSliderHandle(event); })
      document.addEventListener('touchend', (event) => { this.releaseSliderHandle(event); })

      const mediaWatcher = window.matchMedia('(max-width: 768px)')
      mediaWatcher.addListener((mediaQuery) => {
        if (mediaQuery.matches) {
          this.addResizeListener();
        } else {
          this.removeResizeListener();
        }
      });
    }

    clickPlayPause(event) {
      window.dots.game.togglePause();
      event.target.innerHTML = (window.dots.game.isPaused) ? 'Play' : 'Pause';
    }

    pressSliderHandle(event) {
      const clientX = event.clientX || event.touches[0].clientX;
      this.startMouseX = clientX - this.sliderContainer.offsetLeft - this.sliderBar.offsetLeft;
      this.startPosition = this.sliderHandle.offsetLeft;
      this.isPressed = true;

      this.sliderBall.classList.add('pressed');
    }

    moveSliderHandle(event) {
      if (this.isPressed) {
        const clientX = event.clientX || event.touches[0].clientX;
        const currentX = clientX - this.sliderContainer.offsetLeft - this.sliderBar.offsetLeft;
        const deltaX = currentX - this.startMouseX;
        let newX = this.startPosition + deltaX;

        const minX = this.sliderBar.offsetLeft - this.sliderHandle.clientWidth * .5;
        const maxX = minX + this.sliderBar.clientWidth;
        if (newX < minX) newX = minX;
        if (newX > maxX) newX = maxX;

        this.sliderHandle.style.left = `${newX}px`;

        this.setSpeed(newX, minX, maxX);
      }
    }

    releaseSliderHandle(event) {
      this.isPressed = false;
      this.sliderBall.classList.remove('pressed');
    }

    setSpeed(xPos, minX, maxX) {
      const normalizePos = xPos - minX;
      const normalizeMax = maxX - minX;
      const speedRatio = normalizePos / normalizeMax;
      window.dots.game.updateSpeed(speedRatio);
    }

    addResizeListener() {
      window.addEventListener('resize', (event) => { this.resetSlideHandlePos(event); });
      this.resetSlideHandlePos();
    }

    removeResizeListener() {
      window.removeEventListener('resize', (event) => { this.resetSlideHandlePos(event); });
      this.resetSlideHandlePos();
    }

    resetSlideHandlePos(event) {
      const speedRatio = window.dots.game.speedRatio;
      const minX = this.sliderBar.offsetLeft - this.sliderHandle.clientWidth * .5;
      const maxX = this.sliderBar.clientWidth;
      const x = minX + (maxX * speedRatio);

      this.sliderHandle.style.left = `${x}px`;
    }
  }

  // Add controls to the dots name space.
  window.dots.controls = new Controls();

})();
