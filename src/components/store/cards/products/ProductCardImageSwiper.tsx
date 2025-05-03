import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

import { ProductVariantImage } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ProductCardImageSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);
  return (
    <div
      className="relative mb-2 h-[200px] bg-white contrast-[90%] rounded-2xl overflow-hidden"
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 1000 }}>
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <Image
              width={400}
              height={400}
              priority
              src={image.url}
              alt={image.alt}
              className="w-48 sm:w-52 h-full object-cover "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
