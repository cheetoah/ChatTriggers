/// <reference types="../CTAutocomplete" />

import request from "../requestV2"
const File = java.io.File;

let ui = {
    "x": 100,
    "y": 100,
    "width": 300,
    "height": 186,
    "colours": {
        "Background": Renderer.color(15, 15, 15),
        "Header": Renderer.color(25, 25, 25),
        "Accent": Renderer.color(180, 60, 190),
        "Tab": Renderer.color(20, 20, 20),
        "Expanded": Renderer.color(25, 25, 25),
        "TabExpanse": Renderer.color(10, 10, 10),
        "Button": Renderer.color(25, 25, 25),
        "ButtonHovered": Renderer.color(22, 22, 22)
    },
    "animate": true,
    "backroundAlpha": 0,
    "inAnimation": false
}


class GameTab{
    constructor(name, module, author, commands){
        this.name = name;
        this.module = module;
        this.author = author;

        this.commands = commands;

        this.x = 0;
        this.y = 0;
        this.width = 120;
        this.height = 30;

        this.installed = true

        this.descriptionLines = [""]

        this.expandHovered = false
    }

    draw(mouseX, mouseY){
        this.expandHovered = false
        if (mouseX > this.x + this.width - 20 && mouseX < this.x + this.width){
            if (mouseY > this.y && mouseY < this.y + this.height){
                this.expandHovered = true
            }
        }

        Renderer.drawRect(expandedTab == this? ui.colours.Expanded : ui.colours.Tab, this.x, this.y, this.width, this.height)
        Renderer.drawString(this.name, this.x + 3, this.y + 3)
        Renderer.drawString(`&7created by ${this.author}`, this.x + 3, this.y + 13)

        Renderer.drawRect(this.expandHovered? ui.colours.ButtonHovered:ui.colours.Button, this.x + this.width - 20, this.y + 1, 20, this.height-2)
        Renderer.drawString(`${this.expandHovered?"&6":"&f"}${expandedTab == this? "&e<": ">"}`, this.x + this.width - 10 - (Renderer.getStringWidth(">")/2), this.y + (this.height/2)-4)

        if (expandedTab != this) return

        Renderer.drawRect(ui.colours.TabExpanse, this.x + this.width + 3, ui.y + 23, ui.width - this.width - 9, ui.height - 26)
        Renderer.drawString(`&6${this.name} &7 - ${this.installed? "&7 Installed" : "&c Not Installed"}`, this.x + this.width + 7, ui.y + 26)
        this.descriptionLines.forEach((l, i) => {
            Renderer.drawString(`&7${l}`, this.x + this.width + 7, ui.y + 46 + (9*i))
        })

        if (this.installed){
            this.commands.forEach((c, i) => {
                let bounds = {
                    "x": this.x + this.width + 7,
                    "y": (ui.y + ui.height - 4) - ((i+1)*18),
                    "width": Renderer.getStringWidth(c[1]) + 8,
                    "height": 16
                }
    
                let hovered = false
    
                if (mouseX > bounds.x && mouseX < bounds.x + bounds.width){
                    if (mouseY > bounds.y && mouseY < bounds.y + bounds.height){
                        hovered = true
                    }
                }
    
                Renderer.drawRect(hovered? ui.colours.ButtonHovered:ui.colours.Button, bounds.x, bounds.y, bounds.width, bounds.height)
                Renderer.drawString(c[1], bounds.x + 4, bounds.y + 4)
    
                if (hovered){
                    let w = Renderer.getStringWidth(`/${c[0]}`) + 6
                    let h = 14
    
                    Renderer.drawRect(ui.colours.Accent, mouseX+3.5,mouseY-4.5, w+1, h+1)
                    Renderer.drawRect(ui.colours.Header, mouseX+4, mouseY-4, w, h)
                    Renderer.drawString(`&7/${c[0]}`, mouseX+7, mouseY-1)
                }
            })
        } else {

            let bounds = {
                "x": this.x + this.width + 7,
                "y": (ui.y + ui.height - 22),
                "width": Renderer.getStringWidth("Import Module") + 8,
                "height": 16
            }

            let hovered = false
                if (mouseX > bounds.x && mouseX < bounds.x + bounds.width){
                    if (mouseY > bounds.y && mouseY < bounds.y + bounds.height){
                        hovered = true
                    }
                }
            

            Renderer.drawRect(hovered? ui.colours.ButtonHovered:ui.colours.Button, bounds.x, bounds.y, bounds.width, bounds.height)
            Renderer.drawString("&aImport Module", bounds.x + 4, bounds.y + 4)

            if (hovered){
                let w = Renderer.getStringWidth(`/ct import ${this.module}`) + 6
                let h = 14

                Renderer.drawRect(ui.colours.Accent, mouseX+3.5,mouseY-4.5, w+1, h+1)
                Renderer.drawRect(ui.colours.Header, mouseX+4, mouseY-4, w, h)
                Renderer.drawString(`&7/ct import ${this.module}`, mouseX+7, mouseY-1)
            }
        }
    }

    click(mouseX, mouseY){
        if (this.expandHovered){
            if (expandedTab == this) return expandedTab = undefined
            expandedTab = this;
        }

        if (expandedTab !== this) return
        if (this.installed){
            this.commands.forEach((c, i) => {
                let bounds = {
                    "x": this.x + this.width + 7,
                    "y": (ui.y + ui.height - 4) - ((i+1)*18),
                    "width": Renderer.getStringWidth(c[1]) + 8,
                    "height": 16
                }

        
                if (mouseX > bounds.x && mouseX < bounds.x + bounds.width){
                    if (mouseY > bounds.y && mouseY < bounds.y + bounds.height){
                        close()
                        setTimeout(() => {ChatLib.command(this.commands[i][0], true)}, 1000)
                    }
                }

                
            })
        } else {
            let bounds = {
                "x": this.x + this.width + 7,
                "y": (ui.y + ui.height - 22),
                "width": Renderer.getStringWidth("Import Module") + 8,
                "height": 16
            }

            
            if (mouseX > bounds.x && mouseX < bounds.x + bounds.width){
                if (mouseY > bounds.y && mouseY < bounds.y + bounds.height){
                    ChatLib.command(`ct import ${this.module}`, true)
                    setTimeout(()=> {this.installed = CheckExists(this.module)}, 1000)
                }
            }
            
        }
    }
    
