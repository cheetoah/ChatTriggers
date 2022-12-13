/// <reference types="../CTAutocomplete" />
const WIDTH = 500
const HEIGHT = 500

let WindowX = (Renderer.screen.getWidth() / 2) - (WIDTH / 2)
let WindowY = (Renderer.screen.getHeight() / 2) - (HEIGHT / 2)

const SCALE = 80

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


const draw_pos = [(WIDTH / 2) + (SCALE / 4), (HEIGHT / 2) + (SCALE / 4)]

let anglex = 0
let angley = 0
let anglez = 0


let projected_points = []

register("step", () => {
  let i = 0

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

  points.forEach(point => {
    let rotated2d = matmult(rotation_matrix_Z, point)
    
    rotated2d = matmult(rotation_matrix_Y, rotated2d)
    
    rotated2d = matmult(rotation_matrix_X, rotated2d)

    let projected2d = matmult(projection_matrix, rotated2d)

    let x = Math.floor(((projected2d[0, 0] * SCALE) + draw_pos[0]) * 10) / 10
    let y = Math.floor(((projected2d[0, 1] * SCALE) + draw_pos[1])* 10) / 10

    projected_points[i] = [x, y]
    i++
  });

  anglex += 0.0025
  angley += 0.0015
  anglez += 0.002
}).setFps(75)

const LINE_WIDTH = 0.5
const LINE_COLOUR = Renderer.AQUA

function connect(i,j,points){
  Renderer.drawLine(LINE_COLOUR, WindowX + points[i][0], points[i][1], WindowX + points[j][0], points[j][1], LINE_WIDTH)
}

window.registerDraw((mx, my, pt) => {
  Renderer.drawRect(Renderer.BLACK, WindowX, WindowY, WIDTH, HEIGHT)

  for (let p = 0; p < 4; p++){
    connect(p, (p+1) % 4, projected_points)
    connect(p+4, ((p+1) % 4) + 4, projected_points)
    connect(p, (p+4), projected_points)
  }  
})
