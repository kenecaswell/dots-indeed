import { Game } from './Game'
import { Engine } from './Engine'
import { Controls } from './Controls'

import './styles/index.scss'
import './styles/game.scss'
import './styles/footer.scss'

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game()
  const engine = new Engine(game)
  const controls = new Controls(game, engine)
})
