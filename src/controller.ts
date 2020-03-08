import io from "socket.io-client"


// Set up the socket connection
const socket = io("http://192.168.1.225:9000/")


// Grab elements to use to send actions
const formContainer = <HTMLElement> document.getElementById("form-container")
const form = <HTMLFormElement> document.getElementById("code-form")
const left = <HTMLElement> document.getElementById("left")
const right = <HTMLElement> document.getElementById("right")
const jump = <HTMLElement> document.getElementById("jump")


// Globals
let isMouseDown: boolean = false
let roomId: string = null

const triggerMouseDownLoop = (data) => () => {
  if (isMouseDown) {
    socket.emit("controller event", data)
    requestAnimationFrame(triggerMouseDownLoop(data))
  }
}
const createSocketData = data => Object.assign({}, data, { roomId })

// Form
form.addEventListener("submit", e => {
  e.preventDefault()
  const roomIdElem = <HTMLInputElement> document.getElementById("roomId")
  const id = roomIdElem.value
  roomId = id
  socket.emit("join room", id)
  formContainer.remove()
})

// Socket
socket.on("player assign", num => {
  const color: string = num === 1 ?  "green" : "red"
  Array.prototype.forEach.call(
    document.getElementsByClassName("btn"),
    elem => { elem.style.backgroundColor = color }
  )
})

// Actions
left.addEventListener("touchstart", e => {
  e.preventDefault()
  isMouseDown = true
  triggerMouseDownLoop(createSocketData({ move: "left" }))()
})
left.addEventListener("touchend", e => {
  e.preventDefault()
  isMouseDown = false
  socket.emit("controller event", createSocketData({ move: "stop" }))
})
right.addEventListener("touchstart", e => {
  e.preventDefault()
  isMouseDown = true
  triggerMouseDownLoop(createSocketData({ move: "right" }))()
})
right.addEventListener("touchend", e => {
  e.preventDefault()
  isMouseDown = false
  socket.emit("controller event", createSocketData({ move: "stop" }))
})

// Jump does not use the mouse down loop since you can't continually jump
jump.addEventListener("touchstart", e => {
  e.preventDefault()
  socket.emit("controller event", createSocketData({ move: "jump" }))
})

window.addEventListener("unload", () => {
  socket.emit("player disconnect", roomId)
})
