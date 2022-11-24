//chattriggers module (chattriggers.com) --docs on how to use it on their site

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

register("command", (...args) => {
    let qu = replaceAll(args.join(''), "x", "*")
    let answer
    try {
        answer = eval( replaceAll(replaceAll(args.join(''), "^", "**"), ")(", ")*("))
        ChatLib.chat(`§3[§9QuickMeth§3] §b` + answer)
        ChatLib.say("/ac :star: Solve " + replaceAll(qu, "*", "x") +" first for cool! :star:")
    } catch (e) {
        ChatLib.chat("§c" + e)
        return
    }
    let startTime = Date.now();
    let cr = register("chat", (chatter, msg) => {
        if (msg == answer){
            let name = derank(chatter)
            let time = Date.now() - startTime
            ChatLib.chat(`§3[§9QuickMeth§3] §b${name} §fwon in §a${Math.floor((time / 1000) * 100) / 100} §fseconds`)
            setTimeout(function(){ChatLib.say("/ac :yes: " + name + " answered correctly after " + Math.floor((time / 1000) * 100) / 100 + " seconds!")}, 250)
            cr.unregister()
        }
    }).setChatCriteria("&r${chatter}: ${msg}&r")
}).setName("meth")

register("command", (word) => {
    
    let shuffled = word.split('').sort(function(){return 0.5-Math.random()}).join('');
    ChatLib.chat(`§3[§9Unshuffle§3] §b` + word)
    ChatLib.say("/ac :star: Unscramble " + shuffled +" first for cool! :star:")
    let startTime = Date.now();
    let cr = register("chat", (chatter, msg) => {
        if (msg.toLowerCase() == word.toLowerCase()){
            let name = derank(chatter)
            let time = Date.now() - startTime
            ChatLib.chat(`§3[§9Scramble§3] §b${name} §fwon in §a${Math.floor((time / 1000) * 100) / 100} §fseconds`)
            setTimeout(function(){ChatLib.say("/ac :yes: " + name + " unscrambled the word " + word + " correctly after " + Math.floor((time / 1000) * 100) / 100 + " seconds!")}, 250)
            cr.unregister()
        }
    }).setChatCriteria("&r${chatter}: ${msg}&r")
}).setName("scramble")

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function derank(name){
    //thanks semisol
    return name.replace(/&./g, "").replace(/^\[[^\]]+\] /, "").replace(/ \[[^\]]+\]$/, "");
}
/*
register("chat", (question) => {
    let question = replaceAll(question, "x", "*")
    let answer = eval(question)
    ChatLib.chat("§3[§9Quick Math Solver§3] §b" + question + " = " + answer)
    ChatLib.chat("§7Sending in 10ms")
    setTimeout(function(){ChatLib.say("/ac " + answer)}, 10)
}).setChatCriteria("&r&d&lQUICK MATHS! &r&7Solve: &r&e${question}&r")
*/ //uncomment for auto admin quick maths solver

