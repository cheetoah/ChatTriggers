import Rectangle from "./rectangle"

export default class Button{
    constructor(text, x, y, width, height, radius, action, data){
        this.text = text;
        this.x = x;
        this.y = y;
        
        this.width = width;
        this.radius = radius
        this.height = height;
        this.action = action;

        if (data != "undefined"){
            this.data = data
        }

        this.hovered = false
        this.previousHovered = false

        this.buttonColour = Renderer.color(33, 33, 33)
        this.buttonHoverColour = Renderer.color(22, 22, 22)
    }



    draw(mouseX, mouseY){
        this.hover(mouseX, mouseY)
        let rect = new Rectangle(this.x, this.y, this.width, this.height, this.hovered? this.buttonHoverColour : this.buttonColour)
        rect.draw()

        Renderer.drawString(this.text, this.x + ((this.width - Renderer.getStringWidth(this.text)) / 2), this.y + ((this.height / 2) - 4))
    }
    
    click(mouseX, mouseY){
        if (this.hovered){
            this.action()
        }
    }

    fadeIn(){
        let ftr = register("step", (e) => {
            this.buttonHoverColour = Renderer.color(33 - e, 33 - e, 33 - e)
            if (e > 11) ftr.unregister()
        }).setFps(150)                                 
    }

    fadeOut(){
        let ftr = register("step", (e) => {
            this.buttonColour = Renderer.color(22 + e, 22 + e, 22 + e)
            if (e > 11) ftr.unregister()
        }).setFps(150)                                 
    }

    hover(mouseX, mouseY){
        if ((this.x < mouseX && (this.x + this.width) > mouseX) && (this.y < mouseY && (this.y + this.height) > mouseY)){
            if (!this.hovered) this.fadeIn()
            this.hovered = true
        } else {
            if (this.hovered) this.fadeOut()
            this.hovered = false
        }
    }
}
