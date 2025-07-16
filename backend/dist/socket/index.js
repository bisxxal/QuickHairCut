import { Server } from "socket.io";
let io;
const userSocketMap = {}; // { userId: socketId }
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001', 'https://quickhaircut.vercel.app'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== 'undefined') {
            userSocketMap[userId] = socket.id;
        }
        else {
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
        socket.on('message_deleted', ({ queueId, barberId, userId }) => {
            io.emit('message_deleted', { queueId, barberId, userId });
        });
        socket.on('disconnect', () => {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
    return io;
};
export const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
};
