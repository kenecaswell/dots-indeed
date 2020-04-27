import { Game } from './Game'
import { Engine } from './Engine'
import { Controls } from './Controls'

// update these to work
// import 'index.scss'
// import 'style.scss'
//require('normalize.css/normalize.css');
require('./styles/style.scss');

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game()
  const engine = new Engine(game)
  const controls = new Controls(game, engine)
})
