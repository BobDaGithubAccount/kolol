const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000
const fs = require('fs');

// const get_url = (url) => {
//   https.get(url, (resp) => {
//     let bundle = '';

//     resp.on('data', (chunk) => {
//       data += chunk;
//     });

//     resp.on('end', () => {
//       return bundle; //CANT EASILY DO THIS DUE TO ASYNC
//     });

//   }).on("error", (error) => {
//     return error;
//   });
// }

function makeid(length) { var result = ''; var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var charactersLength = characters.length; for (var i = 0; i < length; i++) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); } return result; }
function removeEndpoint(o, n) { let e = app._router.stack; e.forEach(function e(c, t, a) { switch (c.handle.name) { case o: case n: a.splice(t, 1) }c.route && c.route.stack.forEach(e) }) }
function logPacket(n, t, i, g) { fs.appendFile("log.txt", String(Date.now()) + " | " + String(n) + " | " + String(t) + " | " + String(i) + " | " + String(g) + "\n", function(n) { if (n) throw n }) }


function getURL(url, socket) {
  let parsed_url = String(url).replace("https://", "");
  parsed_url = parsed_url.replace("http://", "");
  https.get("https://" + parsed_url, (resp) => {

    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let reqID = makeid(64);
      sends2cPacket(socket, "sResponsecRequestURL_Packet", reqID);
      path = "/" + reqID;
      app.get(path, function run(req, res) {
        res.send(data);
        removeEndpoint(path, "run");
      });
    });

  }).on("error", (err) => {
    console.log(err);
  });
}

const appDir = "/home/runner/kolol/assets/";

fs.readdir(appDir, (o, a) => { if (o) throw o; a.forEach(o => { console.log(o); var a = "/assets/".concat(o), e = appDir.concat(o); app.get(a, (o, a) => { console.log("Served " + e), a.sendFile(e) }) }) });

app.get('/', (req, res) => {
  file = appDir.concat("index.html");
  res.sendFile(file);
  console.log(file);
});

function sends2cPacket(socket, packet, packet_data) {
  socket.emit('s2c', { "packet": packet, "packet_data": packet_data });
}

io.on('connection', (socket) => {

  socket.emit('sConnect_Packet', "N/A");
  
  let  id = "-";
  let ip = socket.handshake.address;
  console.log('A user with IP ' + socket.handshake.address + ' connected');
  
  socket.on('c2s', (msg) => {
    let packet = String(msg.packet);
    let packet_data = String(msg.packet_data);
    let clientID = String(msg.clientID);
    if (packet == "cSendClientID_Packet") {
      id = clientID;
      sends2cPacket(socket, "sServerAcceptedcSendClientID_Packet", clientID);
    }
    if (clientID != id) {
      console.log(id + " has attempted to spoof their clientID to " + clientID);
      logPacket("client_attempt_to_spoof_id", id, clientID, ip);
    }
    if (packet == "cRequestURL_Packet") {
      try {
        getURL(packet_data, socket);
      } catch (err) {
        console.log(err);
      }
    }
    console.log("---");
    console.log(packet);
    console.log(packet_data);
    console.log(clientID);
    console.log(ip);
    console.log("---");
    logPacket(packet, packet_data, clientID, ip);
  });

  socket.on('disconnect', (socket) => {
    console.log('A user with client ID ' + id + ' and ip of ' + ip + ' disconnected');
    logPacket("disconnect", id, ip);
  });
});

server.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});