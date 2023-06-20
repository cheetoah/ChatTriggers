/// <reference types="../CTAutocomplete" />

import { Sudoku } from "./creator"

let sudoku

// sorry
let page 
let answers

let starttime
let playerTiles = []
let mistakes
let selectedTile = [[-1],[-1]]

let endtime = -1


register("command", (seed) => {
  if (seed != "load"){
    playerTiles = []
    mistakes = 0
    starttime = Date.now()
    sudoku = new Sudoku(9, 30)
    endtime = -1
    sudoku.fillValues()
    page = sudoku.GetPage()
    answers = sudoku.GetAnswers()

    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        if (page[i][j] == 0){
          playerTiles.push([[i], [j]])
        }
      }
    } 
    SaveGame()
  } else {
    LoadGame()
  }
  
  game.page.x = (Renderer.screen.getWidth() / 2) - (game.page.width / 2)
  for (let i = 0; i < 10; i++){
    numkeys[i].x = game.page.x - 34
    numkeys[i].y = game.page.y + 4 + (i*30)
  }


  setTimeout(()=> {gui.open()}, 20)
}).setName("sudoku")

let game = {
  page:{
    x: 100,
    y: 100,
    width: 289,
    height: 309,
  },
  colours:{
    header: Renderer.color(45, 45, 55),
    background: Renderer.color(15, 15, 25),
    tile_found: Renderer.color(45, 45, 45),
    tile_incorrect: Renderer.color(200, 30, 30),
    tile_zero: Renderer.color(45, 45, 45),
    overlay_a: Renderer.color(65, 65, 95, 100),
    overlay_b: Renderer.color(15, 15, 15, 100)
  }
}

class numkey{
  constructor(num){
    this.num = num;
    
    this.x = 0;
    this.y = 0;
    
    this.width = 30

    this.hovered = false
  }

  draw(mouseX, mouseY){
    this.hovered = false;
    if (mouseX > this.x && mouseX < this.x + this.width){
      if (mouseY > this.y && mouseY < this.y + this.width){
        this.hovered = true;
      }
    }

    Renderer.drawRect(this.hovered? game.colours.tile_found:game.colours.header, this.x, this.y, this.width, this.width)
    Renderer.drawString(this.num == 0? "&cdel": this.num, this.x + (this.width/2) - ((Renderer.getStringWidth(this.num == 0? Renderer.getStringWidth("del") : Renderer.getStringWidth(this.num.toString())))/2), this.y + 11)
  }

  click(){
    if (this.hovered){
      if (selectedTile[0] == -1) return

      page[selectedTile[0]][selectedTile[1]] = this.num

      if (this.num != answers[[selectedTile[0]]][selectedTile[1]] && this.num !== 0){
        mistakes++
        return
      }

      if (CheckWin()) {
        endtime = Date.now()
      }
    }
  }
}

function CheckWin(){
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      if (page[i][j] !== answers[i][j]) return false
    }
  }
  return true
}

let numkeys = []
for (let i = 0; i < 10; i++){
  numkeys.push(new numkey(i))
  numkeys[i].x = game.page.x - 34
  numkeys[i].y = game.page.y + game.page.height - 4 - (i*30)
}

let gui = new Gui()

gui.registerDraw((mouseX, mouseY) => {
  mx = mouseX
  my = mouseY
  // Page
  Renderer.drawRect(game.colours.background, game.page.x, game.page.y, game.page.width, game.page.height)
  Renderer.drawRect(game.colours.header, game.page.x, game.page.y, game.page.width, 20)
  Renderer.drawString("Sudoku.js", game.page.x + 10, game.page.y + 6)

  Renderer.drawString(`Mistakes: &c${mistakes}`, ((game.page.x + game.page.width) - (Renderer.getStringWidth(`Mistakes: ${mistakes}`)) - 10), game.page.y + 6)
  let time = endtime > 0? `Completed: &6${Math.floor((endtime - starttime) / 1000)}` : Math.floor((Date.now() - starttime) / 1000)
  Renderer.drawString(`${time}s`, (game.page.x + Renderer.getStringWidth(`Sudoku.ks`)) + 50, game.page.y + 6)
 
  for (let i = 0; i< 3; i++){
    for (let j = 0; j < 3; j++){
      //Renderer.drawRect((i+j)%2==0?game.colours.overlay_a:game.colours.overlay_b, game.page.x + 6 + (i * 93), game.page.y + 25 + (j * 93), 93, 93)
    }
  }

  // Draw Numbers
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      let tile = page[i][j]

      let oc = ((Math.floor(i/3))+(Math.floor(j/3))) % 2 == 0? game.colours.overlay_a: game.colours.overlay_b


      if ([[i],[j]].toString() == selectedTile.toString()){
        oc = Renderer.color(40, 45, 100, 100)
      }
      if (tile == 0){
        Renderer.drawRect(game.colours.tile_zero, game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31), 28, 28)

        Renderer.drawRect(oc, game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31), 28, 28)

        //Renderer.drawString(`&8${answers[i][j]}`, game.page.x + 7 + (i * 31) + (14 - (Renderer.getStringWidth(tile) / 2)), game.page.y + 36 + (j * 31))
      } else {

        if (tile == answers[i][j]){
          Renderer.drawRect(game.colours.tile_found, game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31), 28, 28)
        } else {
          Renderer.drawRect(game.colours.tile_incorrect, game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31), 28, 28)
        }
        Renderer.drawRect(oc, game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31), 28, 28)

        Renderer.drawString(checkPlayerTile(i, j)? `&b${tile}` : `&f${tile}`, game.page.x + 7 + (i * 31) + (14 - (Renderer.getStringWidth(tile) / 2)), game.page.y + 36 + (j * 31))
      }
      
    }
  }

  // Draw Numkeys
  for (let i = 0; i < 10; i++){
    numkeys[i].draw(mouseX, mouseY)
  }
  
})

