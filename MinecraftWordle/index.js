
import Rectangle from "./rectangle"
import Button from "./button"
import wordlelist from "./words"

let background
let sideBox

let restartButton
class Tile{
  constructor(letter, x, y, state){
    this.letter = letter
    this.x = x
    this.y = y


    this.state = state

    this.colourNone = Renderer.color(33, 33, 33)
    this.colourSomewhere = Renderer.color(120, 120, 33)
    this.colourCorrect = Renderer.color(33, 120, 33)
    this.tile = new Rectangle(this.x, this.y, 15, 15, this.colourNone)
  }

  draw(){
    if (this.state == 1){
      this.tile = new Rectangle(this.x, this.y, 15, 15, this.colourNone)
    } else if (this.state == 2){
      this.tile = new Rectangle(this.x, this.y, 15, 15, this.colourSomewhere)
    } else if (this.state == 3){
      this.tile = new Rectangle(this.x, this.y, 15, 15, this.colourCorrect)
    }
 

    this.tile.draw()
    Renderer.drawString(this.letter, (this.x + 7.5) - (Renderer.getStringWidth(this.letter) / 2), this.y + 3)
  }


}

class InputBar{
  constructor(x, y, width, max){
      this.x = x;
      this.y = y;
      this.max = max
      this.width = width;


      this.height = 15
      this.string = ""

      this.charArray = this.string.split('')

      this.backgroundColour = Renderer.color(15, 15, 15)

      this.backBox = new Rectangle(this.x, this.y, this.width - 19, 15, this.selected? this.backgroundColourSelected : this.backgroundColour)

      this.customIndex = false
      this.index = 0
      this.indexLineX = this.x + 2

      this.sendButton = new Button("->", this.x + this.width - 17, this.y, 15, this.height, 2, send)
  }

  draw(mouseX, mouseY){
      if (game.failed) return
      this.backBox.draw()
      this.sendButton.draw(mouseX, mouseY)
      Renderer.drawString(this.string, this.x + 2, this.y + 4)
      
      let temp = 0
      for (let i = 0; i < this.index; i++){
          temp += Renderer.getStringWidth(this.charArray[i])
      }
      this.indexLineX = this.x + 2 + temp
    
      Renderer.drawRect(Renderer.color(255, 255, 255, 155), this.indexLineX, this.y + 2, 0.5, 11)
  }

  keyPress(char, keycode){
      if (game.failed) return
      if (/[a-z]/.test(char)){
          if (this.string.length < this.max){
              this.charArray.splice(this.index, 0, char)
              this.index++
          }
      } else {
          switch(keycode){
              case 14:
                  //backspace
                  this.charArray.splice(this.index - 1, 1)
                  this.index--
                  
              break
              case 203:
                  //left arrow
                  this.customIndex = true


                  if (this.index > 0){
                      this.index--
                  }
              break
              case 205:
                  //right arrow
                  this.customIndex = true

                  if (this.index < this.string.length){
                      this.index++
                  }
              break
          }
      }
      this.string = this.charArray.join('')

      if (this.index == this.string.length) {
          this.customIndex = false;
      }
      if (!this.customIndex) this.index = this.string.length
  }
}

class Game{
  constructor(word){
    this.word = word
    this.length = this.word.length
    this.letters = this.word.split('')

    this.tiles = []

    this.attempt = 0

    this.failed = false
    this.won = false

    this.inputLetters = []
    

    background = new Rectangle(250, 50, (this.length * 16) + 9, (6 * 16) + 35, Renderer.color(22, 22, 22))
    sideBox = new Rectangle(250 + background.width + 5, Renderer.getStringWidth("(6 remaining)") + 8, 80, 60, Renderer.color(22, 22, 22))
    this.titleRect = new Rectangle(250, 50, background.width, 14, Renderer.color(28,28,28))
    this.bottomRect = new Rectangle(250, background.y + background.height - 21, background.width, 21, Renderer.color(28,28,28))
    restartButton = new Button("Play Again", background.x + 7, background.y + background.height - 25, background.width - 14, 18, 2, startGame, "ooga booga")
    this.inputBar = new InputBar(background.x + 2, background.y + background.height - 17, background.width - 4, this.length, this.inputWord)
  }
  
  inputWord(input){
    this.inputLetters = input.split('')
    this.letters = this.word.split('')

    for (let i = 0; i < input.length; i++){
      let tile = new Tile(input[i], background.x + 5 + (i * 16), background.y + 13 + (this.attempt * 16), this.checkLetter(input[i], i))
      this.tiles.push(tile)
    }
    this.attempt++

    if (input == this.word) {
      endGame()
      this.won = true;
      return
    } 

    if (this.attempt > 5){
      endGame()
      this.failed = true
    }
  }

