/// <reference types="../CTAutocomplete" />
import request from "requestV2";

const get = function(url) {
  return request({
      url: url,
      headers: {
          'User-Agent': 'Coins Per Bit ct.js',
          'X-Version': '0.0.1'
      },
      json: true
  });
}

let warning = false
let warningStr = ""

register("command", () => {
  gui.open()

  highlydata = []
  bestdata = []
  get("https://cpb.semisol.dev/api.json").then(response => {
    for (let i = 0; i < response["highlyProfitable"].length; i++){
      highlydata.push(new HighlyProfitableItem(response["highlyProfitable"][i]))
    }

    for (let i = 0; i < response["currentlyBest"].length; i++){
      bestdata.push(new CurrentBestItem(response["currentlyBest"][i]))
    }

    if (response['warning']){
      warning = true
      warningStr = response['warning'] == "BUG"? "WARNING: All data returned is inaccurate and not safe to use." : "WARNING: Currently Best information is outdated"
    }
    
  })
  
}).setName("cpb")


let highlydata = []

let bestdata = []

const gui = new Gui()

let width = 400
let height = 318

class HighlyProfitableItem{
  constructor(it){
    this.it = it
    this.expanded = false
    this.itemName = it['itemName']
    this.bits = it['bits']
    this.peakCpb = it['peakCpb']
    this.peakSales = it['peakSales']
    this.peakHr = it['peakHr']
    this.recommendedPrice = it['recommendedPrice']
    this.risk = it['risk']
    this.expiry = it['expiry']

    this.xupper = 1,
    this.yupper = 1,
    this.xlower = -1,
    this.ylower = -1

    this.hovered = false
    
  }

  toggleExpand(){
    this.expanded = !this.expanded
  }
}


class CurrentBestItem{
  constructor(it){
    this.it = it
    this.expanded = false

    this.itemName = it['itemName']
    this.bits = it['bits']
    this.cpb = it['cpb']
    this.sales24h = it['sales24h']
    this.lbin = it['lbin']

    this.xupper = 1,
    this.yupper = 1,
    this.xlower = -1,
    this.ylower = -1

    this.hovered = false
    
  }

  toggleExpand(){
    this.expanded = !this.expanded
  }
}


let tab = "HP"

