import io from "socket.io-client"


// Set up the socket connection
const socket = io("http://192.168.1.225:9000/")


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
left.addEventListener("touchstart", e => {
  e.preventDefault()
  isMouseDown = true
  triggerMouseDownLoop({ move: "left" })()
})
left.addEventListener("touchend", e => {
  e.preventDefault()
  isMouseDown = false
  socket.emit("controller event", { move: "stop" })
})
right.addEventListener("touchstart", e => {
  e.preventDefault()
  isMouseDown = true
  triggerMouseDownLoop({ move: "right" })()
})
right.addEventListener("touchend", e => {
  e.preventDefault()
  isMouseDown = false
  socket.emit("controller event", { move: "stop" })
})

// Jump does not use the mouse down loop since you can't continually jump
jump.addEventListener("touchstart", e => {
  e.preventDefault()
  socket.emit("controller event", { move: "jump" })
})
