/// <reference types="../CTAutocomplete" />


let players = []


register("step", () => {
  players = []
  dots = []
  World.getAllPlayers().forEach((p) => {
    let pc = {"x": Player.getX(), "y": Player.getY(), "z": Player.getZ()}
    
    let dist = DistanceTo(pc.x, pc.z)

    if (dist < 20){
      players.push(p)
      dots.push(new Dot(p))
    }
  })
}).setDelay(1)


function DistanceTo(x, z){
  return Math.hypot(x - Player.getX(), 0 - 0, z - Player.getZ())
}

let dots = []

class Dot{
  constructor(playermp){
    this.playermp = playermp
    this.bot = playermp.getUUID().version() == 2
    
    this.x = 0
    this.y = 0

    this.inView = true
    this.dist = 0
  }

  Draw(){
    if (this.x < 0-(settings.width) || this.x > settings.width  || this.y < 0-(settings.width) || this.y > settings.width) return
    
    this.playermp.getUUID() != Player.getUUID() && this.playermp.getName() != "Debuggings"? Renderer.drawCircle(this.inView? this.bot? Renderer.color(140, 240, 255) : Renderer.color(255, 255, 255) : this.bot? Renderer.color(80, 130, 155) : Renderer.color(155, 155, 155), this.x + settings.x + 2, this.y + settings.y + 2, 2, 6) : false
    //Renderer.drawString(`${this.playermp.getName()}`, this.x, this.y)
    this.CalculateLocation()
    if (this.playermp.getName() == "Debuggings") return Renderer.drawCircle(Renderer.color(75, 255, 75), this.x + settings.x + 2, this.y + settings.y + 2, 2, 6)
    if (this.playermp.getUUID() != Player.getUUID()) return
    PLAYER_YAW = Player.getYaw() - 90
   //Renderer.drawString(`${PLAYER_YAW}`, settings.x + (settings.width / 2), settings.y + (settings.width / 2))


    let pos1 = {x:(settings.width / 2) * Math.cos((PLAYER_YAW + ((Client.settings.getFOV() * 1.5) / 2)) / 57.52), y:(settings.width / 2) * Math.sin((PLAYER_YAW + ((Client.settings.getFOV() * 1.5) / 2)) / 57.52)}
    let pos2 = {x:(settings.width / 2) * Math.cos((PLAYER_YAW - ((Client.settings.getFOV() * 1.5) / 2)) / 57.52), y:(settings.width / 2) * Math.sin((PLAYER_YAW - ((Client.settings.getFOV() * 1.5) / 2)) / 57.52)}
    Renderer.drawLine(Renderer.AQUA, settings.x + (settings.width / 2), settings.y + (settings.width / 2), pos1.x + settings.x + (settings.width / 2), pos1.y + settings.y + (settings.width / 2), 0.5)
    Renderer.drawLine(Renderer.AQUA, settings.x + (settings.width / 2), settings.y + (settings.width / 2), pos2.x + settings.x + (settings.width / 2), pos2.y + settings.y + (settings.width / 2), 0.5)
  }

  CalculateLocation(){
    this.x = settings.x / 2 +(settings.x + (settings.width / 2) + (Player.getX() - this.playermp.getX())) * 0.66 
    this.y = settings.x / 2 + (settings.y + (settings.width / 2) + (Player.getZ() - this.playermp.getZ())) * 0.66
  }
}

register("step", () => {
  dots = []
  players.forEach(p => {
    dots.push(new Dot(p))
    dots[dots.length-1].CalculateLocation()
  })
}).setFps(5)

let settings = {
  "x": 20,
  "y": 20,
  "width": 150
}

let PLAYER_YAW = 0

register("renderOverlay", () => {
  //Renderer.drawStringWithShadow(`${players.length} &7Players nearby`, settings.x, settings.y + settings.width + 1)

  Renderer.drawCircle(Renderer.color(15, 15, 15, 190), settings.x + settings.width / 2, settings.y + settings.width / 2, settings.width / 2, 120)
  Renderer.drawCircle(Renderer.color(5, 5, 5, 255), settings.x + settings.width / 2, settings.y + settings.width / 2, settings.width / 2, 120, 0)
  Renderer.drawLine(Renderer.color(155, 155, 155, 150), settings.x + (settings.width / 2), settings.y, settings.x + (settings.width / 2), settings.y + settings.width, 1)
  Renderer.drawLine(Renderer.color(155, 155, 155, 150), settings.x , settings.y + (settings.width / 2), settings.x + settings.width, settings.y + (settings.width / 2), 1)


  dots.forEach((d) => {
    d.Draw()
  })
  Renderer.drawCircle(Renderer.AQUA, settings.x + (settings.width / 2), settings.y + (settings.width / 2), 2, 360)
})
