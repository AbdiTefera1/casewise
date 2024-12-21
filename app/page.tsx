// import Navbar from "@/components/navigation/Navbar";
// import SidebarContainer from '@/components/sidebar/SidebarContainer'

import Link from "next/link"

// import Sidebar from "@/components/layout/Sidebar"


export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col">
      <Link href="/login" className="bg-navy-700 text-white p-4 m-4 rounded-md font-bold">Login</Link>
      <div className="h-screen w-full flex items-center justify-center">
      <h1 className="text-5xl text-neutral-950 font-bold">Here is Hero section</h1>
      </div>

      {/* <SidebarContainer/> */}
      {/* <Sidebar/> */}
      <div className="h-screen w-full flex items-center justify-center bg-neutral-950">
      <h1 className="text-5xl text-neutral-50 font-bold">Here is About section</h1>
      </div>
      
    </div>
  );
}
