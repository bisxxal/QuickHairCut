import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {

    for (let i = 0; i < 31; i++) {
        const date = new Date('2025-07-01');
        date.setDate(date.getDate() + i);
        date.setHours(12, 0, 0, 0);

        await prisma.trackService.create({
            data: {
                amount: parseFloat((Math.random() * 1000).toFixed(2)),
                completedAt: date,
                barberId: 'cmd5y1wm9000jt0v5k42pfa0n',
                userId: 'cmd5wwidl000ft0v51etoxm0g',
            },
        });
    }
}

main()
.then(() => {
    return prisma.$disconnect();
})
.catch((e) => {
    console.error('Error while seeding:', e);
    return prisma.$disconnect();
});

