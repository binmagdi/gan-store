import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import DataTable from "@/components/ui/data-table";
import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";

const SellerStoreShippingPage = async ({
  params,
}: {
  params: { storeUrl: string };
}) => {
  const shippingDetails = await getStoreDefaultShippingDetails(params.storeUrl);
  const shippingRates = await getStoreShippingRates(params.storeUrl);
  if (!shippingDetails) return redirect("/");

  return (
    <div>
      <StoreDefaultShippingDetails
        data={shippingDetails}
        storeUrl={params.storeUrl}
      />
      <DataTable
        filterValue="countryName"
        data={shippingRates}
        searchPlaceholder="Search by country name..."
        columns={columns}
      />
    </div>
  );
};

export default SellerStoreShippingPage;
