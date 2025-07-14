'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ServiceTypes } from "@prisma/client";
import { getServerSession } from "next-auth";

export const updateBarber = async (data: FormData, lat: number, long: number) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized" };
        }
        const userId = session.user.id;
        const name = data.get('name') as string;
        const shopName = data.get('shopName') as string;
        const location = data.get('location') as string;
        const gmapLink = data.get('link') as string;
        const phoneNumber = data.get('phoneNumber') as string;

        if (!name || !shopName || isNaN(lat) || isNaN(long)) {
            return { status: 204, message: "Failed to update Profile. All fields are required." };
        }

        const barber = await prisma.barber.update({
            where: { userId: userId ? userId : 'cmcz12nqo0003t0tslhvxigdm' },
            data: {
                name, shopName, lat, long, location, gmapLink, phoneNumber
            }
        })

        if (!barber) {
            return { status: 400, message: "Failed to update Profile" };
        }
        return { status: 200, message: "Profile updated successfully" };
    } catch (error) {
        // console.log("Error in updateBarber:", error);
        return { status: 500, message: "Internal Server Error" };
    }
}

export const getBarber = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized" };
        }
        const userId = session.user.id;

        const barber = await prisma.barber.findUnique({
            where: { userId },

            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!barber) {
            return { status: 404, message: "Barber not found" };
        }

        return JSON.parse(JSON.stringify(barber));
    } catch (error) {
        // console.log("Error in getBarber:", error);
        return { status: 500, message: "Internal Server Error" };
    }
}

export const getBarberQueue = async (p: number) => {
    try {

        const limit = 3; // Default limit
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized", data: [] };
        }
        const userId = session.user.id;
         const barberId = await prisma.barber.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!barberId) {
            return { status: 404, message: "Barber not found", data: [] };
        }

        const [barber, count] = await prisma.$transaction([
            prisma.queue.findMany({
            where: { barberId: barberId?.id },
                take: limit,
                skip: limit * (p - 1),
                select: {
                    barberId: true,
                    id: true,
                    enteredAt: true,
                    userId: true,
                    user: {
                        select: {
                            name: true,
                            phoneNumber: true,
                        }
                    }
                }
            }),
            prisma.queue.count({
                where: { barberId: barberId?.id },
            })
        ]) 
        if (!barber) {
            return { status: 404, message: "Barber not found", data: [] };
        }

        return JSON.parse(JSON.stringify({ data: barber ,count }));
    } catch (error) {
        // console.log("Error in getBarberQueue:", error);
        return { status: 500, message: "Internal Server Error", data: [] };
    }
}

export const deleteQueueItem = async (id: string) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized" };
        }
        const queueItem = await prisma.queue.delete({
            where: {
                id: id
            }
        });
        if (!queueItem) {
            return { status: 404, message: "Queue item not found" };
        }
        return { status: 200, message: "Queue item deleted successfully" };
    } catch (error) {
        // console.log("Error in deleteQueueItem:", error);
        return { status: 500, message: "Internal Server Error" };
    }
}
export const completeQueueItem = async (queueId: string, userId: string, barberId: string, data: FormData) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized" };
        }
        const serviceStrings = data.getAll('service') as string[];
        const amount = data.get('amount') as string;

        const validServiceTypes = Object.values(ServiceTypes); // ["haircut", "shave", ...]
        const service = serviceStrings.filter((s): s is ServiceTypes =>
            validServiceTypes.includes(s as ServiceTypes)
        );

        const queueItem = await prisma.trackService.create({
            data: {
                service,
                amount: parseInt(amount, 10),
                completedAt: new Date(),
                barberId,
                userId
            }
        });

        await deleteQueueItem(queueId)

        if (!queueItem) {
            return { status: 404, message: "Queue item not found" };
        }
        return { status: 200, message: "Queue item updated successfully" };
    } catch (error) {
        // console.log("Error in updateQueueItem:", error);
        return { status: 500, message: "Internal Server Error" };
    }
}

export const getBarberTrack = async (p: number) => {
    try {
        const limit = 3;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized", data: [] };
        }
        const userId = session.user.id;
        const barberId = await prisma.barber.findUnique({
            where: { userId },
            select: { id: true },
        });

        const [barber, count] = await prisma.$transaction([
            prisma.barber.findMany({
                where: { userId },
                select: {
                    trackService: {
                        take: limit,
                        skip: limit * (p - 1),
                        select: {
                            id: true,
                            service: true,
                            amount: true,
                            completedAt: true,
                            user: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                },
            }),
            prisma.trackService.count({
                where: { barberId: barberId?.id },
            })
        ])
        // console.log(barber, count);
        if (!barber) {
            return { status: 404, message: "Barber not found", data: [] };
        }

        return JSON.parse(JSON.stringify({ data: barber[0].trackService, count }));
    } catch (error) {
        // console.log("Error in getBarberTrack:", error);
        return { status: 500, message: "Internal Server Error", data: [] };
    }
}
export const getBarberTransactions = async (startDate:Date, endDate:Date) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { status: 401, message: "Unauthorized", data: [] };
        }
        const userId = session.user.id;
        const barber = await prisma.barber.findMany({
                where: { userId ,
                    trackService: {
                        some: {
                            completedAt: {
                                gte: startDate,
                                lte: endDate
                            }
                        }
                    }
                 },
                select: {
                    trackService: { 
                        select: {
                            completedAt:true,
                            amount: true,
                            user:{
                                select: {
                                    name: true,
                                }
                            }
                        },
                        
                    }
                },
            }) 
        if (!barber) {
            return { status: 404, message: "Barber not found", data: [] };
        }

        return JSON.parse(JSON.stringify({ data: barber[0].trackService }));
    } catch (error) {
        // console.log("Error in getBarberTrack:", error);
        return { status: 500, message: "Internal Server Error", data: [] };
    }
}