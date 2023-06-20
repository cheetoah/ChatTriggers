/// <reference types="../CTAutocomplete" />
import PogObject from "../PogData";

const File = java.io.File;

let settings = new PogObject("Minigames", {
    "animate": true,
    "rainbowAccent": false,
    "darkMode": true,
    "colours": {
        "Text": "&f",
        "Background": Renderer.color(15, 15, 15),
        "Header": Renderer.color(25, 25, 25),
        "Accent": Renderer.color(180, 60, 190),
        "Tab": Renderer.color(20, 20, 20),
        "Expanded": Renderer.color(25, 25, 25),
        "TabExpanse": Renderer.color(10, 10, 10),
        "Button": Renderer.color(25, 25, 25),
        "ButtonHovered": Renderer.color(22, 22, 22)
    }
})
settings.save()
let ui = {
    "x": 100,
    "y": 100,
    "width": 300,
    "height": 186,
    "backroundAlpha": 0,
    "inAnimation": false,

    "settingsOpen": false,
    "settingsWindow":{
        "x": 0,
        "y": 0,
        "width": 140,
        "height": 64,
        "inAnimation": false,
        "dragging": false
    }
}

let themes = [
    "Light" = {
        "Text": "&8",
        "Background": Renderer.color(240, 240, 240),
        "Header": Renderer.color(255, 255, 255),
        "Accent": Renderer.color(180, 60, 190),
        "Tab": Renderer.color(220, 220, 220),
        "Expanded": Renderer.color(235, 235, 235),
        "TabExpanse": Renderer.color(255, 255, 255),
        "Button": Renderer.color(205, 205, 205),
        "ButtonHovered": Renderer.color(182, 182, 182)
    },
    "Dark" = {
        "Text": "&f",
        "Background": Renderer.color(15, 15, 15),
        "Header": Renderer.color(25, 25, 25),
        "Accent": Renderer.color(180, 60, 190),
        "Tab": Renderer.color(20, 20, 20),
        "Expanded": Renderer.color(25, 25, 25),
        "TabExpanse": Renderer.color(10, 10, 10),
        "Button": Renderer.color(25, 25, 25),
        "ButtonHovered": Renderer.color(22, 22, 22)
    }
]

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
        
        Renderer.drawRect(expandedTab == this? settings.colours.Expanded : settings.colours.Tab, this.x, this.y, this.width, this.height)
        Renderer.drawString(`${settings.colours.Text}${this.name}`, this.x + 3, this.y + 3)
        Renderer.drawString(`&7created by ${this.author}`, this.x + 3, this.y + 13)

        Renderer.drawRect(this.expandHovered? settings.colours.ButtonHovered:settings.colours.Button, this.x + this.width - 20, this.y + 1, 20, this.height-2)
        Renderer.drawString(`${this.expandHovered?"&6":settings.colours.Text}${expandedTab == this? "&e<": ">"}`, this.x + this.width - 10 - (Renderer.getStringWidth(">")/2), this.y + (this.height/2)-4)

        if (expandedTab != this) return

        Renderer.drawRect(settings.colours.TabExpanse, this.x + this.width + 3, ui.y + 23, ui.width - this.width - 9, ui.height - 26)
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
    
                Renderer.drawRect(hovered? settings.colours.ButtonHovered:settings.colours.Button, bounds.x, bounds.y, bounds.width, bounds.height)
                Renderer.drawString(`${settings.colours.Text}${c[1]}`, bounds.x + 4, bounds.y + 4)
    
                if (hovered){
                    let w = Renderer.getStringWidth(`/${c[0]}`) + 6
                    let h = 14
    
                    Renderer.drawRect(settings.colours.Accent, mouseX+3.5,mouseY-4.5, w+1, h+1)
                    Renderer.drawRect(settings.colours.Header, mouseX+4, mouseY-4, w, h)
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
            

            Renderer.drawRect(hovered? settings.colours.ButtonHovered:settings.colours.Button, bounds.x, bounds.y, bounds.width, bounds.height)
            Renderer.drawString("&aImport Module", bounds.x + 4, bounds.y + 4)

            if (hovered){
                let w = Renderer.getStringWidth(`/ct import ${this.module}`) + 6
                let h = 14

                Renderer.drawRect(settings.colours.Accent, mouseX+3.5,mouseY-4.5, w+1, h+1)
                Renderer.drawRect(settings.colours.Header, mouseX+4, mouseY-4, w, h)
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
                        setTimeout(() => {ChatLib.command(this.commands[i][0], true)}, settings.animate? 600 : 10)
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

class SettingsToggle{
    constructor(name, callback, tooltip = ""){
        this.name = name;
        this.callback = callback;
        this.tooltip = tooltip;

        this.bounds = {
            "x": 0,
            "y": 0,
            "width": Renderer.getStringWidth(this.name) + 15,
            "height": 8
        }

        this.state = false

        this.pillx = 0

        this.hovered = false;
    }

    loadState(){
        this.state = settings[this.callback]
        this.pillx = this.state? 8 : 1
    }

    draw(mouseX, mouseY){
        this.hovered = false;

        if (mouseX > this.bounds.x && mouseX < this.bounds.x + this.bounds.width){
            if (mouseY > this.bounds.y && mouseY < this.bounds.y + this.bounds.height){
                this.hovered = true
            }
        }
        Renderer.drawRect(this.hovered? settings.colours.ButtonHovered : settings.colours.Button, this.bounds.x, this.bounds.y, 15, this.bounds.height)
        Renderer.drawString(this.hovered? `${settings.colours.Text}${this.name}`: `&7${this.name}`, this.bounds.x + 17, this.bounds.y)

        Renderer.drawRect(this.state? Renderer.color(35, 240, 55) : Renderer.color(240, 35, 55), this.bounds.x + this.pillx, this.bounds.y + 1, 6, 6)

        if (!this.hovered || this.tooltip == "") return

        let w = Renderer.getStringWidth(this.tooltip) + 6
        let h = 12

        Renderer.translate(0, 0, 500) // Stop setting object below overlaying tooltip
        Renderer.drawRect(Renderer.BLACK, mouseX + 3.5, mouseY - 4.5, w+1, h+1)
        Renderer.translate(0, 0, 501)
        Renderer.drawRect(settings.colours.Background, mouseX + 4, mouseY - 4, w, h)
        Renderer.translate(0, 0, 502)
        Renderer.drawString(`${settings.colours.Text}${this.tooltip}`, mouseX + 6, mouseY - 2)
    }

    click(){
        if (!this.hovered) return

        this.state = !this.state
        new Thread(() => {
            for (let i = 0; i < 1; i+= 0.0075){
                this.pillx = this.state? 1 + (ease(i) * 7) : 8 - (ease(i) * 7) 
                Thread.sleep(0, 750)
            }
        }).start()
        settings[this.callback] = this.state
        settings.save()
    }
}


let settingsButtons = [
    new SettingsToggle("Animations", "animate", "Snazzy animations on opening / closing"),
    new SettingsToggle("Rainbow Border", "rainbowAccent", "RGB gaming outline!"),
    new SettingsToggle("Dark Mode", "darkMode", "Why would you turn this off? You monster!")
]

let tabs = [
    new GameTab("Wordle", "MinecraftWordle", "Farlow", [["wordle", "New Game"]]),
    new GameTab("Pong", "Pong", "Farlow", [["pong", "New Game"]]),
    new GameTab("Sudoku", "Sudoku", "Farlow", [["sudoku", "New Game"], ["sudoku load", "Load game from clipboard"]]),
    new GameTab("Minesweeper", "Narada", "Dalwyn", [["minesweeper", "New Game"]]),
    new GameTab("Snake", "Snake", "Debug", [["snake", "New Game"]]),
]

tabs[0].setDescription("6 attempts to correctly guess \nthe 5-letter word.\n\n&cOld module, 103% bad code.\n&cApologies that it's awful.\n\n&8(rewrite maybe?)")
tabs[1].setDescription("Move the paddle to prevent\nthe puck from touching\nthe left hand wall. \n\n&3Arrow keys to control.")
tabs[2].setDescription("Fill in the grid to win.\nNumbers 1 to 9 must be in\neach 3x3 cell.\nNumbers 1 to 9 must be in\neach row and column.\n\n&3Hover over slot and press\n&3key to enter number.")
tabs[3].setDescription("Win by flagging every bomb.\nNumber on tile shows number\nof bombs in the 3x3 area\nsurrounding.\n\n&3Left click - reveal tile\n&3Right click - flag tile\n\nreveal bomb = lose (L)")
tabs[4].setDescription("Everyone knows how to play...\n... right??\n\n&cPlaceholder - not started yet.\n&c(Debug we rely on you)")
let expandedTab

let gui = new Gui()

register("command", ()=> {gui.open()}).setName("games").setAliases(["minigames", "minigame", "game"])

register('step', i => {
   if (settings.rainbowAccent) {return settings.colours.Accent = Renderer.getRainbow(i)} else {settings.colours.Accent = Renderer.color(180, 60, 190)}
}).setFps(5)

function UpdateColours(){
    if (settings.darkMode){
        settings.colours = themes[1]
    } else {
        settings.colours = themes[0]
    }
}

let offsetX = 0
let offsetY = 0

gui.registerDraw((mouseX, mouseY) => {
    UpdateColours()

    Renderer.drawRect(Renderer.color(0, 0, 0, ui.backroundAlpha), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
    Renderer.drawRect(settings.colours.Accent, ui.x - 1.5, ui.y - 0.5, ui.width+3, 21)
    Renderer.drawRect(settings.colours.Accent, ui.x - 0.5, ui.y - 0.5, ui.width+1, ui.height+1)
    Renderer.drawRect(settings.colours.Background, ui.x, ui.y, ui.width, ui.height)
    Renderer.drawRect(settings.colours.Header, ui.x-1, ui.y, ui.width+2, 20)

    // Dont draw elements if open animation is playing
    if (ui.inAnimation) return

    Renderer.drawString(`${settings.colours.Text}Game Browser     &8v0.0.5`, ui.x + 3, ui.y + 6)

    tabs.forEach((tab, i) => {
        tab.x = ui.x + 3
        tab.y = ui.y + 23 + (32*i)
        tab.draw(mouseX, mouseY)
    })

    if (!expandedTab){

        Renderer.drawString(`${settings.colours.Text}A collection of minigames`, ui.x + tabs[0].width + 25, ui.y - 4 + (ui.height/2))
        Renderer.drawString("&7Click > to expand!", ui.x + tabs[0].width + 25, ui.y + 10 + (ui.height/2))

    }
    let settingshovered = false
    let settingsbounds = {
        "x": ui.x + ui.width - 14,
        "y": ui.y + 5,
        "width": 10,
        "height": 10
    }

    if (mouseX > settingsbounds.x && mouseX < settingsbounds.x + settingsbounds.y && !ui.settingsOpen){
        if (mouseY > settingsbounds.y && mouseY < settingsbounds.y + settingsbounds.height){
            settingshovered = true
        }
    }

    Renderer.drawString(`${settingshovered?settings.colours.Text+"&l":"&7&l"}⚙`, settingsbounds.x + 1, settingsbounds.y + 1)



    if (!ui.settingsOpen) return
    //settings screen x3

    //tint main window
    Renderer.drawRect(Renderer.color(15, 15, 15, 160), ui.x-1.5, ui.y-0.5, ui.width+3, 20.5)
    Renderer.drawRect(Renderer.color(15, 15, 15, 160), ui.x-0.5, ui.y+20, ui.width+1, ui.height-19.5)
    
    // Draw background
    
    Renderer.drawRect(settings.colours.Accent, ui.settingsWindow.x-0.5, ui.settingsWindow.y-0.5, ui.settingsWindow.width+1, ui.settingsWindow.height+1)

    Renderer.drawRect(settings.colours.Background, ui.settingsWindow.x, ui.settingsWindow.y, ui.settingsWindow.width, ui.settingsWindow.height)
    Renderer.drawRect(settings.colours.Header, ui.settingsWindow.x, ui.settingsWindow.y, ui.settingsWindow.width, 14)
    
    if (ui.settingsWindow.inAnimation) return


    if (ui.settingsWindow.dragging){
       
        ui.settingsWindow.x = mouseX - offsetX
        ui.settingsWindow.y = mouseY - offsetY
    }


    let xhovered = false
    let xbounds = {
        "x": ui.settingsWindow.x + ui.settingsWindow.width - 14,
        "y": ui.settingsWindow.y + 2,
        "width": 10,
        "height": 10
    }

    if (mouseX > xbounds.x && mouseX <xbounds.x + xbounds.width){
        if (mouseY > xbounds.y && mouseY < xbounds.y + xbounds.height){
            xhovered = true
        }
    }

    Renderer.drawString(`${settings.colours.Text}⚙  Settings`, ui.settingsWindow.x + 5, ui.settingsWindow.y + 3)
    Renderer.drawString(`${xhovered? "&4x": "&cx"}`, xbounds.x + 1, xbounds.y + 1)
    Renderer.drawString("&8Configure gui settings", ui.settingsWindow.x + 3, ui.settingsWindow.y + 17)

    settingsButtons.forEach((b, i) => {
        b.bounds.x = ui.settingsWindow.x + 3
        b.bounds.y = ui.settingsWindow.y + 30 + (i * (b.bounds.height + 2))
        b.draw(mouseX, mouseY)
    })
})



gui.registerClicked((mouseX, mouseY) => {
    tabs.forEach(v => {
        if (!ui.settingsOpen){
            v.click(mouseX, mouseY)
        }
    })

    let settingsbounds = {
        "x": ui.x + ui.width - 14,
        "y": ui.y + 5,
        "width": 10,
        "height": 10
    }

    if (mouseX > settingsbounds.x && mouseX < settingsbounds.x + settingsbounds.y){
        if (mouseY > settingsbounds.y && mouseY < settingsbounds.y + settingsbounds.height){
            ui.settingsOpen = true;


            // load settings for settings window
            settingsButtons.forEach((b, i) => {
                b.loadState()
            })

            if (settings.animate){
                 // Animate settings opening
                let pre = {
                    "width": ui.settingsWindow.width,
                    "height": ui.settingsWindow.height
                }
                ui.settingsWindow.inAnimation = true;

                new Thread(() => {
                    for (let i = 0; i < 1; i+= 0.0075){
                        ui.settingsWindow.width = pre.width * ease(i)
                        ui.settingsWindow.height = pre.height * ease(i)
                        ui.settingsWindow.x = (Renderer.screen.getWidth()/2) - (ui.settingsWindow.width / 2)
                        ui.settingsWindow.y = (Renderer.screen.getHeight()/2) - (ui.settingsWindow.height / 2)
                        Thread.sleep(0, 750)
                    }
            
                    ui.settingsWindow.width = pre.width
                    ui.settingsWindow.height = pre.height
                    ui.settingsWindow.x = (Renderer.screen.getWidth()/2) - (ui.settingsWindow.width / 2)
                    ui.settingsWindow.y = (Renderer.screen.getHeight()/2) - (ui.settingsWindow.height / 2)
                    ui.settingsWindow.inAnimation = false
                }).start()
            }
            ui.settingsWindow.x = (Renderer.screen.getWidth()/2) - (ui.settingsWindow.width / 2)
            ui.settingsWindow.y = (Renderer.screen.getHeight()/2) - (ui.settingsWindow.height / 2)
        }
    }

    if (!ui.settingsOpen) return;
    let xbounds = {
        "x": ui.settingsWindow.x + ui.settingsWindow.width - 14,
        "y": ui.settingsWindow.y + 2,
        "width": 10,
        "height": 10
    }
    let xhovered = false
    if (mouseX > xbounds.x && mouseX <xbounds.x + xbounds.width){
        if (mouseY > xbounds.y && mouseY < xbounds.y + xbounds.height){
            ui.settingsOpen = false;
            xhovered = true
        }
    }

    if (mouseX > ui.settingsWindow.x && mouseX < ui.settingsWindow.x + ui.settingsWindow.width && !xhovered && !ui.settingsWindow.inAnimation){
        if (mouseY > ui.settingsWindow.y && mouseY < ui.settingsWindow.y + 16){
            ui.settingsWindow.dragging = true
            
            offsetX = mouseX - ui.settingsWindow.x
            offsetY = mouseY - ui.settingsWindow.y
        }
    }

    settingsButtons.forEach((b, i) => {
        b.click()
    })
})

gui.registerMouseReleased(() => {
    ui.settingsWindow.dragging = false;
})



gui.registerClosed(()=>{
    ui.settingsOpen = false
})

gui.registerOpened(()=> {
    ui.x = (Renderer.screen.getWidth() / 2) - (ui.width / 2)
    ui.y = (Renderer.screen.getHeight() / 2) - (ui.height / 2)
    ui.backroundAlpha = 230

    if (!settings.animate) return
    ui.backroundAlpha = 0
    ui.inAnimation = true
    // save gui size
    let pre = {
        "width": ui.width,
        "height": ui.height
    }
    
    // animate opening
    new Thread(() => {
        for (let i = 0; i < 1; i += 0.0075){
            ui.backroundAlpha = 230 * ease(i)
            ui.width = pre.width * ease(i)
            ui.height = pre.height * ease(i)
            ui.x = (Renderer.screen.getWidth() / 2) - (ui.width / 2)
            ui.y = (Renderer.screen.getHeight() / 2) - (ui.height / 2)
            Thread.sleep(0, 750)
        }

        ui.width = pre.width
        ui.height = pre.height
        ui.x = (Renderer.screen.getWidth() / 2) - (ui.width / 2)
        ui.y = (Renderer.screen.getHeight() / 2) - (ui.height / 2)
        ui.inAnimation = false
    }).start()

    tabs.forEach(t => {
        t.installed = CheckExists(t.module)
    })
})

function close(){
    if (!settings.animate) return gui.close()

    ui.inAnimation = true
    // save gui size
    let pre = {
        "width": ui.width,
        "height": ui.height
    }
    
    // animate closing
    new Thread(() => {
        for (let i = 1; i > 0; i-= 0.05){
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
