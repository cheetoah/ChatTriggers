/// <reference types="../CTAutocomplete" />

import PogObject from "../PogData"



let settings = new PogObject("IRCCopy", {
  "enabled": true,
  "colours": true
})

settings.autosave();

register("chat", (event) => {
  if (!settings.enabled || ChatLib.getChatMessage(event) == " ") return

  let chunks = ChatLib.getChatMessage(event, true).replaceAll("&r", "").split("&")
  let word = []

  chunks.forEach((ch,i) => {
    word.push("&" + ch.split(" ").join(` &${ch[0]}`))
  })

  let msg = word.join("").substring(1)

  let chat = new Message(EventLib.getMessage(event))
  chat.addTextComponent(new TextComponent(` &2&l[COPY]`).setClick("run_command", `/copyToClipboard ${msg}`))

  cancel(event)

  ChatLib.chat(chat)

})


register("command", (...args) => {
  ChatLib.command(settings.colours? "ct copy " + args.join(" ").replaceAll("§", "&") : "ct copy " + args.join(" ").removeFormatting(), true)
  ChatLib.chat(new TextComponent("&8[&9IRC&8] &2Copied to clipboard!").setHoverValue(settings.colours? args.join(" ").replaceAll("§", "&") : args.join(" ").removeFormatting()))
}).setName("copyToClipboard")


register("command", (arg) => {
  switch (arg){
    case "toggle":
      settings.enabled = !settings.enabled
      ChatLib.chat(`\n&8[&9IRC&8] ${settings.enabled? "&aEnabled" : "&cDisabled"} &2click to copy!\n`)
      break
    case "colours":
      settings.colours = !settings.colours
      ChatLib.chat(`\n&8[&9IRC&8] ${settings.colours? "&aEnabled" : "&cDisabled"} &2colour codes!\n`)
      break
    case "settings":
      ChatLib.chat(`\n&8[&9IRC&8] &2Settings: \n&2> Module: ${settings.enabled? "&aEnabled" : "&cDisabled"}\n&2> Colours: ${settings.colours? "&aEnabled" : "&cDisabled"}\n&2> Safe Mode: ${settings.safemode? "&aEnabled" : "&cDisabled"}\n`)
      break
    default:
      ChatLib.chat("\n&cUnknown argument.")  
      ChatLib.chat("&8[&9IRC&8] &2Commands: \n&2> /irccopy toggle &7toggles module\n&2> /irccopy colours &7toggles copying colour codes\n&2> /irccopy settings &7lists these commands\n")
  }
}).setName("irccopy").setTabCompletions(["toggle", "colours", "safemode", "settings"])

