/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData"

let Keystrokes = new PogObject("Keystrokes", {
  "x": 100,
  "y": 100
})


class Key{
  constructor(char, key){
    this.key = key
    this.char = char


    this.keyDown = false
  }

  Draw(x, y){
    Renderer.drawRect(this.keyDown? Renderer.color(0, 0, 0, 180) : Renderer.color(25, 25, 25, 140), x, y, 20, 20)
    Renderer.drawString(`${this.keyDown? "&7" : "&f"}${this.char.toUpperCase()}`, x + (10 - (Renderer.getStringWidth(this.char.toUpperCase())) / 2), y + 7)
  }

  Update(){
   this.keyDown = Keyboard.isKeyDown(this.key)
  }
}


let keys = [
  new Key("w", Keyboard.KEY_W),
  new Key("a", Keyboard.KEY_A),
  new Key("s", Keyboard.KEY_S),
  new Key("d", Keyboard.KEY_D)
]


register("tick", () => {
  keys.forEach(k => {
    k.Update()
  })
})

register("renderOverlay", () => {
  keys[0].Draw(Keystrokes.x + 21, Keystrokes.y)
  keys[1].Draw(Keystrokes.x, Keystrokes.y + 21)
  keys[2].Draw(Keystrokes.x + 21, Keystrokes.y + 21)
  keys[3].Draw(Keystrokes.x + 42, Keystrokes.y + 21)
})


let gui = new Gui()

register("command", () => {
  gui.open()
  fadePercent = 0
  new Thread(() => {
    while (fadePercent < 1){
      fadePercent += 0.005
      Thread.sleep(2)
    }
  }).start()
}).setName("keystrokes")


let md = false
let fadePercent = 0
let ox = 0
let oy = 0

gui.registerDraw((mx, my) => {
  Renderer.drawRect(Renderer.color(15, 15, 15, 120 * fadePercent), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
  if (!md) return

  Keystrokes.x = mx - ox
  Keystrokes.y = my - oy
})

gui.registerMouseReleased(() => {
  md = false

  Keystrokes.save()
})



gui.registerClicked((mx, my) => {
  if (mx > Keystrokes.x - 3 && mx < Keystrokes.x + 66){
    if (my > Keystrokes.y - 3 && my < Keystrokes.y + 49){
      md = true

      ox = mx - Keystrokes.x
      oy = my - Keystrokes.y
    }
  }
})