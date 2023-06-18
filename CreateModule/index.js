/// <reference types="../CTAutocomplete" />

import request from "../requestV2"

const JSLoader = com.chattriggers.ctjs.engine.langs.js.JSLoader;
const ModuleManager = com.chattriggers.ctjs.engine.module.ModuleManager;
const File = java.io.File;
const Files = java.nio.file.Files;
const FileUtils = org.apache.commons.io.FileUtils;
const Desktop = java.awt.Desktop
//             lhs = rhs
const regex = /(.+)=(.+)/;

const parseMetadata = (...args) => {
  const metadata = {};

  const parseString = (index, rhs, args) => {
    let string = rhs.slice(1);
    let j = index + 1;

    while (j < args.length) {
      string += " " + args[j];

      if (args[j].indexOf('"') !== -1) {
        string = string.slice(0, string.indexOf('"'));
        break;
      }
      j++;
    }
    return { string, j };
  };

  if (args == undefined) return metadata
  for (let i = 0; i < args.length; i++) {
    if (regex.test(args[i])) {
      let [, lhs, rhs] = args[i].match(regex);

      if (rhs.startsWith("[")) {
        const argsString = args.join(" ");
        const rest = argsString.slice(argsString.indexOf(rhs));

        rhs = JSON.parse(rest.slice(0, rest.indexOf("]") + 1));
      } else if (rhs.startsWith('"')) {
        const { string, j } = parseString(i, rhs, args);
        rhs = string;
        i = j;
      }
      metadata[lhs] = rhs;
    }
  }

  return metadata;
};


function CreateModule(moduleName, ...rest){
  if (!rest){rest = []}
  const destination = new File(`./config/ChatTriggers/modules/${moduleName}`);
  if (destination.exists()) {
    ChatLib.chat("&cModule already exists!");
    return;
  }

  const tempModuleLocation = "./config/ChatTriggers/modules/CreateModule/temp";

  FileUtils.copyDirectory(new File(tempModuleLocation), destination);

  const newMetadata = JSON.parse(FileLib.read(moduleName, "metadata.json"));
  newMetadata.name = moduleName;
  newMetadata.creator = ui.inputs.user;

  const parsedMetadata = parseMetadata(...rest);
  const finalMetadata = { ...newMetadata, ...parsedMetadata };

  FileLib.write(
    moduleName,
    "metadata.json",
    JSON.stringify(finalMetadata, null, 2)
  );

  if (finalMetadata.entry !== "index.js") {
    Files.move(
      new File(destination, "index.js").toPath(),
      new File(destination, finalMetadata.entry).toPath()
    );
  }
  ChatLib.chat(`&aSuccessfully created ${moduleName}!`);
  
  let location = `./config/ChatTriggers/modules/${moduleName}`
  
  try {
    Desktop.getDesktop().open(new File(location))
  } catch (exception) {
    print(exception)
    ChatLib.chat("&cCould not open file location")
  }

  setTimeout(()=>{gui.close()},150)
}


let ValidationPopup = false
let moduleUrl = `https://chattriggers.com/modules/v/pong`
let moduleOwner = {}
let moduleDownloads = 0

//https://chattriggers.com/api/modules/${moduleName}
function VerifyModule(moduleName){
  ChatLib.chat(`Verifying module &2${moduleName}`)
  request({
    url: `https://chattriggers.com/api/modules/${moduleName}`,

    headers: {
      'User-Agent': 'Mozilla/5.0'
    },
    body: {                // Represents JSON POST data. Automatically
        jsonKey: 'value'   // sets 'Content-Type' header to 
    },                     // 'application/json; charset=UTF-8'
                          // Body takes presedence over 'form'

  })
    .then(function(response) {
      let json = JSON.parse(response)
      moduleOwner = json.owner
     
      json.releases.forEach((r) => {
        moduleDownloads += r.downloads
      })

      moduleUrl = `https://chattriggers.com/modules/v/${moduleName}`
    
      ValidationPopup = true

      moduleButton.setPos({x: ui.x + (ui.width/2) - (moduleButton.width/2), y: ui.y + (ui.height / 2) + 55})
      verifyButton.setPos({x: ui.x, y:ui.y + (ui.height / 2) + 30})
      cancelButton.setPos({x: ui.x + ui.width - cancelButton.width, y:ui.y + (ui.height / 2) + 30})
    }).catch(e => {
      
      CreateModule(moduleName)
    });
}

