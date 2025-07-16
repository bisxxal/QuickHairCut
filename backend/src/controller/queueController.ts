import { Request, Response } from "express";
import prisma from "../db/prismaClient.js";
import { haversineDistance } from "../utils/index.js";
import { getIO } from "../socket/index.js";

export const viewQueue = async (req: Request, res: Response) => {
    const { lat, long } = req.query;
    const km = 5;
    if (!lat || !long) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    try {
        const allShops = await prisma.barber.findMany({
            where: {
                AND: [
                    { lat: { not: null } },
                    { long: { not: null } },
                ],
            },
            select: {
                id: true,
                name: true,
                location: true,
                gmapLink: true,
                shopName: true,
                lat: true,
                long: true,
                phoneNumber: true,
                Queue: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
            },
        });
        const nearbyShops = allShops
            .map((shop) => {
                const distanceKm = haversineDistance(Number(lat), Number(long), shop.lat!, shop.long!);
                const rounded = parseFloat(distanceKm.toFixed(2));
                const distanceText = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} meters` : `${rounded} km`;
                return {
                    ...shop,
                    distance: rounded,
                    distanceText,
                };
            })
            .filter((shop) => shop.distance <= km)
            .sort((a, b) => a.distance - b.distance);
        return res.status(201).json(nearbyShops);

    } catch (error) {
        console.error("Error fetching nearby shops:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const userJoinQueue = async (req: Request, res: Response) => {
    try {
        const { barberId, userId } = req.body;
        if (!barberId || !userId) {
            return res.status(400).json({ error: "Barber ID and User ID are required" });
        }
        const queue = await prisma.queue.create({
            data: {
                barberId,
                userId: userId,
            }
        })
        if (!queue) {
            return res.status(400).json({ status: 404, message: "Failed to join queue" });
        }
        const io = getIO();
        io.emit('queueUpdate', { barberId, userId , queueId: queue.id });
        return res.status(200).json({ status: 200, message: "Joined queue successfully!" });
    } catch (error) {
        return res.status(400).json({ status: 500, message: "Failed to join queue" });
    }
}
