import React from "react";
import Link from "next/link";


export const HeroSection = ({
  data,
  hireMe,
  isMobilePreview = false,
  className = "",
}) => {
  const layoutClass = isMobilePreview
    ? "flex-col items-center justify-center"
    : "flex-row items-center";

  const textAlignment = isMobilePreview
    ? "items-center text-center"
    : "items-start text-left";

  return (
    <div className="flex cursor-default flex-col gap-5 pt-[150px] lg:pt-[100px] items-start justify-center -mt-20">
      <div className="flex items-center gap-3">
        <span className="dot"></span>
        <span className="text-[var(--lightgrey)] text-sm">
          Available for new opportunities
        </span>
      </div>

      <div className="flex flex-col gap-2 text-xl font-medium tracking-tight md:text-3xl lg:text-3xl lg:leading-[1.1]">
        <h1 className="text-[var(--lightgrey)]">Hi there. I&rsquo;m {data.title}</h1>
        <h2>{data.position}</h2>
      </div>
      <p className="text-[var(--lightgrey)] text-base leading-relaxed max-w-2xl">
        {data.description}
      </p>
      <div className="flex gap-3">
        <Link href={`mailto:${hireMe}`}>
          <button className="bg-[var(--purple)] text-white font-medium h-4 py-4 text-[13px] px-4 rounded-full border border-[var(--purple)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
            Hire me
          </button>
        </Link>
      </div>
    </div>
  );
};
