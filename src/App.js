import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import { __dirname } from "./utils.js";
import viewsRouter from "./routes/viewsRouter.js";

//Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

const httpServer = app.listen(8080, () =>
  console.log("Escuchando en puerto 8080")
);

//Socket.io

const io = new Server(httpServer);

let messages = [];

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  socket.on("autenticado", () => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("autenticado", "nuevo usaurio conectado");
  });
});

//Handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Router

app.use("/", viewsRouter);
