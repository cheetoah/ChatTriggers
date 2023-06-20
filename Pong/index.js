/// <reference types="../CTAutocomplete" />



/*
  PONG - Farlow

        ##################################
        #                                #
        #  |        @                    #
        #  |                             #    <== Pong Demonstration
        #                             |  #
        #                             |  #
        #                                #
        # Score: 69 ######################
        #############

  Kill me please


  I've been contemplating existence since the day I
  came out of the womb, never to find an answer. 
  My whole life I've spent wondering why there's
  so much darkness and pain, why all my loved ones
  are gone or will be gone. I've lived in this void
  of thought and blackness for so long that I don't even feel anymore.
  Tired? I don't even know the meaning. I haven't slept in days and I won't
  for more days, I'm so lost that I don't think I'll ever sleep again until sleep eternal.
  Why are we here? What happens when we die? Did any of it mean anything?
  This is what regular people ask, but I went beyond this long ago.
  The questions I ask myself are so deep you would drown
  if I tried explaining them to you, and if you didn't,
  there's no possible way you could even begin to comprehend.
  So you're having an existential quandary? How is that different from any other living creature?
  Talk to me once you've sunk in as deep as I have.
  Oh wait, if you did that you'd wouldn't talk to me because you would know how empty
  everything is and realize that it wouldn't change anything. 
  Now if you don't mind, I'll pass back into that lightless cloud 
  of thought that forever looms over me and engulfs my mind.

  :skull:
*/

// LOVE JUAN
//https://imgur.com/SXECeqo

const juan = Image.fromUrl("https://i.imgur.com/SXECeqo.png")
// I'm sorry
let game = {
  speed: 65, // number of steps per second
  board: {
    "width": 300,
    "height": 250,
    "x": 100,
    "y": 100,
  },
  puck: {
    "x": 115,
    "y": 115,
    "movedirx": 1,
    "movediry": 1
  },
  paddles: {
    "height": 20,
    "player": {
      "y": 115
    },
    "computer": {
      "y": 115
    }
  },
  colours: {
    "background": Renderer.color(15, 15, 20, 169),
    "puck": Renderer.color(255, 255, 255),
    "board": Renderer.color(15, 15, 15),
    "playerpaddle": Renderer.color(100, 250, 100),
    "computerpaddle": Renderer.color(250, 100, 100),
    "border": Renderer.color(220, 80, 200)
  },
  gamestates: {
    "states": {
      "PLAYING": 0,
      "GAMEOVER": 1,
      "START": -1
    },
    "score": 0,
    "state": 0
  }
}




// EPIC GAMEPLAY FUNCTIONS


function SimulatePaddle(){
  game.paddles.computer.y = game.puck.y - (game.paddles.height / 2)

  if (game.paddles.computer.y < 0){
    game.paddles.computer.y = 0
  } else if (game.paddles.computer.y > game.board.height - game.paddles.height){
    game.paddles.computer.y = game.board.height - game.paddles.height
  }
  return
  // Test shit, doesnt work. for now paddle just stays at puck's y level, constantly
  let sr = register("step", () => {
    if (Math.abs(game.paddles.computer.y - game.puck.y) > 0){
      game.paddles.computer.y += (game.paddles.computer.y - game.puck.y / 5)
    } else sr.unregister()
  })
  
}


function MovePuck(){
  // Handle puck vertical movements qwq
  switch (game.puck.movediry){
    case -1: // Moving down
      game.puck.y += 1;
      if (game.puck.y >= game.board.height - 3){ // More awesome edge collision detection
     
        game.puck.y = game.board.height -3
        game.puck.movediry = 1
      }
      break
    case 1: // Moving up
      game.puck.y -= 1;
      if (game.puck.y <= 0){
        game.puck.y = 0
        game.puck.movediry = -1
      }
      break
  }

  // Handle puck horizontal movements (^-^)
  switch (game.puck.movedirx){
    case -1: // Moving left
      game.puck.x -= 1;
      if (game.puck.x <= 4){ // Hit left

        // Detect if hits player paddle or walls

        if (game.puck.y + 3< game.paddles.player.y || game.puck.y > game.paddles.player.y + game.paddles.height) return EndGame() // L bozo

        game.gamestates.score += 1
        game.puck.x = 4
        game.puck.movedirx = 1
      }
    break
    case 1: // Moving right
      game.puck.x += 1;
      if (game.puck.x >= game.board.width - 4){
        game.puck.x = game.board.width - 4
        game.puck.movedirx = -1
      }
      break
  }

}


function MovePaddle(dist){
  game.paddles.player.y += dist
  if (game.paddles.player.y < 0) return game.paddles.player.y = 0
  if (game.paddles.player.y > game.board.height - game.paddles.height) return game.paddles.player.y = game.board.height - game.paddles.height
}

function EndGame(){
  // Oops, you lost! (skill issue)
  game.gamestates.state = game.gamestates.states.GAMEOVER

}

