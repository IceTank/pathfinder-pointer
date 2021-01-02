const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { pointer } = require('../index')

const bot = mineflayer.createBot({ username: 'Player' })

bot.loadPlugins([pathfinder, pointer])

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)

  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  console.log('Bot spawned! Punch with a stick to tell the bot were to go')
})
