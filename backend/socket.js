// socket.js
let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
                credentials: true
            }
        });
        io.on('connection', (socket) => {
            console.log('Client connected');
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};
