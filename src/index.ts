import io from "socket.io-client"


// INTERFACES
interface player {
  x: number
  y: number
  dy: number // delta y -- the change in y (velocity)
  isJumping: boolean
  color: string
  score : number
}

interface ball {
  x: number
  y: number
  dx: number
  dy: number
}

interface gameAction {
  move: string,
  playerNum: number
}


// Canvas + DOM getting stuff
const canvas = <HTMLCanvasElement> document.getElementById("gameRoot")
const idContainer = <HTMLElement> document.getElementById("join-code")
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!


// GLOBALS
// Dimenstions and boundaries
// Why aren't player/ball dimensions part of the player object?
// Because they don't change
const scoreToWin: number = 3

// Player movement and dimensions
const playerDeltaX: number = 6
const playerInitialDeltaY: number = -4
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
// const ballStartingPointTwo: number = playerTwoStartingPoint + playerRadius
const ballRadius = playerRadius / 2

// Flags to indicate movement.
// Not attached to player objects to save having to traverse through an object
let pOneRightPressed: boolean = false
let pOneLeftPressed: boolean = false
let pTwoRightPressed: boolean = false
let pTwoLeftPressed: boolean = false

// Player objects
let player1: player = {
  x: playerOneStartingPoint,
  y: canvas.height,
  dy: playerInitialDeltaY,
  isJumping: false,
  color: "#98971a",
  score: 0
}
let player2: player = {
  x: playerTwoStartingPoint,
  y: canvas.height,
  dy: playerInitialDeltaY,
  isJumping: false,
  color: "#cc241d",
  score: 0
}
let ball: ball = {
  x: ballStartingPointOne,
  y: canvas.height / 2,
  dx: 0,
  dy: 0
}

// Physics vars
// kudos to http://physicscodes.com/bouncing-ball-simulation-in-javascript-on-html5-canvas/
const gravity: number = 0.1
// const velocityReduction: number = 0.8
// const collisionRadius: number = playerRadius + ballRadius


// HELPERS
const handleGameAction = (data: gameAction) => {
  const { move, playerNum } = data;

  if (move === "left") {
    if (playerNum === 0) { pOneLeftPressed = true }
    if (playerNum === 1) { pTwoLeftPressed = true }
  }

  if (move === "right") {
    if (playerNum === 0) { pOneRightPressed = true }
    if (playerNum === 1) { pTwoRightPressed = true }
  }

  if (move === "jump") {
    if (playerNum === 0) { player1.isJumping = true }
    if (playerNum === 1) { player2.isJumping = true }
  }

  if (move === "stop") {
    if (playerNum === 0) {
      pOneLeftPressed = false
      pOneRightPressed = false
    }
    if (playerNum === 1) {
      pTwoLeftPressed = false
      pTwoRightPressed = false
    }
  }
}

const handleRecievedRoomId = id => {
  idContainer.innerText = `Join the game by visiting ${location.href}/controller.html and enter this code: ${id}`
}

// const keyDownHandler = (e: KeyboardEvent): void => {
//   // Player 1 left/right controls
//   if (e.key === "d") {
//     pOneRightPressed = true
//   } else if (e.key === "a") {
//     pOneLeftPressed = true
//   }
//
//   // Player 2 left/right controls
//   if (e.key === "Right" || e.key === "ArrowRight") {
//     pTwoRightPressed = true
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     pTwoLeftPressed = true
//   }
//
//   // Jumping
//   if (e.key === "w") {
//     player1.isJumping = true
//   }
//   if (e.key === "Up" || e.key === "ArrowUp") {
//     player2.isJumping = true
//   }
// }

// const keyUpHandler = (e: KeyboardEvent): void => {
//   // Player 1 left/right controls
//   if (e.key === "d") {
//     pOneRightPressed = false
//   } else if (e.key === "a") {
//     pOneLeftPressed = false
//   }
//
//   // Player 2 left/right controls
//   if (e.key === "Right" || e.key === "ArrowRight") {
//     pTwoRightPressed = false
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     pTwoLeftPressed = false
//   }
// }

