import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // fetch the current user if the user is not authenticated in redirect to the home page
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "SELLER") redirect("/");

  // retrieve the list of stores for the current user
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores} />
      <div className="w-full ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
