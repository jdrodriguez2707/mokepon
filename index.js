// IMPORT LIBRARIES

import express, { json, static as expressStatic } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// CREATE WEB SERVER

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// allow json format
app.use(json());

// serve static files so that any user can access files inside that folder (public).
app.use(expressStatic("public"));


// SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// PLAYER INFORMATION

const players = [];

class Player {
  constructor(id) {
    this.id = id;
  }

  assignMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  savePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  assignAttacks(attacks) {
    this.attacks = attacks;
  }
}

class Mokepon {
  constructor(name) {
    this.name = name;
  }
}

// ENDPOINTS

// Assign an id to each player that enters
app.get("/join", (req, res) => {
  const id = `${Math.random()}`;
  const player = new Player(id);
  players.push(player);

  res.send(id);
});

// Assign name of the chosen mokepon to the player
app.post("/mokepon/:playerId", (req, res) => {
  const playerId = req.params.playerId || "";
  const name = req.body.mokepon || "";
  const mokepon = new Mokepon(name);
  const playerIndex = players.findIndex((player) => playerId === player.id);

  if (playerIndex >= 0) {
    players[playerIndex].assignMokepon(mokepon);
  }

  res.end();
});

// Get coordinates (x, y) of the player's mokepon
app.post("/mokepon/:playerId/position", (req, res) => {
  const playerId = req.params.playerId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;
  const playerIndex = players.findIndex((player) => playerId === player.id);

  if (playerIndex >= 0) {
    players[playerIndex].savePosition(x, y);
  }

  const enemies = players.filter((player) => playerId !== player.id);

  res.send({ enemies });
});

// Get attacks of the player's mokepon
app.post("/mokepon/:playerId/attacks", (req, res) => {
  const playerId = req.params.playerId || "";
  const attacks = req.body.attacks || [];
  const playerIndex = players.findIndex((player) => playerId === player.id);

  if (playerIndex >= 0) {
    players[playerIndex].assignAttacks(attacks);
  }

  // console.log(playerId, attacks);

  res.end();
});

// Send attacks of the enemy's mokepon
app.get("/mokepon/:playerId/attacks", (req, res) => {
  const playerId = req.params.playerId || "";
  const player = players.find((player) => playerId === player.id);

  if (player) {
    res.send({ attacks: player.attacks || [] });
  }
});

// START SERVER

server.listen(port, () => {
  console.log(`Server Working!👌🏽 port: ${port}`);
});

// RESTART GAME

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id);

  socket.on("restart", () => {
    // Restart the list of players
    players.length = 0; 

    // Notify all clients that the game has been restarted
    io.emit("game_restarted"); 
  });

  socket.on("player_reloading", (data) => {
    const { playerId } = data;

    const playerIndex = players.findIndex((player) => playerId === player.id);
    if (playerIndex >= 0) {
      players.splice(playerIndex, 1);
    }

    socket.broadcast.emit("player_reloaded", { playerId });
  })
});



