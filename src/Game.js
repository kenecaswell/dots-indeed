(function() {
  'use strict';

  const colors = {
    10: '#B91727',
    20: '#B95817',
    30: '#B9A917',
    40: '#90B917',
    50: '#17B957',
    60: '#17B9A9',
    70: '#1778B9',
    80: '#1727B9',
    90: '#6417B9',
    100: '#B91776'
  };

  class Game {
    constructor() {
      this.score = 0;
      this.minSpeed = 10 / 60; // 10px per second
      this.maxSpeed = 100 / 60; // 100px per second
      this.speedRatio = .5; // 50%
      this.speed = this.maxSpeed * this.speedRatio;
      this.ticks = 0;
      this.dots = {};
      this.isPaused = true;
      this.screen = document.getElementsByClassName('game-screen')[0];
      this.scoreBoard = document.getElementsByClassName('score')[0];
      this.speedText = document.getElementsByClassName('slider-speed')[0];
      this.scoreBoard.innerHTML = this.score;
    }

    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        window.dots.engine.pause();
      } else {
        window.dots.engine.loop();
      }
    }

    draw() {
      const dots = Object.values(this.dots);
      dots.forEach((dot) => {
        this.moveDot(dot);
      });

      this.ticks++;
      if (this.ticks >= 60) {
        this.ticks = 0;
        this.createDot();
      }
    }

    moveDot(dot) {
      const { element, y, id } = dot;
      const newY = y + this.speed;
      element.style.top = `${newY}px`;
      dot.y = newY;

      // Remove dot from game if it goes off screen.
      if (newY > this.screen.offsetTop + this.screen.clientHeight) {
        this.deleteDot(dot);
      }
    }

    deleteDot(dot) {
      const { element, id } = dot;
      this.screen.removeChild(element);
      delete this.dots[id];
    }

    createDot() {
      // Limiting to 10 different sizes for a better game experience.
      const diameter = Math.round(getRandomInt(10, 100) / 10) * 10;
      const x = getRandomInt(0, this.screen.clientWidth - diameter);
      const y = -diameter;
      const id = `${diameter}${x}-${new Date().getTime()}`;
      const element = document.createElement('div');
      element.id = id;
      element.className = 'dot';
      element.style.width = `${diameter}px`;
  		element.style.height = `${diameter}px`;
      element.style.backgroundColor = colors[diameter];
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.addEventListener('touchstart', (event) => { this.onDown(event); });
      element.addEventListener('mousedown', (event) => { this.onDown(event); });

  		this.screen.appendChild(element);

      const dot = {
        id: id,
        x: x,
        y: y,
        d: diameter,
        value: this.getDotValue(diameter),
        element: element
      };
      this.dots[id] = dot;
    }

    getDotValue(diameter) {
      const value = 10 - (diameter / 10) + 1;

      // Bigger scores equal bigger fun!
      const multiplier = 10;
      return value * multiplier;
    }

    onDown(event) {
      if (!this.isPaused) {
        const dot = this.dots[event.target.id];
        this.updateScore(dot);
        this.createPoints(dot);
        this.deleteDot(dot);
        // TODO: animate dot popping
      }
    }

    updateScore(dot) {
      this.score += dot.value;
      this.scoreBoard.innerHTML = this.score;
    }

    updateSpeed(speedRatio) {
      this.speedRatio = speedRatio;
      const newSpeed = this.minSpeed + (this.maxSpeed - this.minSpeed) * speedRatio;
      this.speed = newSpeed;
      this.speedText.innerHTML = `${Math.round(this.speed * 60)}`;
    }

    createPoints(dot) {
      const element = document.createElement('div');
      element.className = 'points';
      element.innerHTML = `+${dot.value}`;
      this.screen.appendChild(element);

      // Now that the points are in the DOM we can measure them.
      const radius = dot.d * .5;
      const centerX = Math.round(radius - element.clientWidth * .5);
      const centerY = Math.round(radius - element.clientHeight * .5);
      element.style.left = `${dot.x + centerX}px`;
      element.style.top = `${dot.y + centerY}px`;
      element.style.visibility = 'visible';

      element.classList.add('fade-out');

      setTimeout(() => {
        this.screen.removeChild(element);
      }, 1500);
    }
  }

  // Helper function
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Add game to the dots name space.
  window.dots.game = new Game();

})();