let mx, my
gui.registerClicked((mouseX, mouseY) => {
  for (let i = 0; i < 10; i++){
    numkeys[i].click()
  }

  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      let tile = page[i][j]

     
      if (tile == 0 || checkPlayerTile(i, j)){
        let bounds = [game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31)]
        
        if (mouseX > bounds[0] && mouseX < bounds[0] + 28){
          if (mouseY > bounds[1] && mouseY < bounds[1] + 28){
            
            selectedTile = [[i],[j]]
            
           
          }
        }
      } 
    }
  }
})

gui.registerKeyTyped((str, key) => {
  
  if (/[0-9]/.test(str)){
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        let tile = page[i][j]
        
        if (tile == 0 || checkPlayerTile(i, j)){
          let bounds = [game.page.x + 7 + (i * 31), game.page.y + 26 + (j * 31)]
         
          if (mx > bounds[0] && mx < bounds[0] + 28){
            
            if (my > bounds[1] && my < bounds[1] + 28){
              
              page[i][j] = parseInt(str)

              if (parseInt(str) != answers[i][j] && parseInt(str) !== 0){
                mistakes++
                return
              }
              
              if (CheckWin()) {
                endtime = Date.now()
              }
            }
          }
        } 
      }
    }
  }
})

const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor")

function checkPlayerTile(i, j){
  let m = false
  playerTiles.forEach(t => {
    if ((t[0] == i && t[1] == j)) {m = true}
  })
  return m;
}

let inttochar = {}

for (let i = 0; i < 10; i++){
  inttochar[i] = String.fromCharCode(65 + i)
}

let chartoint = {
  "A": 0,
  "B": 1,
  "C": 2,
  "D": 3,
  "E": 4,
  "F": 5,
  "G": 6,
  "H": 7,
  "I": 8,
  "J": 9,
}



function SaveGame(){

  let game = {
    p: page,
    a: answers
  }

  let str = JSON.stringify(game)
 
  let res = "Sudoku@"
  for (let i = 0; i < str.length;i++){
    if (inttochar[str[i]] != undefined){
      res = `${res}${inttochar[str[i]]}`
    }
  }
  
  ChatLib.chat("&aCopied game to clipboard.")
  ChatLib.command(`ct copy ${res}`, true)
}

function LoadGame(){

  let game = {
    pad: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    answers: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }

  let res = Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor)

  if (res.length != 169){
    ChatLib.chat("&cNo game copied to clipboard")
    ChatLib.command("sudoku", true)
    return
  }
  ChatLib.chat("&aLoading game from clipboard")
  res = res.replace("Sudoku@", "")

  let parta = res.substring(0, (res.length)/2)
  let partb = res.substring(parta.length, res.length)
  
  // Load pad
  let c = 0
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){

      game.pad[i][j] = chartoint[parta[c]]
   
      c++
    }
  }

  // Load answers
  c = 0
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){

      game.answers[i][j] = chartoint[partb[c]]
  
      c++
    }
  }


  page = game.pad
  answers = game.answers
 
  // Setup game
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      if (page[i][j] == 0){
        playerTiles.push([[i], [j]])
      }
    }
  } 
  
  endtime = -1
  starttime = Date.now()
  mistakes = 0
}