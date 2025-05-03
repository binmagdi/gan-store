import Cart from "@/components/store/layout/header/Cart";
import Search from "@/components/store/layout/header/search/Search";
import UserMenu from "@/components/store/layout/header/user-menu/user-menu";
import { Country } from "@/lib/types";
import { cookies } from "next/headers";
import Link from "next/link";
import CountryLanguageCurrencySelector from "./country-lang-curr-selector";

const Header = () => {
  // get cookies from the store
  const cookiesStore = cookies();
  const userCountryCookie = cookiesStore.get("userCountry");

  // set default country if cookie is not set
  let userCountry: Country = {
    name: "Egypr",
    city: "",
    code: "EG",
    region: "",
  };

  // if cookie exist , update the userCountry
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }

  return (
      <div className="bg-gradient-to-r from-slate-500 to-slate-800">
        <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
          <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="font-extrabold text-xl">Gan Store</h1>
              </Link>
              <div className="flex lg:hidden">
                <UserMenu />
                <Cart />
              </div>
            </div>
            {/* Search input */}
            <Search />
          </div>
          <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
            <div className="lg:flex">{/* Dowbload App */}</div>
            <CountryLanguageCurrencySelector userCountry={userCountry} />
            <UserMenu />
            <Cart />
          </div>
        </div>
      </div>
  );
};

export default Header;
