import { CartIcon } from "@/components/store/icons";
import Link from "next/link";

export default function Cart() {
  // Get a total items in cart
  const totalItems = 4; // Replace with actual logic to get total items in cart
  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart" className="flex items-center text-white ">
        <span className="text-[32px] inline-block">
          <CartIcon />
        </span>
        <div className="ml-1">
          <div className="min-h-3 min-w-6 -mt-1.5">
            <span className="inline-block text-xs text-main-primary leading-4 bg-white rounded-lg text-center font-bold min-h-3 px-1 min-w-6">{totalItems}</span>
          </div>
          <b className="text-xs font-bold text-wrap leading-4">Cart</b>
        </div>
      </Link>
    </div>
  );
}
