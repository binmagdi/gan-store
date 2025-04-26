import Logo from "@/components/shared/Logo";
import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import UserInfo from "./UserInfo";
import SidebarNavAdmin from "./NavAdmin";
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions,
} from "@/app/constants/data";
import { Store } from "@prisma/client";
import SidebarNavSeller from "./NavSeller";
import StoreSwitcher from "./store-switcher";

interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}
const Sidebar: FC<SidebarProps> = async ({ isAdmin , stores }) => {
  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen py-4 flex flex-col fixed top-1 left-0 bottom-0 items-center">
      <div className="border-b w-full pb-3 flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center gap-y-3">
          <Logo width="40%" height="70px" />
          <h1 className="font-semibold text-2xl">Gan Store</h1>
        </div>
      </div>
      {user && <UserInfo user={user} />}
      {!isAdmin && stores && <StoreSwitcher stores={stores} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