let x 
let y
gui.registerDraw((mx, my, pt) => {

  Renderer.drawString("Using data from https://cpb.semisol.dev", 10, Renderer.screen.getHeight() - 19)

  x = (Renderer.screen.getWidth() / 2) - (width / 2) 
  y = (Renderer.screen.getHeight() / 2) - (height / 2) + 15

  //Renderer.drawRect(Renderer.color(15, 15, 15), x + (width / 2) - (Renderer.getStringWidth("Coins Per bit") / 2) - 2, y - 39,Renderer.getStringWidth("Coins Per bit") + 4, 12)
  //Renderer.drawString("Coins per Bit", x + (width / 2) - (Renderer.getStringWidth("Coins Per bit") / 2), y - 37)

  if (warning){
    Renderer.drawStringWithShadow(`§c${warningStr}`, x + 5, y - 26
  )
  }

  if (tab == "HP"){
    Renderer.drawRect(Renderer.color(15, 15, 15), x + 5, y - 14, width * 0.60, 14)
    Renderer.drawString("Highest Profit §7Best Profit but sells slowly", x + ((((width * 0.60) - 5) ) / 2) - (Renderer.getStringWidth("Highest Profit §7-Best LBIN and sell fast") / 2), y - 10)
    
    Renderer.drawRect(Renderer.color(5, 5, 5), x + 5 + (width * 0.60), y-12, ((width * 0.40) - 10), 12)
    Renderer.drawString("Currently Best", x + 5 + (width * 0.60) + (((width * 0.40) - 10) / 2) - (Renderer.getStringWidth("Currently Best") / 2), y - 10)
  } else {

    Renderer.drawRect(Renderer.color(5, 5, 5), x + 5, y - 12, width * 0.40, 12)
    Renderer.drawString("Highest Profit", x + ((((width * 0.40) - 5) ) / 2) - (Renderer.getStringWidth("Highest Profit") / 2), y - 10)
    
    Renderer.drawRect(Renderer.color(15, 15, 15), x + 5 + (width * 0.40), y-14, ((width * 0.60) - 10), 14)
    Renderer.drawString("Currently Best §7From LBIN and sells fast", x + 5 + (width * 0.40) + (((width * 0.60) - 10) / 2) - (Renderer.getStringWidth("Currently Best §7Determined from LBIN and sells fast") / 2), y - 10)
  }


  if (tab == "HP"){
    let frameheight = 6

    for (let i = 0; i < highlydata.length; i++){
      frameheight += 12
      if (highlydata[i].expanded){ frameheight += 66 }
    }

    Renderer.drawRect(Renderer.color(15, 15, 15), x, y, width, frameheight)

    let expandedHeight = 0
    let o = 0
    for (let i = 0; i < highlydata.length; i++){
      if (mx > highlydata[i].xlower && mx < highlydata[i].xupper && my < highlydata[i].yupper && my > highlydata[i].ylower){
        highlydata[i].hovered = true
      } else {
        highlydata[i].hovered = false
      }
      Renderer.drawRect(highlydata[i].hovered? Renderer.color(55, 55, 55) : Renderer.color(25, 25, 25), x + 3, y + 3 + o + expandedHeight, width - 6, 12)

      Renderer.drawString(`§l${highlydata[i].itemName} §6(${highlydata[i].peakCpb.toFixed(1)} CPB)`, x + 5, y + 5 + o + expandedHeight) // item name

      highlydata[i].xupper = x + width - 6
      highlydata[i].xlower = x + 3

      highlydata[i].yupper = y + 5 + o + expandedHeight + 12
      highlydata[i].ylower = y + 5 + o + expandedHeight

      let timeData = highlydata[i].peakHr
      let AmOrPm = timeData >= 12 ? 'pm' : 'am';
      timeData = (timeData % 12) || 12;
      
      if (highlydata[i].expanded){
        Renderer.drawRect(Renderer.color(35, 35, 35), x + 3, y + 15 + o + expandedHeight, width - 6, 65)
        Renderer.drawRect(Renderer.color(255, 255, 255), x + 3, y + 15 + o + expandedHeight, 1, 65)
        Renderer.drawString(`§7Bits: §f${highlydata[i].bits}`, x + 7, y + 17 + o + expandedHeight)
        Renderer.drawString(`§7Recommended Price: §f${formatCoins(highlydata[i].recommendedPrice)} coins`, x + 7, y + 26 + o + expandedHeight)
        Renderer.drawString(`§7Peak Hour: §f${timeData}${AmOrPm} UTC`, x + 7, y + 35+ o + expandedHeight)
        Renderer.drawString(`§7Peak Hour Sales: §f${highlydata[i].peakSales}`, x + 7, y + 44 + o + expandedHeight)
        Renderer.drawString(`§7Peak CPB: §f${highlydata[i].peakCpb.toFixed(2)}`, x + 7, y + 53 + o + expandedHeight)
        Renderer.drawString(`§7Risk: §f${highlydata[i].risk}%`, x + 7, y + 62 + o + expandedHeight)
        Renderer.drawString(`§7Recommended Expiry: §f${highlydata[i].expiry} hours`, x + 7, y + 71 + o + expandedHeight)
        expandedHeight += 66
      }
      o += 12
    }
  } else {


    let frameheight = 6

    for (let i = 0; i < bestdata.length; i++){
      frameheight += 12
      if (bestdata[i].expanded){ frameheight += 38 }
    }

    Renderer.drawRect(Renderer.color(15, 15, 15), x, y, width, frameheight)

    let expandedHeight = 0
    let o = 0
    for (let i = 0; i < bestdata.length; i++){
      if (mx > bestdata[i].xlower && mx < bestdata[i].xupper && my < bestdata[i].yupper && my > bestdata[i].ylower){
        bestdata[i].hovered = true
      } else {
        bestdata[i].hovered = false
      }
      Renderer.drawRect(bestdata[i].hovered? Renderer.color(55, 55, 55) : Renderer.color(25, 25, 25), x + 3, y + 3 + o + expandedHeight, width - 6, 12)

      Renderer.drawString(`§l${bestdata[i].itemName} §6(${bestdata[i].cpb.toFixed(1)} CPB)`, x + 5, y + 5 + o + expandedHeight) // item name

      bestdata[i].xupper = x + width - 6
      bestdata[i].xlower = x + 3

      bestdata[i].yupper = y + 5 + o + expandedHeight + 12
      bestdata[i].ylower = y + 5 + o + expandedHeight

      
      if (bestdata[i].expanded){
        Renderer.drawRect(Renderer.color(35, 35, 35), x + 3, y + 15 + o + expandedHeight, width - 6, 38)
        Renderer.drawRect(Renderer.color(255, 255, 255), x + 3, y + 15 + o + expandedHeight, 1, 38)
        Renderer.drawString(`§7Bits: §f${bestdata[i].bits}`, x + 7, y + 17 + o + expandedHeight)
        Renderer.drawString(`§7Coins Per Bit: §f${bestdata[i].cpb.toFixed(1)} coins`, x + 7, y + 26 + o + expandedHeight)
        Renderer.drawString(`§7Sales: §f${bestdata[i].sales24h} (In last 24 hours)`, x + 7, y + 35 + o + expandedHeight)
        Renderer.drawString(`§7Lowest BIN: §f${formatCoins(bestdata[i].lbin)} coins`, x + 7, y + 44 + o + expandedHeight)

        expandedHeight += 38
      }
      o += 12
    }
  }
})


function formatCoins(coins){
  if (coins > 1_000_000){
    return Math.floor(coins / 10000) / 100 + "M"
  } else if (coins > 1_000){
    return Math.floor(coins / 100) / 10 + "k"
  } else {
    return coins
  }
}


gui.registerClicked((mx, my) => {
  if (tab == "HP"){
    highlydata.forEach(item => {
      if (item.hovered){
        item.toggleExpand()
      }
    })

    if (mx > x + 5 + (width * 0.60) && mx < x + width - 10 ){
      if (my > y - 12 && my < y){
        tab = "CB"
      }
    }
  } else {
    bestdata.forEach(item => {
      if (item.hovered){
        item.toggleExpand()
      }
    })

    if (mx > x + 5 && mx < x + (width * 0.4)){
      if (my > y - 12 && my < y){
        tab = "HP"
      }
    }
  }
})



