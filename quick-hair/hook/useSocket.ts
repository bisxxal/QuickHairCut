import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useSocket = ( userId:string) => {
    const socketRef = useRef<Socket | null>(null);
    const [ready, setReady] = useState(false);
     const [onlineUser, setOnlineUser] = useState([])
    useEffect(() => {
         if (!userId) return; 
        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                query: { userId },
                transports: ['websocket'],
                withCredentials: true,
            });

            socketRef.current.on('connect', () => {
                setReady(true);
            });
            socketRef.current.on("getOnlineUsers", (users) => {
                setOnlineUser(users);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);
    return {
        socket: socketRef.current,onlineUser,
        ready,
    }
}