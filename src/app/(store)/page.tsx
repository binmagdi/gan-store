import ThemeToggle from "@/components/shared/ThemeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-5">
      <div className="flex justify-end gap-3">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="font-bold text-sky-400">Welcome to Gan Store</h1>
    </div>
  );
}