// does this even work???
function RandomInt(min = 0, max = 1){
  // returns 1 or 0 when no params passed.
  return Math.round(min + (Math.random() * (max - min)))
}

// game tick

function GameStep(){
  // Center game window
  //  > why would anyone resize their game mid-pong? idfk but gotta account for it. fml

  game.board.x = (Renderer.screen.getWidth() / 2) - (game.board.width / 2)
  game.board.y = (Renderer.screen.getHeight() / 2) - (game.board.height / 2)

  switch (game.gamestates.state){
    case 0:
      // PLAYING

      // Move player paddle
      if (Keyboard.isKeyDown(Keyboard.KEY_UP)){
        MovePaddle(-2)
      }
      if (Keyboard.isKeyDown(Keyboard.KEY_DOWN)){
        MovePaddle(2)
      }

      // Move Computer paddle
      SimulatePaddle()
      

      // Move puck (duh)
      MovePuck()
      break
    case 1:
      // GAME OVER
      break
    case -1:
      // START
      break
  }
}

register("step", () => {
  if (!gui.isOpen()) return
  GameStep()
}).setFps(game.speed)


// magic game gui shit 

let gui = new Gui()


function drawLogo(){
  let s = "&6Pong <(^w^)>P"
  let x = (Renderer.screen.getWidth() / 2) - (Renderer.getStringWidth(s) / 2)
 
  Renderer.drawString(s, x, game.board.y - 40)
}

gui.registerDraw((mouseX, mouseY) => {
  // Background tint
  Renderer.drawRect(game.colours.background, 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())

  Renderer.drawString("Hello debug", 1, Renderer.screen.getHeight() - 9)
  drawLogo()

  // Draw board
  Renderer.drawRect(game.colours.border, game.board.x - 0.5, game.board.y - 0.5, game.board.width + 1, game.board.height + 1)
  Renderer.drawRect(game.colours.board, game.board.x, game.board.y, game.board.width, game.board.height)

  switch (game.gamestates.state){
    case -1:
      // PREGAME

      // wow, so empty
      break
    case 0: 
    // IN GAME

      // DRAW SCORE
      Renderer.drawRect(game.colours.border, game.board.x - 0.5, game.board.y + game.board.height, Renderer.getStringWidth(`Score: ${game.gamestates.score}`) + 11, 12.5)
      Renderer.drawRect(game.colours.board, game.board.x, game.board.y + game.board.height, Renderer.getStringWidth(`Score: ${game.gamestates.score}`) + 10, 12)
      Renderer.drawString(`Score: &6${game.gamestates.score}`, game.board.x + 5, game.board.y + game.board.height + 2)


      // DRAW PADDLES

      // Player
      Renderer.drawRect(game.colours.playerpaddle, game.board.x + 1, game.paddles.player.y + game.board.y, 3, game.paddles.height)

      // Computer
      Renderer.drawRect(game.colours.computerpaddle, game.board.x + game.board.width - 4, game.paddles.computer.y + game.board.y, 3, game.paddles.height)


      // DRAW PUCK
      Renderer.drawRect(game.colours.puck, game.board.x + game.puck.x, game.board.y + game.puck.y, 3, 3)
      break
    case 1:
      // GAME OVER
      Renderer.drawString("&6Game Over!", game.board.x + ((game.board.width / 2) - (Renderer.getStringWidth("Game Over!") / 2)), game.board.y + 30)
      Renderer.drawString(`&fFinal Score: &6${game.gamestates.score}`, game.board.x + ((game.board.width / 2) - (Renderer.getStringWidth(`Final Score: &6${game.gamestates.score}`) / 2)), game.board.y + 50)

      // JUAN
      
      Renderer.drawImage(juan, game.board.x + ((game.board.width / 2) - 40), game.board.y + 130, 80, 80)
      break
  }

  /* debug
  Renderer.drawString("&3Debug", game.board.x + 10, game.board.y + 1)
  Renderer.drawString(`Puck x: ${game.puck.x}, Puck y: ${game.puck.y}`, game.board.x + 10, game.board.y + 10)
  Renderer.drawString(`Board x: ${game.board.x}, Board y: ${game.board.y}`, game.board.x + 10, game.board.y + 22)
  Renderer.drawString(`Board width: ${game.board.width}, Board height: ${game.board.height}`, game.board.x + 10, game.board.y + 31)
  */

})


function OpenGame(){
  // Reset gameplay variables
  game.gamestates.score = 0

  game.puck.x = RandomInt(100, 200)
  game.puck.y = RandomInt(80, 120)

  // hackiest shitcode
  game.puck.movedirx = 1
  game.puck.movediry = RandomInt() === 0? -1: 1
  //game.gamestates.state = game.gamestates.states.START

  game.paddles.player.y = 115
  game.paddles.computer.y = 115

  game.gamestates.state = game.gamestates.states.PLAYING // Debugging purposes, contact me if I accidentally leave this in release



  gui.open()
}

register("command", (speed = 1) => {
  OpenGame()
}).setName("pong")

// Kill me please