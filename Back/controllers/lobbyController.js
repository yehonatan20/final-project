const defaultRoom = 'lobby';
const rooms = {}; // Track which rooms are exists
const players = {}; // Track player roles

export default (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Automatically join the default room
        socket.join(defaultRoom);
        rooms[defaultRoom] = {};

        socket.on('set username', (username) => {
            players[socket.id] = username;
        })

        socket.on('join room', (room, username) => {
            // Leave the current room
            if (rooms[socket.id]) {
                socket.to(rooms[socket.id]).emit('chat message', { user: 'Server', msg: `${username} has left the room!` });
                socket.leave(rooms[socket.id]);
            }

            // Join the new room
            socket.join(room);
            rooms[socket.id] = room;
            console.log(`${socket.id} joined room: ${room}`);

            // Role assignment logic
            assignRole(socket, room);
        });

        // Handle incoming messages
        socket.on('chat message', ({ user, msg }) => {
            const room = rooms[socket.id];
            const role = Object.keys(players).find(key => players[key] === socket.id) || 'Participant';
            if (room) {
                io.to(room).emit('chat message', { user: `${user}`, msg });
            }
        });

        socket.on('disconnect', () => {
            const room = rooms[socket.id];
            if (room) {
                delete rooms[socket.id]; // Clean up
            }
            console.log('A user disconnected');
            removePlayer(socket.id);
        });
    });
};

function assignRole(socket, room) {
    if (room !== defaultRoom) {
        if (!players['Player 1']) {
            players['Player 1'] = socket.id;
            socket.emit('role assigned', { role: 'Player 1' });
        } else if (!players['Player 2']) {
            players['Player 2'] = socket.id;
            socket.emit('role assigned', { role: 'Player 2' });
        } else {
            socket.emit('role assigned', { role: 'Spectator' });
        }
    } else {
        socket.emit('role assigned', { role: 'Participant' });
    }
}

function removePlayer(socketId) {
    for (const role in players) {
        if (players[role] === socketId) {
            delete players[role];
            break;
        }
    }
}