    setDescription(description){
        this.descriptionLines = description.split("\n")
        this.installed = CheckExists(this.module)
    }
}

let tabs = [
    new GameTab("Wordle", "MinecraftWordle", "Farlow", [["wordle", "New Game"]]),
    new GameTab("Pong", "Pong", "Farlow", [["pong", "New Game"]]),
    new GameTab("Sudoku", "Sudoku", "Farlow", [["sudoku", "New Game"], ["sudoku load", "Load game from clipboard"]]),
    new GameTab("Minesweeper", "Narada", "Dalwyn", [["minesweeper", "New Game"]]),
    new GameTab("Snake", "Snake", "Debug", [["snake", "New Game"]]),
]

tabs[0].setDescription("6 attempts to correctly guess \nthe 5-letter word.")
tabs[1].setDescription("Move the paddle to prevent\nthe puck from touching\nthe left hand wall. \n\n&3Arrow keys to control.")
tabs[2].setDescription("Fill in the grid to win.\nNumbers 1 to 9 must be in\neach 3x3 cell.\nNumbers 1 to 9 must be in\neach row and column.\n\n&3Hover over slot and press\n&3key to enter number.")
tabs[3].setDescription("Idfk how this game works.\nDalwyn please write this\ndescription for me.")
tabs[4].setDescription("Everyone knows how to play...\n... right??\n\n&cPlaceholder - not started yet.\n&c(Debug we rely on you)")
let expandedTab

let gui = new Gui()

register("command", ()=> {gui.open()}).setName("games")

let i = 0
register('step', i => {
    ui.colours.Accent = Renderer.getRainbow(i)
}).setFps(5)

gui.registerDraw((mouseX, mouseY) => {
   
    Renderer.drawRect(Renderer.color(0, 0, 0, ui.backroundAlpha), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
    Renderer.drawRect(ui.colours.Accent, ui.x - 1.5, ui.y - 0.5, ui.width+3, 21)
    Renderer.drawRect(ui.colours.Accent, ui.x - 0.5, ui.y - 0.5, ui.width+1, ui.height+1)
    Renderer.drawRect(ui.colours.Background, ui.x, ui.y, ui.width, ui.height)
    Renderer.drawRect(ui.colours.Header, ui.x-1, ui.y, ui.width+2, 20)

    // Dont draw elements if open animation is playing
    if (ui.inAnimation) return

    Renderer.drawString("Game Browser", ui.x + 3, ui.y + 6)

    tabs.forEach((tab, i) => {
        tab.x = ui.x + 3
        tab.y = ui.y + 23 + (32*i)
        tab.draw(mouseX, mouseY)
    })

    if (expandedTab) return

    Renderer.drawString("A collection of minigames", ui.x + tabs[0].width + 25, ui.y - 4 + (ui.height/2))
    Renderer.drawString("&7Click > to expand!", ui.x + tabs[0].width + 25, ui.y + 10 + (ui.height/2))
})


gui.registerClicked((mouseX, mouseY) => {
    tabs.forEach(v => {
        v.click(mouseX, mouseY)
    })
})

gui.registerOpened(()=> {
    if (!ui.animate) return

    ui.inAnimation = true
    // save gui size
    let pre = {
        "width": ui.width,
        "height": ui.height
    }
    
    // animate opening
    new Thread(() => {
        for (let i = 0; i < 1; i+= 0.05){
            ui.backroundAlpha = 230 * ease(i)
            ui.width = pre.width * ease(i)
            ui.height = pre.height * ease(i)
            ui.x = (Renderer.screen.getWidth()/2) - (ui.width / 2)
            ui.y = (Renderer.screen.getHeight()/2) - (ui.height / 2)
            Thread.sleep(7)
        }

        ui.width = pre.width
        ui.height = pre.height
        ui.x = (Renderer.screen.getWidth()/2) - (ui.width / 2)
        ui.y = (Renderer.screen.getHeight()/2) - (ui.height / 2)
        ui.inAnimation = false
    }).start()

    tabs.forEach(t => {
        t.installed = CheckExists(t.module)
    })
})

function close(){
    if (!ui.animate) return

    ui.inAnimation = true
    // save gui size
    let pre = {
        "width": ui.width,
        "height": ui.height
    }
    
    // animate closing
    new Thread(() => {
        for (let i = 1; i >0; i-= 0.05){
            ui.backroundAlpha = 230 * ease(i)
            ui.width = pre.width * ease(i)
            ui.height = pre.height * ease(i)
            ui.x = (Renderer.screen.getWidth()/2) - (ui.width / 2)
            ui.y = (Renderer.screen.getHeight()/2) - (ui.height / 2)
            Thread.sleep(7)
        }
        
        gui.close()

        ui.width = pre.width
        ui.height = pre.height
        ui.x = (Renderer.screen.getWidth()/2) - (ui.width / 2)
        ui.y = (Renderer.screen.getHeight()/2) - (ui.height / 2)
        ui.inAnimation = false
        
    }).start()
}

function ease(t) {
    return t * (((1 - t) * t) ** 2) + t ** 3;
}


function CheckExists(name){
    return new File(`./config/ChatTriggers/modules/${name}`).exists()
}