  checkLetter(letter, index){
    if (this.letters[index] == letter){
      this.letters[index] = ""
      return 3
    } else if (this.letters.includes(letter)){
      this.letters[this.letters.indexOf(letter, 0)] = ""
      return 2
    } else {
      return 1
    }
  }

  draw(mouseX, mouseY){
    if (!this.failed){
      this.tiles.forEach(tile => {
        tile.draw()
      })
      this.inputBar.draw(mouseX, mouseY)
    }
  }
}

function send(){
  if (game.inputBar.string.length == game.length){
    game.inputWord(game.inputBar.string)
  }
}

let game = new Game("newgame")
startGame()

function startGame(debugWord){
  if (debugWord != undefined){
    game = new Game(debugWord)
    return
  }
  let random = Math.floor(Math.random() * wordlelist.length)
  game = new Game(wordlelist[random])
}

restartButton = new Button("Play Again", background.x + 7, background.y + background.height - 25, background.width - 14, 18, 2, startGame, "ooga booga")

let gui = new Gui()

gui.registerDraw(draw)

gui.registerKeyTyped( keypress)

gui.registerClicked(click)

function click(mouseX, mouseY){
  if (!game.failed && !game.won){
    game.inputBar.sendButton.click(mouseX, mouseY)
  } else {
    restartButton.click(mouseX, mouseY)
  }
}

function endGame(){
  background.height = 70
  restartButton.y = background.y + background.height + 3
}
function keypress(char, keycode){
  game.inputBar.keyPress(char, keycode)
}
function draw(mouseX, mouseY){
  background.draw()
  if (!game.failed && !game.won){
    sideBox.draw()
    game.titleRect.draw()
    game.bottomRect.draw() 
    Renderer.drawRect(Renderer.color(22, 22, 22), 250, game.titleRect.y + 11, background.width, 4)
    Renderer.drawRect(Renderer.color(22, 22, 22), 250, game.bottomRect.y - 2, background.width, 4)

    Renderer.drawString("Wordle", background.x + (background.width / 2) - (Renderer.getStringWidth("Wordle") / 2), background.y + 2)

    Renderer.drawString("Characters", sideBox.x + (sideBox.width / 2) - (Renderer.getStringWidth("Characters") / 2), sideBox.y + 5)
    Renderer.drawString("&7" + game.length, sideBox.x + (sideBox.width / 2) - (Renderer.getStringWidth(game.length) / 2), sideBox.y + 15)
  
    Renderer.drawString("Attempts", sideBox.x + (sideBox.width / 2) - (Renderer.getStringWidth("Attempts") / 2), sideBox.y + 30)
    Renderer.drawString("&7" + game.attempt, sideBox.x + (sideBox.width / 2) - (Renderer.getStringWidth(game.attempt) / 2), sideBox.y + 40)
    Renderer.drawString(`&8(${6 - game.attempt} remaining)`, sideBox.x + (sideBox.width / 2) - (Renderer.getStringWidth(`(${6 - game.attempt} remaining)`) / 2), sideBox.y + 49)

    //Renderer.drawString(`&c[DEBUG] word: ${game.word}`, sideBox.x + 4, sideBox.y + sideBox.height + 2)
    game.draw(mouseX, mouseY)
  } else if (game.failed){
    Renderer.drawString("&cFail", background.x + (background.width / 2) - (Renderer.getStringWidth("Fail") / 2), background.y + 13)
    Renderer.drawString("The word was:", background.x + (background.width / 2) - (Renderer.getStringWidth("The word was:") / 2), background.y + 28)
    Renderer.drawString(`&3${game.word}`, background.x + (background.width / 2) - (Renderer.getStringWidth(game.word) / 2), background.y + 38)
  
    restartButton.draw(mouseX, mouseY)
  } else if (game.won) {
    Renderer.drawString("&aWINNER!", background.x + (background.width / 2) - (Renderer.getStringWidth("WINNER!") / 2), background.y + 13)
    Renderer.drawString("Found in:", background.x + (background.width / 2) - (Renderer.getStringWidth("Found in:") / 2), background.y + 28)
    Renderer.drawString(`&3${game.attempt} &ftries!`, background.x + (background.width / 2) - (Renderer.getStringWidth(`${game.attempt} tries!`) / 2), background.y + 38)
    
    restartButton.draw(mouseX, mouseY)
  } else {
    Renderer.drawString("wtf how", background.x + 2, background.y + 13)
  }
}

register("command", (inp) => {game.inputWord(inp)}).setName("input")

register("command", (debug) => {
  if (debug != undefined) {
    startGame(debug)
  }
  gui.open()
}).setName("wordle")