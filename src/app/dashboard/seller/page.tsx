import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SellerDashboardPage = async () => {
  //if the user is not logged in, redirect to home page
  const user = await currentUser();
  if (!user) {
    redirect("/");
    return;
  }
  // fetch the list of stores for the seller
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  // if the user has no stores, redirect to create store page
  if (stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
    return;
  }

  // if the user has stores, redirect to the first store's dashboard
  redirect(`/dashboard/seller/stores/${stores[0].url}`);

  return <div>SellerDashboardPage</div>;
};

export default SellerDashboardPage;
