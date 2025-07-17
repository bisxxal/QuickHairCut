'use server';
import prisma from "@/lib/prisma";
export const createBarber = async (data: FormData) => {
    try {
        const email = data.get('email') as string;
        const role = data.get('role') as string;
        if (!email) {
            return { status: 204, message: "Failed to create Barber" };
        }
        const user = await prisma.user.update({
            where: { email: email },
            data: { role }
        });
        if (role !== 'BARBER') {
            return { status: 200, message: "Role updated successfully" };
        }
        const barber = await prisma.barber.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
            },
            update: {},
        })

        if (!barber) {
            return { status: 400, message: "Failed to create Barber" };
        }
        return { status: 200, message: "Barber created successfully", role };
    } catch (error) {
        return { status: 500, message: "Internal Server Error" };
    }
}
