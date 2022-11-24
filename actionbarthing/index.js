/// <reference types="../CTAutocomplete" />

// I dont even know how the fuck this works why does regex no
let terrorRegx = /(§6(§l)?[0-9]+⁑)(§r)?./gm

// Text to display (current terror stack)    <!> possible latency of ~500ms from actual terror value <!>
let terror = ""

// Last MS (from elapsed ms) that the terror stack was in taskbar (since ChatLib.actionBar(str) triggers the "actionBar" trigger)
let lastSeenMS = 0 

// Elapsed MS since game load (more efficient than 'new Date().getTime()' every time)
let ms = 0 

// Scale of text / box  (1 = default mc size)
let tscale = 2


// Prevent breaking upon switching lobbies / reloading CT
register("worldLoad", () => lastSeenMS = ms)
register("gameLoad", () => lastSeenMS = ms)


register("actionBar", (event) => {
    let text = ChatLib.getChatMessage(event);
  
    let result = text.match(terrorRegx); 
      // Check if actionBar contains terror stack
    if(result != null) {

        let newActionBar = text.replace(terrorRegx, ""); // New action bar

        terror = result.join("")
      
        lastSeenMS = ms
        
        // Display updated action bar (removed terror stack)
        cancel(event)
        ChatLib.actionBar(newActionBar)
    } 
})

let x = 0
let y = 0
let w = 0

// Only update position values 5 times a second to increase performance
register("step", () => {
  w = Renderer.getStringWidth(terror.removeFormatting())
  x = (Renderer.screen.getWidth() / 2)
  y = (Renderer.screen.getHeight() / 2) + 25
}).setFps(5)


register("renderOverlay", () => {

  if (ms - lastSeenMS > 1500) return

  // Back box
  Renderer.translate(x - 5 - (w / 2), y - 5)
  Renderer.scale(tscale)
  Renderer.drawRect(Renderer.color(15, 15, 15, 150), 0, 0, w, 12)
  
  // Draw terror stack text
 
  Renderer.translate(x- (w / 2), y)
  Renderer.scale(tscale)
  Renderer.drawString(`&${terror.removeFormatting() == "10⁑" ? "c" : "6"}${terror.removeFormatting()}`, 0, 0)
});


//update ms variable every ms :trol:
register("step", () => ms++).setFps(1000)