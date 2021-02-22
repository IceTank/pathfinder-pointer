const Vec3 = require('vec3')
const { GoalBlock } = require('mineflayer-pathfinder').goals

function inject (bot) {
  bot.pointer = {}
  bot.pointer.isOn = true
  bot.pointer.chatWhenMove = true
  bot.pointer.whisperToItemHolder = true
  bot.pointer.togglePointer = function () {
    bot.pointer.isOn = !bot.pointer.isOn
    return 'Pointer now ' + bot.pointer.isOn ? 'On' : 'Off'
  }
  bot.pointer.magicItemName = 'stick'
  bot.pointer.rayTraceEntitySight = function (options) {
    if (bot.world?.raycast) {
      const { height, position, yaw, pitch } = options.entity
      const x = -Math.sin(yaw) * Math.cos(pitch)
      const y = Math.sin(pitch)
      const z = -Math.cos(yaw) * Math.cos(pitch)
      const rayBlock = bot.world.raycast(position.offset(0, height, 0), new Vec3(x, y, z), 120)
      if (rayBlock) {
        return rayBlock
      }
    } else {
      throw Error('bot.world.raycast does not exists. Try updating prismarine-world.')
    }
  }
  bot.pointer._entityClick = function (entityId) {
    const entity = bot.entities[entityId]
    if (!entity || entity.type !== 'player') return
    if (!entity.heldItem || entity.heldItem.name !== bot.pointer.magicItemName) return
    const rayBlock = bot.pointer.rayTraceEntitySight({ entity })
    if (!rayBlock) {
      if (!bot.pointer.chatWhenMove) return console.log('Block out of Sight')
      if (bot.pointer.whisperToItemHolder) {
        return bot.whisper(entity.username, 'Block out of Sight')
      } else {
        return bot.chat('Block out of Sight')
      }
    }
    bot.pathfinder.setGoal(new GoalBlock(rayBlock.position.x, rayBlock.position.y + 1, rayBlock.position.z))
    if (!bot.pointer.chatWhenMove) return
    const pos = rayBlock.position
    if (bot.pointer.whisperToItemHolder) {
      bot.whisper(entity.username, `Pathing to x:${pos.x} y:${pos.y} z:${pos.z}`)
    } else {
      bot.chat(`Pathing to x:${pos.x} y:${pos.y} z:${pos.z}`)
    }
  }

  bot._client.on('packet', (data, meta) => {
    packetHandler(data, meta, bot)
  })
}

function packetHandler (data, meta, bot) {
  if (!bot.pointer.isOn) return
  if (meta.name !== 'animation') return
  if (data.animation !== 0) return
  bot.pointer._entityClick(data.entityId)
}

module.exports = {
  pointer: inject
}
