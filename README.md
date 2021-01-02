## pathfinder-pointer

You can 'point' at a block you want your bot to pathfinde to. 
This plugin uses mineflayer-pathfinder and mineflayer-pathfinder goals.

## Usage:
The default item with which you can 'point' is a normal wooden stick. 
The bot pathfindes whenever any Player in render distance attacks with a stick in hand.

See Example:
```js
const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { pointer } = require('../index.js')

const bot = mineflayer.createBot({ username: 'Player' })

bot.loadPlugins([pathfinder, pointer])

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)

  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  console.log('Bot spawned! Punch with a stick to tell the bot were to go')
})
```

## Functions 
### bot.pointer.togglePointer()
Toggles the plugin on and off

### bot.pointer.isOn
Boolean value if the plugin is on or not

### Raytracing
You can also get the block any player or entity is looking at by calling 
```bot.pointer.rayTraceEntitySight({entity: Entity})```
### Example:
```js
const mineflayer = require('mineflayer')
const { pointer } = require('../index')
const bot = mineflayer.createBot({ username: 'Player' })
bot.loadPlugin(pointer)
bot.once('spawn', () => {
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === 'block') {
      let entity = bot.players[username].entity
      if (!entity) return bot.chat("I can't see you")
      let block = bot.pointer.rayTraceEntitySight({entity: entity})
      if (!block) return bot.chat('The block you are looking at is to far away')
      bot.chat('You are looking at block ' + JSON.stringify(block.position))
    }
  })
  console.log('Bot spawned!')
})

```
