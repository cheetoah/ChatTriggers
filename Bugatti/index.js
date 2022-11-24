const bugatti = new Image("Bugatti.png", "https://i.imgur.com/IdNRXlO.png")
const gui = new Gui()

let step = 0

let transparency = 0

gui.registerDraw(() => {
  Renderer.drawRect(Renderer.color(15, 15, 15, transparency), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
  bugatti.draw(step, Renderer.screen.getHeight() - 115, 1046 / 4, 588 / 4)
  Renderer.drawString("vroom", step + 250, Renderer.screen.getHeight() - 30) 
})

register("command", () => {
  step = 0
  gui.open()
  let fadeInStep = register("step", (ela) => {
    step = Renderer.screen.getWidth() - 1000
    if (ela < 125){
      transparency = ela
    } else {
      fadeInStep.unregister()
      let vroomStep = register("step", (e) => {
        if (e < Renderer.screen.getWidth() + (1046 / 2)){
          step = Renderer.screen.getWidth() - e
        } else {
          vroomStep.unregister()
         
          let fadeOutStep = register("step", (el) => {
            if (el < 125){
              transparency--
            } else {
              fadeOutStep.unregister()
              gui.close()
              step = 0
              transparency = 0
            }
          }).setFps(125)
        }
      }).setFps(340)
    }
  }).setFps(125)
}).setName("bugatti")