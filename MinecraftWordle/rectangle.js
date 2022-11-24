export default class Rectangle{
    constructor(x, y, width, height, colour){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour
        this.radius = 3
    }

    draw(mouseX, mouseY){
        this.drawCircle(this.x + this.radius, this.y + this.radius, this.radius, this.colour)
        this.drawCircle(this.x + this.width - this.radius, this.y + this.radius, this.radius, this.colour)
        this.drawCircle(this.x + this.radius, this.y + this.height - this.radius, this.radius, this.colour)
        this.drawCircle(this.x + this.width - this.radius, this.y + this.height - this.radius, this.radius, this.colour)

        this.drawRect(this.x + this.radius, this.y, this.width - this.radius * 2, this.height, this.colour)
        this.drawRect(this.x, this.y + this.radius, this.width, this.height - this.radius * 2, this.colour)
    }

    drawCircle(x, y, radius, colour){
        Renderer.drawCircle(colour, x, y, radius, 360)
    }

    drawRect(x, y, width, height, colour){
        Renderer.drawRect(colour, x, y, width, height)
    }

}