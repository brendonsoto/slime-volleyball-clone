const app = require("http").createServer(handler)
const io = require("socket.io")(app)
const fs = require("fs")

app.listen(8080)

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

io.on("connection", (socket: SocketIO.Server) => {
  socket.emit("news", { hello: "world" })
  socket.on("my other event", (data: string)=> {
    console.log(data)
  })
})
