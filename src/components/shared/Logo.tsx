import Image from "next/image";
import { FC } from "react";
import logoImg from "../../../public/assets/icons/logo.png";

interface LogoProps {
  width?: string;
  height?: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z[50]" style={{ width: width, height: height }}>
      <Image 
      priority
      src={logoImg}
        alt="Gan Store Logo"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
