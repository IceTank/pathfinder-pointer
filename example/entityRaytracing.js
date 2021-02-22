const mineflayer = require('mineflayer')
const { pointer } = require('../index')
const bot = mineflayer.createBot({ username: 'Player' })

bot.once('spawn', () => {
  bot.loadPlugin(pointer)
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === 'block') {
      const entity = bot.players[username].entity
      if (!entity) return bot.chat("I can't see you")
      const block = bot.pointer.rayTraceEntitySight({ entity: entity })
      if (!block) return bot.chat('The block you are looking at is to far away')
      bot.chat('You are looking at block ' + JSON.stringify(block.position))
    }
  })
  console.log('Bot spawned!')
})
