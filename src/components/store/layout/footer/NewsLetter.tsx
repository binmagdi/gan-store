import { SendIcon } from "../../icons";

export default function NewsLetter() {
  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-800 p-5">
      <div className=" px-4 lg:px-12 ">
        <div className="flex flex-col gap-y-4 xl:flex-row items-center text-white ">
          {/* left */}
          <div className="flex items-center xl:w-[58%]">
            <h5 className="flex items-center gap-x-2">
              <div className="scale-125 mr-2">
                <SendIcon />
              </div>
              <span className="capitalize md:text-xl ">
                sign up to news letter
              </span>
              <span className="ml-10">
                ...and receve &nbsp;
                <b>10$ coupon for first shopping</b>
              </span>
            </h5>
          </div>
          {/* right */}
          <div className="flex w-full xl:flex-1">
            <input
              type="text"
              placeholder="Enter Your Email Address"
              className=" w-full h-10 pl-6 bg-white rounded-l-full outline-none text-black"
            />
            <span className="h-10 w-24 text-sm grid place-content-center rounded-r-full bg-slate-600 text-white cursor-pointer">Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
