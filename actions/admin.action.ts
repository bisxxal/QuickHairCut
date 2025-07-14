'use server';

import prisma from "@/lib/prisma";


export const createBarber = async (data: FormData) => {
    try {
        const email = data.get('email') as string;
        const role = data.get('role') as string  ;
        if (!email) {
           return {status:204 , message:"Failed to create Barber"};
        }
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'BARBER' }
        });
        const barber = await prisma.barber.create({
            data:{
                userId:user.id,      
            }
        })
     
        if(!barber ) {
           return {status:400 , message:"Failed to create Barber"};
        }

        return {status:200 , message:"Barber created successfully", role};
    } catch (error) {
         return {status:500 , message:"Internal Server Error"};
    }
}

export const getUser = async ()=>{
    try {

        
    } catch (error) {
    }
}