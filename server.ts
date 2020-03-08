const app = require("http").createServer(handler)
const io = require("socket.io")(app)
const fs = require("fs")

app.listen(9000)

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
let players = []

io.on("connection", (socket) => {
  // Using the referer to check what page the user is on
  // If on home page, create a room
  // Else assigning players only if they're on the controller page
  // Using the socket.id to identify players
  if (!socket.handshake.headers.referer.includes("controller")) {
    const id = Math.random().toString(36).substring(6)
    rooms[id] = { players: [] }
    socket.emit("room Id", id)
  } else if (socket.handshake.headers.referer.includes("controller")) {
    players = [...players, socket.id]
  }

  // Using `function` instead of arrow to referrence the socket object
  // Using indices of the players array to determine player 1, 2, etc.
  // Sending the player number to allow the client to handle how to react
  socket.on("controller event", function (data: object) {
    const playerNum = players.indexOf(this.id)
    socket.broadcast.emit("gameAction", { ...data, playerNum })
  })

  socket.on("disconnect", function () {
    const pageDisconnectingFrom = this.handshake.headers.referer
    const playerId = this.id
    if (pageDisconnectingFrom.includes("controller")) {
      players = players.filter(id => id !== playerId)
    }
  })
})
