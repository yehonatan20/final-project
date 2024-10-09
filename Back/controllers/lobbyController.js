const defaultRoom = 'lobby';
const rooms = { [defaultRoom]: {} }; // Track which rooms are exists

export default (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Automatically join the default room
        socket.join(defaultRoom);
        rooms[defaultRoom][socket.id] = 'Anonimos';

        socket.on('set username', (username) => {
            rooms[defaultRoom][socket.id] = username;
        })

        socket.on('join lobby', (room) => {
            socket.leave(room);
            rooms[defaultRoom][socket.id] = rooms[room][socket.id];
            delete rooms[room][socket.id];
            
            socket.join(defaultRoom);
            console.log(`${rooms[defaultRoom][socket.id]} joined room: ${defaultRoom}`);
        })

        socket.on('join room', (room) => {
            // Leave the current room
                // socket.to(rooms[socket.id]).emit('chat message', { user: 'Server', msg: `${username} has left the room!` });
            socket.leave(defaultRoom);
            
            // Join the new room
            if(!rooms[room])
                rooms[room] = {};
            rooms[room][socket.id] = rooms[defaultRoom][socket.id];
            delete rooms[defaultRoom][socket.id];
            // old
            socket.join(room);
            // rooms[socket.id] = room;
            console.log(`${rooms[room][socket.id]} joined room: ${room}`);

            // Role assignment logic
            // assignRole(socket, room);
        });

        // Handle incoming messages
        socket.on('chat message', ({ user, msg }) => {
            const currentRoom = findCurrentRoom(socket.id);

            // If the user is in a room, broadcast the message to that room
            if (currentRoom) {
                io.to(currentRoom).emit('chat message', { user, msg });
                console.log(`Message from ${user} in room ${currentRoom}: ${msg}`);
            } else {
                console.log('User is not in any room.');
            }
        });

        socket.on('disconnect', () => {
            const room = findCurrentRoom(socket.id);
            if (room) {
                console.log(`${rooms[room][socket.id]} disconnected`);
                delete rooms[room][socket.id]; // Clean up
            }
            // removePlayer(socket.id);
        });
    });
};

function findCurrentRoom(socketId) {
    // Find the current room the user is in
    for (let roomName in rooms) {
        if (rooms[roomName][socketId]) {
            return roomName;
        }
    }
}

// function assignRole(socket, room) {
//     if (room !== defaultRoom) {
//         if (!players['Player 1']) {
//             players['Player 1'] = socket.id;
//             socket.emit('role assigned', { role: 'Player 1' });
//         } else if (!players['Player 2']) {
//             players['Player 2'] = socket.id;
//             socket.emit('role assigned', { role: 'Player 2' });
//         } else {
//             socket.emit('role assigned', { role: 'Spectator' });
//         }
//     } else {
//         socket.emit('role assigned', { role: 'Participant' });
//     }
// }

// function removePlayer(socketId) {
//     for (const role in players) {
//         if (players[role] === socketId) {
//             delete players[role];
//             break;
//         }
//     }
// }