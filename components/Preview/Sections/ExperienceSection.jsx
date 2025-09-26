import React from "react";
import Image from "next/image";

const ExperienceItem = ({ experience }) => (
  <div className="gap-y-3 w-full">
    <div className="gap-2">
      <div className="bg-[var(--button)] border border-[var(--grey)] p-2 py-4 rounded-md flex flex-row items-center gap-4 w-full">
        <div className="w-[60px] h-10 min-w-[60px] rounded-full flex items-center justify-center">
          <Image
            src={experience.logo || "/logo.svg"}
            width={200}
            height={200}
            alt="logo"
            className="w-[50px] h-[60px] rounded-xl object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-base tracking-tight line-clamp-1 font-medium text-start transition-all leading-normal">
            {experience.company}
          </p>
          <p className="text-sm tracking-tight line-clamp-1 text-start transition-all leading-normal">
            {experience.title} - {experience.duration}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const ExperienceSection = ({
  data,
  isMobilePreview = false,
  className = "flex flex-col gap-6 items-start justify-center mb-5 pb-14 ",
}) => {
  if (!data || data.length === 0) return null;

  const gridClass = isMobilePreview
    ? "flex flex-col gap-3 w-full"
    : "grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-3 w-full";

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">Experience</h2>
      <div className={gridClass}>
        {data.map((exp, index) => (
          <ExperienceItem key={index} experience={exp} />
        ))}
      </div>
    </div>
  );
};
