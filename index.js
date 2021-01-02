const Vec3 = require('vec3')
const { GoalBlock } = require('mineflayer-pathfinder').goals

function inject (bot) {
  bot.pointer = {}
  bot.pointer.isOn = false
  bot.pointer.togglePointer = function () {
    bot.pointer.isOn = !bot.pointer.isOn
    return 'Pointer now ' + bot.pointer.isOn ? 'On' : 'Off'
  }
  bot.pointer.magicItemName = 'stick'
  bot.pointer.rayTraceEntitySight = function (options) {
    // Stolen from https://github.com/PrismarineJS/mineflayer/blob/master/lib/plugins/ray_trace.js
    // and modified
    const maxSteps = options.maxSteps || 256
    const vectorLength = options.vectorLength || 5 / 16
    const { height, position, yaw, pitch } = options.entity
    const cursor = position.offset(0, height, 0)

    const x = -Math.sin(yaw) * Math.cos(pitch)
    const y = Math.sin(pitch)
    const z = -Math.cos(yaw) * Math.cos(pitch)

    const step = new Vec3(x, y, z).scaled(vectorLength)

    for (let i = 0; i < maxSteps; ++i) {
      cursor.add(step)

      // TODO: Check boundingBox of block
      const block = bot.blockAt(cursor)
      if (block && block.type !== 0) {
        return block
      }
    }
  }
  bot.pointer.entityClick = function (entityId) {
    const entity = bot.entities[entityId]
    if (!entity || entity.type !== 'player') return
    if (!entity.heldItem || entity.heldItem.name !== bot.pointer.magicItemName) return
    const rayBlock = bot.pointer.rayTraceEntitySight({ entity })
    if (!rayBlock) {
      return bot.whisper(entity.username, 'Block out of Sight')
    }
    bot.pathfinder.setGoal(
      new GoalBlock(rayBlock.position.x, rayBlock.position.y + 1, rayBlock.position.z))
    bot.isMoving = true
    bot.whisper(entity.username, `Going to ${JSON.stringify(rayBlock.position)}`)
  }

  bot._client.on('packet', (data, meta) => {
    packetHandler(data, meta, bot)
  })
}

function packetHandler (data, meta, bot) {
  if (meta.name !== 'animation') return
  if (data.animation !== 0) return
  bot.pointer.entityClick(data.entityId)
}

module.exports = {
  pointer: inject
}
