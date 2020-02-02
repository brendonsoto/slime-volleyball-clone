// INTERFACES
interface player {
  x: number
  y: number
  dy: number // delta y -- the change in y (velocity)
  isJumping: boolean
  color: string
}

interface ball {
  x: number
  y: number
  dx: number
  dy: number
}


// Canvas stuff
const canvas = <HTMLCanvasElement> document.getElementById("gameRoot")
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!


// GLOBALS
// Dimenstions and boundaries
// Why aren't player/ball dimensions part of the player object?
// Because they don't change

// Player movement and dimensions
const playerDeltaX = 2
const playerInitialDeltaY = -10
const playerRadius: number = 40

// Wall
const wallHeight: number = playerRadius * 4
const wallWidth: number = 20
const wallX: number = canvas.width / 2 - wallWidth / 2
const wallY: number = canvas.height - wallHeight
const wallLeftBoundary: number = wallX
const wallRightBoundary:  number = wallX + wallWidth

// Boundaries for players
const playerOneRightBoundary: number = wallLeftBoundary - 2 * playerRadius
const playerTwoRightBoundary: number = canvas.width - 2 * playerRadius
const playerOneStartingPoint: number = playerOneRightBoundary / 2
const playerTwoStartingPoint: number = (wallRightBoundary + playerTwoRightBoundary) / 2

// Ball positioning and dimensions
const ballStartingPointOne: number = playerOneStartingPoint + playerRadius
const ballStartingPointTwo: number = playerTwoStartingPoint + playerRadius
const ballRadius = playerRadius / 2

// Flags to indicate movement.
// Not attached to player objects to save having to traverse through an object
let pOneRightPressed: boolean = false
let pOneLeftPressed: boolean = false
let pOneIsJumping: boolean = false
let pTwoRightPressed: boolean = false
let pTwoLeftPressed: boolean = false
let pTwoUpPressed: boolean = false

// Player objects
let player1: player = {
  x: playerOneStartingPoint,
  y: canvas.height,
  dy: playerInitialDeltaY,
  isJumping: false,
  color: "green"
}
let player2: player = {
  x: playerTwoStartingPoint,
  y: canvas.height,
  dy: playerInitialDeltaY,
  isJumping: false,
  color: "red"
}
let ball: ball = {
  x: ballStartingPointOne,
  y: canvas.height / 2,
  dx: 2,
  dy: 0
}

// Physics vars
// kudos to http://physicscodes.com/bouncing-ball-simulation-in-javascript-on-html5-canvas/
const gravity: number = 0.1
const velocityReduction: number = 0.8
const jumpModifier: number = 0.5


// HELPERS
const keyDownHandler = (e: KeyboardEvent): void => {
  // Player 1 left/right controls
  if (e.key === "d") {
    pOneRightPressed = true
  } else if (e.key === "a") {
    pOneLeftPressed = true
  }

  // Player 2 left/right controls
  if (e.key === "Right" || e.key === "ArrowRight") {
    pTwoRightPressed = true
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    pTwoLeftPressed = true
  }

  // Jumping
  if (e.key === "w") {
    player1.isJumping = true
  }
  if (e.key === "Up" || e.key === "ArrowUp") {
    player2.isJumping = true
  }
}

const keyUpHandler = (e: KeyboardEvent): void => {
  // Player 1 left/right controls
  if (e.key === "d") {
    pOneRightPressed = false
  } else if (e.key === "a") {
    pOneLeftPressed = false
  }

  // Player 2 left/right controls
  if (e.key === "Right" || e.key === "ArrowRight") {
    pTwoRightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    pTwoLeftPressed = false
  }
}

const updateJumps = (player: player):void => {
  // Initially, dy is negative, so by decreasing y we're getting further awawy from the bottom of the canvas
  player.y += player.dy

  if (player.y === canvas.height) {
    player.y = canvas.height
    player.dy = playerInitialDeltaY
    player.isJumping = false
  } else {
    player.dy += jumpModifier
  }
}

const determinePlayerMovements = ():void => {
  // Player 1 -- left/right
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

  // Player 2 -- left/right
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

  // Jumping
  if (player1.isJumping) { updateJumps(player1) }
  if (player2.isJumping) { updateJumps(player2) }
}

const updateBall = ():void => {
  // Update velocity
  ball.dy += gravity

  // ball.x += ball.dx
  ball.y += ball.dy

  if (ball.y > canvas.height - ballRadius - playerRadius) {
    ball.y = canvas.height - ballRadius - playerRadius
    ball.dy *= -velocityReduction
  }
}


// DRAWING
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

const drawBall = (): void => {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI, true)
  ctx.fillStyle = "blue"
  ctx.fill()
  ctx.closePath()
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw
  drawWall()
  drawBall()
  drawPlayer(player1)
  drawPlayer(player2)

  // Update positioning
  updateBall()
  determinePlayerMovements()

  // Queue next frame
  requestAnimationFrame(draw)
}


// EVENT LISTENERS
document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)


// MAIN
draw()
