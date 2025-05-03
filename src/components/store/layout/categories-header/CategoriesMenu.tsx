import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ChevronDown, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

export default function CategoriesMenu({
  categories,
  open,
  setOpen,
}: {
  categories: Category[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const toggleMenu = (state: boolean) => {
    setOpen(state);
    // Delay showing the dropdown 
    if (state) {
        setTimeout(() => {
            setDropdownVisible(true);
        }, 150); // Adjust the delay as needed
    }else{
        setDropdownVisible(false);
    }
  };

  return (
    <div
      className="relative w-10 h-10  xl:w-[256px] z-50"
      onMouseEnter={() => toggleMenu(true)}
      onMouseLeave={() => toggleMenu(false)}
    >
      {/* Trigger and Dropdown Container */}
      <div className="relative">
        {/* Trigger */}
        <div
          className={cn(
            "w-12 xl:w-[256px] h-12 scale-75 rounded-full xl:translate-y-0 xl:h-11 bg-[#535353] text-white text-[20px] relative flex items-center cursor-pointer transition-all duration-100 ease-in-out",
            {
              "w-[256px] bg-[#f5f5f5] text-black text-base rounded-t-[20px] rounded-b-none scale-100":
                open,
            }
          )}
        >
          {/* Menu icon */}
          <MenuIcon
            className={cn("absolute top-1/2 -translate-y-1/2 xl:ml-1 left-3", {
              "left-5": open,
            })}
          />
          <span
            className={cn("hidden xl:inline-flex xl:ml-11", {
              "inline-flex !ml-14": open,
            })}
          >
            All Categories
          </span>
          <ChevronDown
            className={cn("hidden xl:inline-flex scale-75 absolute right-3", {
              "inline-flex": open,
            })}
          />
        </div>
        {/* Dropdown Menu */}
        <ul
          className={cn(
            "absolute to-10 left-0 w-[256px] bg-[#f5f5f5] shadow-md transition-all duration-100 ease-in-out scrollbar overflow-y-auto flex flex-col-reverse",{
                "max-h-96 opacity-100":dropdownVisible,
                "max-h-0 opacity-0":!dropdownVisible
            }
          )}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/browse?category=${category.url}`}
              className="text-[#222]"
            >
              <li className="relative flex items-center m-0 p-3 pl-6 hover:bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="w-[24px] h-[24px]"
                />
                <span className="text-sm font-normal ml-2 overflow-hidden line-clamp-2 break-words text-main-primary">{category.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
