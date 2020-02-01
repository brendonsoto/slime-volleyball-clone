// Interfaces
interface player {
  x: number
  y: number
  color: string
}

// Canvas stuff
const canvas = <HTMLCanvasElement> document.getElementById("gameRoot")
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!


// Globals
const playerRadius: number = 40
const wallHeight: number = playerRadius * 4
const wallWidth: number = 20

let player1: player = {
  x: 0,
  y: canvas.height,
  color: "green"
}
let player2: player = {
  x: canvas.width - playerRadius * 2,
  y: canvas.height,
  color: "red"
}


// Drawing
const drawWall = () => {
  ctx.beginPath()
  ctx.rect(
    canvas.width / 2 - wallWidth / 2,
    canvas.height - wallHeight,
    wallWidth,
    wallHeight
  )
  ctx.fillStyle = "black"
  ctx.fill()
  ctx.closePath()
}

const drawPlayer = (player: player) => {
  ctx.beginPath()
  ctx.arc(
    player.x + playerRadius,
    player.y,
    playerRadius,
    0,
    Math.PI,
    true
  )
  ctx.fillStyle = player.color
  ctx.fill()
  ctx.closePath()
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawWall()
  drawPlayer(player1)
  drawPlayer(player2)
  requestAnimationFrame(draw)
}

draw()