// Soon:tm:
class MultilineInputBox{
  constructor(title){
    this.title = title
    this.x = 0 
    this.y = 0
    this.width = 120

    this.content = []

    this.index = 0
    this.lineindex = 0

    this.hovered = false
    this.selected = false
  }
}

class InputBox{
  constructor(title, pointer){
    this.title = title
    this.pointer = pointer
    this.x = 0
    this.y = 0
    this.width = 120

    this.content = ui.inputs[this.pointer].split("")

    this.index = 0

    this.hovered = false
    this.selected = false

    this.customIndex = false
  }

  draw(mouseX, mouseY){
    
    this.hovered = false

    if (mouseX > this.x && mouseX < this.x + this.width){
      if (mouseY > this.y && mouseY < this.y + 20){
        this.hovered = true
      }
    }

    if (this.selected){
      Renderer.drawRect(ui.colours.accent_input_selected, this.x-0.5, this.y+8.5, this.width+1, 13)
    } else {
      if (this.hovered){
        Renderer.drawRect(ui.colours.accent_input_hovered, this.x-0.5, this.y+8.5, this.width+1, 13)
      } else {
        Renderer.drawRect(ui.colours.accent_input, this.x-0.5, this.y+8.5, this.width+1, 13)
      }
    }

    Renderer.drawString(this.title, this.x + 3, this.y)
    Renderer.drawRect(ui.colours.input, this.x, this.y+9, this.width, 12)

    Renderer.drawString(this.content.join(""), this.x + 2, this.y + 11)
    this.selected? Renderer.drawRect(Renderer.color(255, 255, 255, 155), this.x + this.strLengh(this.index) + 1, this.y + 10, 0.5, 10) : NaN

    if (ValidationPopup) return this.selected = false;
    //Renderer.drawString(this.index, this.x, this.y + 20)
  }

  strLengh(index){
    return Renderer.getStringWidth(this.content.join("").substring(0, index))
  }

  setPos(pos){
    this.x = pos.x
    this.y = pos.y
  }

  click(){
    if (this.hovered){
      this.selected = true
      this.index = this.content.length
    } else {this.selected = false}
  }

  keyPress(char, keycode){
    if (!this.selected) return
    
    if (/[a-zA-Z0-9]/.test(char)){
        
          this.content.splice(this.index, 0, char)
          this.index++

    } else {
        switch(keycode){
            case 14:
                //backspace
                this.content.splice(this.index - 1, 1)
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

                if (this.index < this.content.length){
                    this.index++
                }
            break
        }
        
    }

    ui.inputs[this.pointer] = this.content.join('')
    if (ui.inputs[this.pointer] == ui.inputs.name){
      moduleExists = new File(`./config/ChatTriggers/modules/${ui.inputs.name}`).exists()
    }
    
    if (this.index == ui.inputs[this.pointer].length) {
        this.customIndex = false;
    }
    if (!this.customIndex) this.index = ui.inputs[this.pointer].length
  }
}

class Button{
  constructor(name, func){
    this.name = name;
    this.func = func

    this.x = 0
    this.y = 0

    this.width = Renderer.getStringWidth(name) + 10

    this.hovered = false
  }