const updateJumps = (player: player):void => {
  // Initially, dy is negative, so by decreasing y we're getting further awawy from the bottom of the canvas
  player.y += player.dy

  if (player.y >= canvas.height) {
    player.y = canvas.height
    player.dy = playerInitialDeltaY
    player.isJumping = false
  } else {
    player.dy += gravity
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

// NOTE Resets positions and increments scores
const resetPositions = (): void => {
  if (ball.x < wallLeftBoundary) {
    ball.x = playerOneStartingPoint + playerRadius
    player2.score += 1
  } else {
    ball.x = playerTwoStartingPoint + playerRadius
    player1.score += 1
  }
  player1.x = playerOneStartingPoint
  player1.y = canvas.height
  player2.x = playerTwoStartingPoint
  player2.y = canvas.height
  ball.dy = 0
  ball.y = canvas.height / 2
  ball.dy = 0
  ball.dx = 0
}

const updateBall = ():void => {
  // Update velocity
  ball.dy += gravity

  ball.x += ball.dx
  ball.y += ball.dy

  if (ball.y > canvas.height - ballRadius) {
    resetPositions()
  }

  // Check if the ball is hitting the left or right walls and invert direction if so
  if (
    ball.x - ballRadius <= 0 ||
    ball.x + ballRadius >= canvas.width
  ) {
    ball.dx *= -1
  }

  // Check if the ball is hitting the wall and invert direction if so
  if (
    ball.x + ballRadius >= wallLeftBoundary &&
    ball.x - ballRadius <= wallRightBoundary &&
    ball.y >= wallY
  ) {
    // Check if the ball hits the top of the wall and reverse vertical direction
    if (ball.y === wallY || ball.y < wallY + 5) {
      ball.dy *= -1
    } else {
      // If it does not, then reverse horizontal direction
      ball.dx *= -1
    }
  }
}

// Super basic collision detection
const checkContact = (player: player):void => {
  const dx = (player.x + playerRadius) - (ball.x)
  const dy = (player.y) - (ball.y)
  const radii = playerRadius + ballRadius
  const hypotenuse = dx * dx + dy * dy

  // Read that not using Math.sqrt was preferrable, hence this
  if (hypotenuse < radii * radii) {
    // Contact is made, but now to determine velocity
    // To be perfectly honest, my trig skills currently suck so a lot of this was guess and check
    // I tried to get a doc product using the difference between the two circles as vectors
    const vx = ball.x - (player.x + playerRadius)
    const vy = (ball.y + ballRadius) - player.y
    const vHypo = vx * vx + vy + vy
    const cos = vx / vHypo
    const dotProduct = Math.abs(vx) * Math.abs(vy) * cos
    // The magic numbers here (10 & 8) are just guess and check
    ball.dy = dx === 0 ? -10 : -1 * (8 % dotProduct)
    ball.dx = dx === 0 ? 0 : -1 * (dx / playerRadius) * 8
  }
}

const collisionDetection = ():void => {
  if (ball.x < wallLeftBoundary) {
    checkContact(player1)
  } else if (ball.x > wallRightBoundary) {
    checkContact(player2)
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

const drawScore = (): void => {
  ctx.font = "48px Helvetica, sans-serif"
  ctx.fillText(player1.score.toString(), 20, 60)
  ctx.fillText(player2.score.toString(), canvas.width - 50, 60)
}

const drawBall = (): void => {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI, true)
  ctx.fillStyle = "#458588"
  ctx.fill()
  ctx.closePath()
}

const drawGameOver = (): void => {
  const winner = player1.score > player2.score
    ? "Player 1"
    : "Player 2"
  ctx.font = "48px Helvetica, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(
    `${winner} wins!!`,
    canvas.width / 2,
    canvas.height / 2 + 24
  )
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (player1.score === scoreToWin || player2.score === scoreToWin) {
    drawGameOver()
    return
  }

  // Draw
  drawWall()
  drawBall()
  drawPlayer(player1)
  drawPlayer(player2)
  drawScore()

  // Update positioning
  updateBall()
  determinePlayerMovements()
  collisionDetection()

  // Queue next frame
  requestAnimationFrame(draw)
}


// EVENT LISTENERS
// document.addEventListener("keydown", keyDownHandler)
// document.addEventListener("keyup", keyUpHandler)


// SOCKETS
const socket = io("http://localhost:9000")
socket.on("gameAction", handleGameAction)
socket.on("room Id", handleRecievedRoomId)


// MAIN
draw()
