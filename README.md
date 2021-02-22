## pathfinder-pointer

This plugin allows you to 'point' at a block you want your bot to pathfinde to. 
This plugin relays on prismarine-world and mineflayer-pathfinder.

## Demo:
https://youtu.be/JcomEREkeTQ

## Usage:
The default item with which you can 'point' is a normal wooden stick. 
The bot pathfindes whenever any Player in render distance attacks with a stick in hand.

See Example:
```js
const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { pointer } = require('../index')

const bot = mineflayer.createBot({ username: 'Player' })

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version)
  bot.loadPlugins([pathfinder, pointer])
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  console.log('Bot spawned! Punch with a stick to tell the bot were to go')
})
```

## Functions 
### ``bot.pointer.togglePointer()``
Toggles the plugin on and off. Returns resulting status as text for Example: ``Pointer now Off``.

### ``bot.pointer.rayTraceEntitySight(entity: Entity)``
Takes an prismarine-entity entity and returns the block the entity is looking at.

## Options
### ``bot.pointer.isOn``
Boolean value if the plugin is on or not default ```true```.

### ``bot.pointer.chatWhenMove``
Boolean value if the bot should say were it is going in chat. Default ```true```.

### ``bot.pointer.whisperToItemHolder``
Boolean value if the bot should use global chat or whisper were it is going. Has no effect when chatWhenMove is false. Default ``true``.

### Raytracing
You can also get the block any player or entity is looking at by calling 
```bot.pointer.rayTraceEntitySight({entity: Entity})```.
### Example:
```js
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
```
