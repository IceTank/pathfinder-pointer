const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { pointer } = require('../index')

const bot = mineflayer.createBot({ username: 'Player' })

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  // Load pathfinder and pointer
  bot.loadPlugins([pathfinder, pointer])
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  // Change pointer setting
  bot.pointer.whisperToItemHolder = false

  console.log('Bot spawned! Punch with a stick to tell the bot were to go')
})
