var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	
server.listen(3000);

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});
app.get('/dashboard', function(req, res){
	res.sendfile(__dirname + '/dashboard.html');
});
/*
io.sockets.on('connection', function(socket){
	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
	});
});
*/

io.sockets.on('connection', function (socket) {

	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
	});

    socket.on('message', function (message) {
        console.log("Got message: " + message);
        message.ip = socket.handshake.address.address;
        message.connections= Object.keys(io.connected).length;
        message.timestamp = new Date();
        //io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': ip, 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
        io.sockets.emit('pageview',message);
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });

});