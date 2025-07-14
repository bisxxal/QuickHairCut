import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getServerSession } from "next-auth"
export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
   <div className=" flex flex-col px-20 items-center justify-center min-h-screen ">
    Quick - Hair 
    {!session && <Link href="/sign-in" className="bg-blue-500 p-4  hover:underline">
      Sign In
    </Link>}
    {
      session && <div>
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p className="text-gray-600">Your email: {session.user.email}</p>
        <p>
          {
            JSON.stringify(session)
          }
          <h1 className=" text-4xl font-bold">Role : {session?.user.role}</h1>
        </p>
        
        <Link href="/profile" className="text-blue-500 hover:underline">
          Go to Profile
        </Link>
      </div>
    }
   </div>
  );
}
