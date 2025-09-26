import React from "react";
import Image from "next/image";

export const AboutSection = ({
  data,
  heroImage,
  className = "flex flex-col gap-2 my-3 items-start border-b pb-3 border-[#1e1e1e]",
}) => {
  if (!data?.about) return null;

  return (
    <div className="grid grid-cols-1 items-center gap-10 py-10 md:py-20">
      <div>
        <h2
          className="text-xl sm:text-2xl font-semibold"
        >
          About Me
        </h2>

        <p className="mt-4 text-[var(--lightgrey)] max-w-2xl leading-relaxed">
          {data.about}
        </p>
      </div>

      <div>
        <Image
           src={heroImage || "/logo.svg"}
          width={300}
          height={300}
          alt="logo"
          className="max-w-full max-h-[450px] w-full h-screen rounded-md border border-[var(--grey)] object-cover"
        />
      </div>
    </div>
  );
};
