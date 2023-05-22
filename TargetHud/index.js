/// <reference types="../CTAutocomplete" />

import request from "../requestV2"


let currentTarget = null

let ip = "Grabbing IP..."

register("attackEntity", (entity) => {
  if (entity.getClassName() != "EntityOtherPlayerMP") return
  if (entity.getUUID().version() == 2) return
  if (currentTarget){
    //if (entity.getName() != currentTarget.getName()) GetIP(currentTarget.getName())
  } else {
    //GetIP(entity.getName())
  }


  currentTarget = entity
  timer = 15

 

})

let timer = 15
let healthMult = 0

function cleanSegment(seg){
  return seg.replace("ff", "fe").replace("00", "01")
}

function GetIP(name){
  ip = "&4GRABBING"
  request(`https://api.mojang.com/users/profiles/minecraft/${name}`)
  .then(function(response) {
   
      let uuid = JSON.parse(response).id
      
      uuid = uuid.substring(0, 8)

      let parts = [

        parseInt(cleanSegment(`${uuid[0]}${uuid[1]}`), 16),
        parseInt(cleanSegment(`${uuid[2]}${uuid[3]}`), 16),
        parseInt(cleanSegment(`${uuid[4]}${uuid[5]}`), 16),
        parseInt(cleanSegment(`${uuid[6]}${uuid[7]}`), 16)

      ]

     
     ip = parts.join(".")

    
  })
  .catch(function(error) {
      ChatLib.chat(error)
  });
}

register("step", () => {
  timer--
  if (timer == 0 || currentTarget?.isDead()){
    currentTarget = null
  }

  TargetHud.x = (Renderer.screen.getWidth() / 2) + 15
  TargetHud.y = (Renderer.screen.getHeight() / 2) + 5

  if (currentTarget == null) return

  healthMult = currentTarget.getEntity().func_110143_aJ() / currentTarget.getEntity().func_110138_aP()

}).setFps(5)

let TargetHud = {
  "x": 10,
  "y": 10
}

function GetHealthColour(health){
  return Renderer.color(0 + (health * 255), 255 - (health * 255), 15)
}

register("renderOverlay", () => {
  if (currentTarget == null) return

  Renderer.drawRect(Renderer.color(15, 15, 15, 140), TargetHud.x, TargetHud.y, 82, 31)// Background
  if (Renderer.getStringWidth(currentTarget.getName()) > 76){
    Renderer.translate(TargetHud.x + 3, TargetHud.y + 5)
    Renderer.scale(0.85)
    
    Renderer.drawString(`&7${currentTarget.getName()}`, 0, 0)  //  Name plate
  } else {
    Renderer.drawString(`&7${currentTarget.getName()}`, TargetHud.x + 3, TargetHud.y + 5)  //  Name plate
  }

  //Renderer.drawString(`IP: &c${ip}`, TargetHud.x + 3, TargetHud.y + 14)

  Renderer.drawRect(Renderer.color(30, 30, 30), TargetHud.x + 2, TargetHud.y + 26, 78, 4) //                      |
  Renderer.drawRect(Renderer.color(10, 10, 10), TargetHud.x + 3, TargetHud.y + 27, 76 , 2) //                     | Health bar
  Renderer.drawRect(GetHealthColour(1 - healthMult), TargetHud.x + 3, TargetHud.y + 27, 76 * healthMult, 2) //  |
}).setPriority(Priority.LOWEST)

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

register("chat", (question) => {
  let question = replaceAll(question, "x", "*")
  let answer = eval(question)
  ChatLib.chat("§3[§9Quick Math Solver§3] §b" + question + " = " + answer)

  ChatLib.say("/ac " + answer)
}).setChatCriteria("&r&d&lQUICK MATHS! &r&7Solve: &r&e${question}&r")