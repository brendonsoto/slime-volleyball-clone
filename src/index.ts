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
const playerDeltaX = 2
const playerRadius: number = 40
const wallHeight: number = playerRadius * 4
const wallWidth: number = 20
const wallX: number = canvas.width / 2 - wallWidth / 2
const wallY: number = canvas.height - wallHeight
const wallLeftBoundary: number = wallX
const wallRightBoundary:  number = wallX + wallWidth
const playerOneRightBoundary: number = wallLeftBoundary - 2 * playerRadius
const playerTwoRightBoundary: number = canvas.width - 2 * playerRadius
let pOneRightPressed: boolean = false
let pTwoRightPressed: boolean = false
let pOneLeftPressed: boolean = false
let pTwoLeftPressed: boolean = false

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


// Helpers
const keyDownHandler = (e: KeyboardEvent): void => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    pTwoRightPressed = true
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    pTwoLeftPressed = true
  } else if (e.key === "d") {
    pOneRightPressed = true
  } else if (e.key === "a") {
    pOneLeftPressed = true
  }
}

const keyUpHandler = (e: KeyboardEvent): void => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    pTwoRightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    pTwoLeftPressed = false
  } else if (e.key === "d") {
    pOneRightPressed = false
  } else if (e.key === "a") {
    pOneLeftPressed = false
  }
}

const determineMovements = ():void => {
  // Player 1
  if (pOneLeftPressed) {
    const newPos = player1.x - playerDeltaX
    if (newPos > 0) {
      player1.x = newPos
    }
  } else if (pOneRightPressed) {
    const newPos = player1.x + playerDeltaX
    if (newPos < playerOneRightBoundary) {
      player1.x = newPos
    }
  }

  // Player 2
  if (pTwoLeftPressed) {
    const newPos = player2.x - playerDeltaX
    if (newPos > wallRightBoundary) {
      player2.x = newPos
    }
  } else if (pTwoRightPressed) {
    const newPos = player2.x + playerDeltaX
    if (newPos < playerTwoRightBoundary) {
      player2.x = newPos
    }
  }
}


// Drawing
const drawWall = () => {
  ctx.beginPath()
  ctx.rect(wallX, wallY, wallWidth, wallHeight)
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

  determineMovements()


  requestAnimationFrame(draw)
}


// Event listeners
document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)


draw()
