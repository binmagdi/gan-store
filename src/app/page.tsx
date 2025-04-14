import ThemeToggle from "@/components/shared/ThemeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-5">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className="font-bold text-sky-400">Welcome to our Store</h1>
    </div>
  );
}
