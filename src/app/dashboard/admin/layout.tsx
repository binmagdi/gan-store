import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Block non admin users from accessing this page
  const user = await currentUser();
  if (!user || user.privateMetadata?.role !== "ADMIN") redirect("/");
  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar isAdmin />
      <div className="ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
