'use server'

import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
export const userJoinQueue = async (barberId: string) => {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return { status: 401, message: "Unauthorized" };
        }
        const queue = await prisma.queue.create({
            data: {
                barberId,
                userId: userId,
            },
            
        })
        if (!queue) {
            return { status: 404, message: "Failed to join queue" };
        }
        return { status: 200, message: "Joined queue successfully!" };
    } catch (error) {
        // console.error("Error joining queue:", error);
        return { status: 500, message: "Failed to join queue" };
    }
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; 
    lat1 === null ? lat1 = 20.7746033 : lat1;
    lon1 === null ? lon1 = 86.4603367 : lon1;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


export const getNearByShops = async (lat: number, long: number, km = 5) => {
    try {
        // if (!lat || !long) {
        //     return [];
        // }
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
                const distanceKm = haversineDistance(lat, long, shop.lat!, shop.long!);
                const rounded = parseFloat(distanceKm.toFixed(2));

                const distanceText =
                    distanceKm < 1
                        ? `${Math.round(distanceKm * 1000)} meters`
                        : `${rounded} km`;

                return {
                    ...shop,
                    distance: rounded,
                    distanceText,
                };
            })
            .filter((shop) => shop.distance <= km)
            .sort((a, b) => a.distance - b.distance);

        return nearbyShops;

    } catch (error) {   

        return [];
    }
};
