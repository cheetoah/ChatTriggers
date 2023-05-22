/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData"

class ArmourPiece{
  constructor(item){
    this.item = item

    this.maxDurability = 0
    this.durabilityPercentage = 0.5

    this.colour = Renderer.color(0, 255, 15)
  }

  UpdateItem(item){
    this.item = item
    this.Step()
  }

  Draw(x, y){
    if (this.item == null) return

    this.item.draw(x, y)
    Renderer.drawRect(Renderer.DARK_GRAY, x - 2, y + 2, 2, 14)
    Renderer.drawRect(this.colour, x - 2, y + 2, 2 , 14 * this.durabilityPercentage)
  }

  Step(){
    if (this.item == null) return

    this.maxDurability = this.item.getMaxDamage()
    let currentDurability = this.item.getDamage()

    this.durabilityPercentage = 1 - (currentDurability / this.maxDurability)
    this.colour = GetHealthColour(currentDurability / this.maxDurability)
  }
}


let armourHud = new PogObject("ArmourHud", {
  "x": 0.55,
  "y": 0.55,
  "enabled": true
})

let renderX = Math.floor((Renderer.screen.getWidth() * armourHud.x) * 1000) / 1000
let renderY = Math.floor((Renderer.screen.getHeight() * armourHud.y) * 1000) / 1000

let armour = [
  new ArmourPiece(null),
  new ArmourPiece(null),
  new ArmourPiece(null),
  new ArmourPiece(null)
]

register("step", () => {
  let Items = Player.getInventory()?.getItems()
  if (!Items) return
  armour[0].UpdateItem(Items[39])
  armour[1].UpdateItem(Items[38])
  armour[2].UpdateItem(Items[37])
  armour[3].UpdateItem(Items[36])
})


function GetHealthColour(health){
  health == Infinity? health = 1 : NaN
  return Renderer.color(0 + (health * 255), 255 - (health * 255), 15)
}
register("renderOverlay", () => {
  renderX = Math.floor((Renderer.screen.getWidth() * armourHud.x) * 1000) / 1000
  renderY = Math.floor((Renderer.screen.getHeight() * armourHud.y) * 1000) / 1000

  //Renderer.drawString(`(${renderX}, ${renderY})`, 0, 0)

  if (!armourHud.enabled || gui.isOpen()) return

  let o = 0
  armour.forEach(element => {
    
    element.Draw(renderX, renderY + o)
    o += 17
  });
})


let gui = new Gui()

let md = false

let fadePercent = 0

let ox = 0
let oy = 0

function DrawGui(mx, my){
  Renderer.drawRect(Renderer.color(15, 15, 15, 120 * fadePercent), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
  Renderer.drawLine(md? Renderer.GRAY: Renderer.WHITE, renderX - 3, renderY, renderX + 16, renderY, 1) // Top
  Renderer.drawLine(md? Renderer.GRAY: Renderer.WHITE, renderX - 3, renderY, renderX - 3, renderY + 68, 1) // Left
  Renderer.drawLine(md? Renderer.GRAY: Renderer.WHITE, renderX + 16, renderY, renderX + 16, renderY + 68, 1) // Right
  Renderer.drawLine(md? Renderer.GRAY: Renderer.WHITE, renderX - 3, renderY + 68, renderX + 16 , renderY + 68, 1) // Bottom

  let o = 0
  armour.forEach(element => {
    
    element.Draw(renderX, renderY + o)
    o += 17
  });

  if (!md) return

  armourHud.x = (mx - ox) / Renderer.screen.getWidth()
  armourHud.y = (my - oy) / Renderer.screen.getHeight()

  renderX = Math.floor((Renderer.screen.getWidth() * armourHud.x) * 1000) / 1000
  renderY = Math.floor((Renderer.screen.getHeight() * armourHud.y) * 1000) / 1000
}


gui.registerClicked((mx, my) => {
  if (mx > renderX - 3 && mx < renderX + 16){
    if (my > renderY && my < renderY + 68){
      md = true

      ox = mx - renderX
      oy = my - renderY
    }
  }
})


gui.registerMouseReleased(() => {
  md = false

  armourHud.save()
})

register("command", () => {
  gui.open()
  fadePercent = 0
  new Thread(() => {
    while (fadePercent < 1){
      fadePercent += 0.005
      Thread.sleep(2)
    }

  }).start()
}).setName("armourhud")


gui.registerDraw(DrawGui)