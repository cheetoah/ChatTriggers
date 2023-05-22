/// <reference types="../CTAutocomplete" />


let slots = [0, 1, 2]

let enabled = false

register("command", () => {
  enabled = !enabled

  ChatLib.chat(`&3Hotbar randomisation ${enabled? "&aenabled" : "&cdisabled"}`)
}).setName("randomisehotbar")


register("playerInteract", (action, position, event) => {
  if (!enabled) return
 
  if (action.toString() != "RIGHT_CLICK_BLOCK") return

  let slot = Math.floor(Math.random() * slots.length)

  setTimeout(() => {Player.setHeldItemIndex(slots[slot])}, 5)
})