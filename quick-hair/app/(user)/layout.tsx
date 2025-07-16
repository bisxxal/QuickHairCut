import Navbar from "@/components/navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

 
export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session =await getServerSession(authOptions)
  //   const role = session?.user.role;
  //   if (role !== "user") {
  //     redirect('/');
  //   }
  return (
    <main>
      <Navbar panel="user" />
      {children}
    </main>
  );
}
