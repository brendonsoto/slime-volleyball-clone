import io from "socket.io-client"


// Set up the socket connection
const socket = io("http://localhost:9000")


// Grab elements to use to send actions
const left = <HTMLElement> document.getElementById("left")
const right: HTMLElement = document.getElementById("right")
const jump: HTMLElement = document.getElementById("jump")


// Globals
let dataToSend = {}
let isMouseDown: boolean = false;

const triggerMouseDownLoop = () => {
  if (isMouseDown) {
    socket.emit("controller event", dataToSend)
    requestAnimationFrame(triggerMouseDownLoop)
  }
}

// Actions
const createButtonEvents = (elem, actionData) => {
  elem.addEventListener("mousedown", () => {
    isMouseDown = true
    dataToSend = actionData
    triggerMouseDownLoop()
  })
  elem.addEventListener("mouseup", () => {
    isMouseDown = false
  })
}

createButtonEvents(left, { move: "left" })
createButtonEvents(right, { move: "right" })

// Jump does not use the mouse down loop since you can't continually jump
jump.addEventListener("mousedown", () => {
  socket.emit("controller event", { move: "jump" })
})
