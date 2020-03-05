import io from "socket.io-client"


// Set up the socket connection
const socket = io("http://localhost:9000")


// Grab elements to use to send actions
const left = <HTMLElement> document.getElementById("left")
const right: HTMLElement = document.getElementById("right")
const jump: HTMLElement = document.getElementById("jump")


// Globals
let isMouseDown: boolean = false;

const triggerMouseDownLoop = (data) => () => {
  if (isMouseDown) {
    socket.emit("controller event", data)
    requestAnimationFrame(triggerMouseDownLoop(data))
  }
}

// Actions
left.addEventListener("mousedown", () => {
  isMouseDown = true
  triggerMouseDownLoop({ move: "left" })()
})
left.addEventListener("mouseup", () => {
  isMouseDown = false
  socket.emit("controller event", { move: "stop" })
})
right.addEventListener("mousedown", () => {
  isMouseDown = true
  triggerMouseDownLoop({ move: "right" })()
})
right.addEventListener("mouseup", () => {
  isMouseDown = false
  socket.emit("controller event", { move: "stop" })
})

// Jump does not use the mouse down loop since you can't continually jump
jump.addEventListener("mousedown", () => {
  socket.emit("controller event", { move: "jump" })
})
