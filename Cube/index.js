/// <reference types="../CTAutocomplete" />
const WIDTH = 250
const HEIGHT = 250

const SCALE = 45

let WindowX = (Renderer.screen.getWidth() / 2) - (WIDTH / 2) 
let WindowY = (Renderer.screen.getHeight() / 2) - (HEIGHT / 2)


const projection_matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
]


function matmult(matrix1, matrix2) {
  if (matrix1[0].length !== matrix2.length) {
    return ChatLib.chat("§c[ERROR] Matrices cannot be multiplied.")
  }
 
  let result = [];
  for (let i = 0; i < matrix1.length; i++) {
    result.push([]);
    for (let j = 0; j < matrix2[0].length; j++) {
      result[i].push(0);
    }
  }

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      for (let k = 0; k < matrix1[0].length; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }

  return result;
}


register("command", () => {
  window.open()
}).setName("c")

let window = new Gui()

let points = [
  [[-1], [-1], [1]],
  [[1], [-1], [1]],
  [[1],  [1], [1]],
  [[-1], [1], [1]],
  [[-1], [-1], [-1]],
  [[1], [-1], [-1]],
  [[1], [1], [-1]],
  [[-1], [1], [-1]]
]



const draw_pos = [(WIDTH / 2), (HEIGHT / 2)]

let anglex = 0
let angley = 0
let anglez = 0


let projected_points = []

let furthest_point

let lowestZ = 0
register("step", (c) => {
  let i = 0
  let f = 0
  let rotation_matrix_Z = [
    [Math.cos(anglez), -Math.sin(anglez), 0],
    [Math.sin(anglez), Math.cos(anglez), 0],
    [0, 0, 1],
  ]
  
  let rotation_matrix_Y = [
    [Math.cos(angley), 0, Math.sin(angley)],
    [0, 1, 0],
    [-Math.sin(angley), 0, Math.cos(angley)]
  ]
  
  let rotation_matrix_X = [
    [1, 0, 0],
    [0, Math.cos(anglex), -Math.sin(anglex)],
    [0, Math.sin(anglex), Math.cos(anglex)]
  ]

  lowestZ = 0

  points.forEach(point => {
    let rotated2d = matmult(rotation_matrix_Z, point)
    
    rotated2d = matmult(rotation_matrix_Y, rotated2d)
    
    rotated2d = matmult(rotation_matrix_X, rotated2d)

    
    let projected2d = matmult(projection_matrix, rotated2d)

    let x = ((projected2d[0, 0] * SCALE) + draw_pos[0])
    let y = ((projected2d[0, 1] * SCALE) + draw_pos[1])

    projected_points[i] = [x, y]

    if (rotated2d[2][0] <= lowestZ){
      
      furthest_point = [x, y]
      lowestZ = rotated2d[2][0]
    }
    i++
  });

  anglex += 0.012
  angley += 0.007
  anglez += 0.0175
}).setFps(30)

const LINE_WIDTH = 0.35
const LINE_COLOUR = Renderer.color(34, 230, 210)


function connect(i,j,points){
  let p = furthest_point
  if ((points[i][0] == p[0] && points[i][1] == p[1]) || (points[j][0] == p[0] && points[j][1] == p[1])) 
    return //Renderer.drawLine(Renderer.color(34, 230, 210, 30), WindowX + points[i][0], WindowY + points[i][1], WindowX + points[j][0], WindowY + points[j][1], LINE_WIDTH / 3, 1)
  

  Renderer.drawLine(LINE_COLOUR, WindowX + points[i][0], WindowY + points[i][1], WindowX + points[j][0], WindowY + points[j][1], LINE_WIDTH, 1)

}

window.registerDraw((mx, my, pt) => {
  Renderer.drawRect(Renderer.BLACK, WindowX, WindowY, WIDTH, HEIGHT)
  Renderer.drawString("30 FPS", WindowX + 2, WindowY + HEIGHT - 10)
  for (let p = 0; p < 4; p++){
    connect(p, (p+1) % 4, projected_points)
    connect(p+4, ((p+1) % 4) + 4, projected_points)
    connect(p, (p+4), projected_points)
  }
  
  //Renderer.drawString("f", WindowX + p[0], WindowY + p[1])

  
})