  draw(mouseX, mouseY){
    this.hovered = false
    if (mouseX > this.x && mouseX < this.x + this.width){
      if (mouseY > this.y && mouseY < this.y + 15){
        this.hovered = true
      }
    }


    if (!moduleExists){
      this.width = Renderer.getStringWidth(this.name) + 10
      confirmButton.setPos({x: ui.x + (ui.width / 2) - (confirmButton.width/2), y:ui.y + ui.height - 22})
      Renderer.drawRect(this.hovered? ui.colours.accent_input_selected : ui.colours.accent_input, this.x - 0.5, this.y - 0.5, this.width + 1, 15)

      Renderer.drawRect(ui.colours.input, this.x, this.y, this.width, 14)

      Renderer.drawString(this.name, this.x + 5, this.y + 3, true)
    } else {

      let str = ui.inputs.name == ""? "&7Module name cannot be blank" : `&7Module with name "&c${ui.inputs.name}&7" already exists in dir "./config/ChatTriggers/Modules".`

      this.width = Renderer.getStringWidth("Module Error") + 10
      confirmButton.setPos({x: ui.x + (ui.width / 2) - (confirmButton.width/2), y:ui.y + ui.height - 22})
      Renderer.drawRect(ui.colours.accent_input_error, this.x - 0.5, this.y - 0.5, this.width + 1, 15)
      Renderer.drawRect(Renderer.color(10, 10, 10), this.x, this.y, this.width, 14)
      Renderer.drawString("&cModule Error", this.x + 5, this.y + 3, true)

      if (this.hovered){
  
        let w = Renderer.getStringWidth(ChatLib.removeFormatting(str)) + 4

        Renderer.drawRect(ui.colours.accent_input_error, mouseX + 3.5, mouseY - 4.5, w + 1, 11)
        Renderer.drawRect(ui.colours.input, mouseX + 4, mouseY - 4, w , 10)

        Renderer.drawString(str, mouseX + 6, mouseY - 3)
      }

    }
  }

  setPos(pos){
    this.x = pos.x
    this.y = pos.y
  }

  click(){
    if (!this.hovered) return
    this.func()
    
  }
}


let gui = new Gui()

let moduleExists = false

let ui = {
  "width": 150,
  "height": 100,
  "x": 100,
  "y": 100,
  "colours": {
    "background": Renderer.color(15, 15, 15),
    "input": Renderer.color(5, 5, 5),
    "accent_input": Renderer.color(25, 25, 25),
    "accent_input_selected": Renderer.color(140, 70, 140),
    "accent_input_hovered": Renderer.color(40, 40, 40),
    "accent_input_error": Renderer.color(250, 70, 70)
  },
  "inputs": {
    "name": "NewModule",
    "user": Player.getName()
  }
}

register("command", (moduleName) => {
  if (moduleName) {
    ui.inputs.name = moduleName
  }
  return gui.open()
  
}).setName("createmodule");

let inputbox = new InputBox("&7Module Name", "name")
inputbox.setPos({x: ui.x + 15, y: ui.y + 20})
let namebox = new InputBox("&7Creator", "user")
namebox.setPos({x: ui.x + 15, y: ui.y + 50})


let confirmButton = new Button("Confirm Creation", () => {
  if (moduleExists) return
  VerifyModule(ui.inputs.name)
})


let verifyButton = new Button("&aContinue Anyways", () => {
  CreateModule(ui.inputs.name)
})
let cancelButton = new Button("&cCancel", () => {
  ValidationPopup = false
})
let moduleButton = new Button("Copy module URL", () => {
  ChatLib.command(`ct copy ${moduleUrl}`, true)
  ChatLib.chat("Copied module url to clipboard.")
})

