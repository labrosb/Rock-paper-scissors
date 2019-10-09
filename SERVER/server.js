'strict'
module.exports = gameServer = () => {

	const express = require('express');
	const app = express();
	const server = app.listen(8000);
	const socket = require('socket.io');
	const io = socket(server);

	app.use(express.static('public'));

	io.sockets.on('connection', newConnection);

	const connections = new Array();
	const associations = [];
	const availablePlayers = [];

	console.log('Server started..');

	function newConnection(socket) {

	  connections.push(socket);

	  socket.on('connect to player', function (data) {
		const user = pairToPlayer(this.id);
		if (user != false){
		  console.log('paired');
		  // Informs both users that the connection between them has been established
		  getSocketById(user).emit('paired', 'paired');
		  getSocketById(this.id).emit('paired', 'paired');
		}
	  });

	  socket.on('move', function (data) {
		console.log('received :' +data)
		// Forwards the game move from the one user to the other
		const playerSocket = getPairedSocket(this.id);
		if (playerSocket) {
		  playerSocket.emit('incoming move', data);
		}
	  });

	  socket.on('disconnect', function (data) {
		// If user disconnects and was on the waiting list, is removed from there
		deleteElement(availablePlayers, this.id);
		// If he had started a game, it the connected to him user is notified
		const playerSocket = getPairedSocket(this.id);
		if (playerSocket) {
		  playerSocket.emit('opponent disconnected', 'true');
		}
	  });

	}

	function pairToPlayer(id) {
	  if (availablePlayers.length == 0) {
		availablePlayers.push(id);
		return false;
	  }
	  else{
		const newPlayer = availablePlayers.shift();
		associations[id] = newPlayer;
		associations[newPlayer] = id;

		// notify the other player to start
		console.log (id+' : Paired with : '+ associations[id])

		return newPlayer;
	  }
	}

	function getSocketById(id){
	  return io.sockets.sockets[id];
	}

	function getPairedSocket(id) {
	  if (associations[id]) {
		return io.sockets.sockets[associations[id]];
	  }
	  else{
		return false;
	  }
	}

	function deleteElement(array, key) {
	  let element = array.indexOf(key);
	  if (element > -1) {
		  array.splice(element, 1);
	  }
	}

	///////////////////////////////////////////////////////////////////
	process.on('SIGINT', function() {
	  console.log("shutting down...");
	  killServer();
	  console.log("shut down!");
	  process.exit();
	});

	function killServer() {
	  for (let socket in connections) {
		delete connections;
	  }
	  // Close the server
	  server.close(function () { console.log('Server closed!'); });
	  // Destroy all open sockets
	  //server.destroy();

	}

}
