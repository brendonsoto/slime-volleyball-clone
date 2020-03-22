const app = require("http").createServer(handler)
const io = require("socket.io")(app)
const fs = require("fs")

// INTERFACES
interface gameAction {
  roomId: string,
  move: string
}

app.listen(9000)

// HELPERS -- server related
function get404 (res) {
  res.writeHead(404)
  res.end("Error: Page not found")
}

function getHTML (res, file) {
  fs.readFile(`${__dirname}/build/${file}.html`, (err: Error, data: string) => {
    if (err) {
      res.writeHead(500)
      return res.end(`Error loading ${file}.html`)
    }

    res.writeHead(200)
    res.end(data)
  })
}

function handler (req, res) {
  switch (req.url) {
    case "/":
      getHTML(res, "index")
      break
    case "/controller":
      getHTML(res, "controller")
      break
    default:
      get404(res)
  }
}

let rooms = {}

// HELPERS -- Socket event related
const createRoom = (socket): void => {
  const id = socket.id.slice(0, 8)
  rooms[id] = { players: [] }
  socket.emit("room Id", id)
  socket.join(id)
}

const handleJoinRoom = (socket) => (id: string): void => {
  try {
    socket.join(id)
    rooms[id].players.push(socket.id)
    if (rooms[id].players.length === 1) {
      socket.emit("player assign", 1)
      socket.to(id).emit("player joined")
    }
    if (rooms[id].players.length === 2) {
      socket.emit("player assign", 2)
      socket.to(id).emit("player joined")
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Using indices of the players array to determine player 1, 2, etc.
 * Sending the player number to allow the client to handle how to react
 */
const handleControllerEvent = (socket) => (data: gameAction): void => {
  try {
    const { roomId } = data
    const playerNum = rooms[roomId].players.indexOf(socket.id)
    socket.to(roomId).emit("gameAction", { ...data, playerNum })
  } catch (e) {
    console.error(e)
  }
}

const handlePlayerDisconnect = (socket) => (roomId: string): void => {
  const playerId = socket.id
  try {
    rooms[roomId].players = rooms[roomId].players.filter(id => id !== playerId)
  } catch (e) {
    console.error(e)
  }
}

const handleDisconnect = (socket) => (): void => {
  const roomId = socket.id
  if (Object.keys(rooms).includes(roomId)) {
    delete rooms[roomId]
  }
}


// SOCKET CONNECTION
io.on("connection", (socket) => {
  // Using the referer to check what page the user is on
  // If on home page, create a room
  // Else assigning players only if they're on the controller page
  // Using the socket.id to identify players
  if (!socket.handshake.headers.referer.includes("controller")) {
    createRoom(socket)
  }

  socket.on("join room", handleJoinRoom(socket))
  socket.on("controller event", handleControllerEvent(socket))
  socket.on("player disconnect", handlePlayerDisconnect)
  socket.on("disconnect", handleDisconnect)
})