gui.registerDraw((mouseX, mouseY) => {
  Renderer.drawRect(ui.colours.background, ui.x, ui.y, ui.width, ui.height)
  Renderer.drawString("Create Module", ui.x + (ui.width / 2) - (Renderer.getStringWidth("Create Module") / 2), ui.y + 3, true)

  //Input Box
  inputbox.draw(mouseX, mouseY)
  namebox.draw(mouseX, mouseY)
  // Confirm Creation
  confirmButton.draw(mouseX, mouseY)

  
  if (!ValidationPopup) return
  Renderer.drawRect(Renderer.color(15, 15, 15, 200), ui.x, ui.y, ui.width, ui.height)
  let w = 200
  let h = 100

  Renderer.drawRect(ui.colours.accent_input_error, ui.x + (ui.width / 2) - (w / 2) - 0.5, ui.y + (ui.height / 2) - (h/2) - 0.5, w + 1, h + 1)
  Renderer.drawRect(ui.colours.accent_input, ui.x + (ui.width / 2) - (w / 2), ui.y + (ui.height / 2) - (h/2) , w, h)

  verifyButton.draw(mouseX, mouseY)
  cancelButton.draw(mouseX, mouseY)
  moduleButton.draw(mouseX, mouseY)

  Renderer.drawString("&cWARNING", ui.x + (ui.width/2) - (Renderer.getStringWidth("WARNING") / 2), ui.y + (ui.height / 2) - (h/2) + 15)
  let str = `Module page "&c${ui.inputs.name}&f" exists`
  let str2 = `Uploaded by &6${moduleOwner.name}&f.`
  let str3 = `&7${moduleDownloads} downloads.`
  Renderer.drawString(str, ui.x + (ui.width/2) - (Renderer.getStringWidth(ChatLib.removeFormatting(str)) / 2), ui.y + (ui.height / 2) - (h/2) + 35)
  Renderer.drawString(str2, ui.x + (ui.width/2) - (Renderer.getStringWidth(ChatLib.removeFormatting(str2)) / 2), ui.y + (ui.height / 2) - (h/2) + 45)
  Renderer.drawString(str3, ui.x + (ui.width/2) - (Renderer.getStringWidth(ChatLib.removeFormatting(str3)) / 2), ui.y + (ui.height / 2) - (h/2) + 55)

  let ownerx = ui.x + (ui.width/2) - (Renderer.getStringWidth(ChatLib.removeFormatting(str2)) / 2)
  let ownery = ui.y + (ui.height / 2) - (h/2) + 45
  let ownerw = Renderer.getStringWidth(ChatLib.removeFormatting(str2))

  if (mouseX > ownerx && mouseX < ownerx + ownerw){
    if (mouseY > ownery - 2 && mouseY < ownery + 12){
      let width = longestStrLength([`Rank: ${moduleOwner.rank}`, `ID: ${moduleOwner.ID}`, `${moduleOwner.name}`]) + 4
      Renderer.drawRect(ui.colours.accent_input_hovered, mouseX + 3.5, mouseY - 4.5, width+1, 33)
      Renderer.drawRect(ui.colours.background, mouseX + 4, mouseY - 4, width, 32)

      Renderer.drawString(`&6${moduleOwner.name}`, mouseX + 6, mouseY - 2)
      Renderer.drawString(`&7Rank: &3${moduleOwner.rank}`, mouseX + 6, mouseY + 10)
      Renderer.drawString(`&7ID: &8${moduleOwner.id}`, mouseX + 6, mouseY + 19)
    }
  }
  
})

const longestStrLength = (strings = [])=>{
  let longest = 0
  strings.forEach((s) => {
    if (Renderer.getStringWidth(s) > longest){
      longest = Renderer.getStringWidth(s)
    }
  })
  return longest
}

gui.registerKeyTyped((typed, key) => {inputbox.keyPress(typed, key);namebox.keyPress(typed, key)})

gui.registerClicked(() => {
  inputbox.click()
  confirmButton.click()
  namebox.click()

  if (!ValidationPopup) return
  
  verifyButton.click()
  cancelButton.click()
  moduleButton.click()
})

gui.registerOpened(() => {
  ui.inputs.name = "NewModule"
  ui.x = (Renderer.screen.getWidth() / 2) - (ui.width / 2)
  ui.y = (Renderer.screen.getHeight() / 2) - (ui.height / 2)

  inputbox.content = ui.inputs.name.split("")
  inputbox.setPos({x: ui.x + 15, y: ui.y + 20})
  namebox.setPos({x: ui.x + 15, y: ui.y + 50})

  ValidationPopup = false
  
  confirmButton.setPos({x: ui.x + (ui.width / 2) - (confirmButton.width/2), y:ui.y + ui.height - 22})
  moduleExists = new File(`./config/ChatTriggers/modules/${ui.inputs.name}`).exists()

  moduleButton.setPos({x: ui.x + (ui.width/2) - (moduleButton.width/2), y: ui.y + (ui.height / 2) + 55})
  verifyButton.setPos({x: ui.x, y:ui.y + (ui.height / 2) + 30})
  cancelButton.setPos({x: ui.x + ui.width - cancelButton.width, y:ui.y + (ui.height / 2) + 30})
})