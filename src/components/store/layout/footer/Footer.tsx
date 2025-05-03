
import { getSubcategories } from "@/queries/subCategory";
import Contact from "./Contact";
import Links from "./Links";
import NewsLetter from "./NewsLetter";

export default async function Footer() {
    const subs = await getSubcategories(7, true);
  return (
    <div className="w-full bg-white">
      <NewsLetter />
      <div className="px-4 lg:px-12">
        <div className="grid md:grid-cols-2 md:gap-x-6 ">
        <Contact />
        <Links subs={subs} />
        </div>
      </div>

      {/* Rights */}
    </div>
  );
}
