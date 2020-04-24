
require('normalize.css/normalize.css');
require('./styles/style.scss');

// creating a global "dots" namespace
window.dots = {
  game: {},
  engine: {},
  controls: {},
  environment: {}
};

require('./dots.js')
require('./Controls.js')
require('./Engine.js')
require('./Game.js')


document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 768) {
      window.dots.controls.addResizeListener();
    }
});
