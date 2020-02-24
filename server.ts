import express = require("express")
import http = require("http")
import socketio = require("socket.io")
import path = require("path")

const app = express()
const httpBase = http.createServer(app)
const io = socketio(httpBase)
const port = 9000


app.get("/", (_, res) => {
  // Send game
  res.sendFile(path.join(__dirname, "build/index.html"))

  console.log("creating controller route")
  // Create controller only when the root route is hit
  app.get("/controller", (_, res) => {
    // Send the markup
    res.sendFile(path.join(__dirname, "build/controller.html"))

    // Then make the websocket connection
    io.on("connection", () => {
      console.log("a user connected")
    })
  })
})

app.listen(port, () => {
  console.log(`server started at ${port}`)
})
