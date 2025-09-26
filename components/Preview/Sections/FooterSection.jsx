import React from "react";
import Link from "next/link";
import Image from "next/image";

export const FooterSection = ({
  data,
  heroImage,
  className = "flex flex-col items-center justify-center gap-6 my-14 h-fit lg:max-h-[200px]",
}) => {
  if (!data) return null;

  const showContactButton = data.email && data.title && data.description;

  return (
    <div id="contact" className="py-10">
      <div className="bg-[var(--button)] rounded-xl border border-[var(--grey)] flex flex-col gap-y-5 py-6  justify-center items-center">
        <Image
          src={heroImage || "/logo.svg"}
          width={50}
          height={50}
          alt="logo"
          className="bg-white border border-[var(--grey)] rounded-full"
        />
        <h3 className="text-white text-2xl font-medium tracking-tight">
          {data.title}
        </h3>
        <p className="text-center text-lightgrey text-sm leading-relaxed max-w-2xl">
          {data.description}
        </p>
        <div className="flex gap-3">
          <Link href={`mailto:${data.contactUrl}`}>
          <button className="bg-[var(--purple)] text-white font-medium h-4 py-4 text-[13px] px-4 rounded-full border border-[var(--purple)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
           Contact Me
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
