import { serviceOptions } from "@/lib/util";
import { PrismaClient, ServiceTypes } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {

    for (let i = 0; i < 32; i++) {

    //   const serviceStrings = serviceOptions[i]; // assumed to be string[]
    
    // const validServiceTypes = Object.values(ServiceTypes); // ["haircut", "shave", ...]
    
    // // Filter out invalid service types
    // const filteredServices = serviceStrings.filter((s): s is ServiceTypes =>
    //     validServiceTypes.includes(s as ServiceTypes)
    // );

    // // Pick one service at random, or skip if none valid
    // const selectedService = filteredServices.length > 0
    //     ? filteredServices[Math.floor(Math.random() * filteredServices.length)]
    //     : null;

    // if (!selectedService) continue;
 const start = new Date('2025-07-01').getTime();
    const end = new Date('2025-07-31T23:59:59').getTime();
    const randomTimestamp = new Date(start + Math.random() * (end - start));


        await prisma.trackService.create({
            data: {
                // service: selectedService,
             amount: Math.random() * 1000,
            completedAt: randomTimestamp,
                barberId: 'cmd09jtjr0001t0ttaq288y6i',
                userId: 'cmcz12nqo0003t0tslhvxigdm'
            }
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

