// components/Preview/sections/SkillsSection.jsx
import React from 'react';

const SkillBadge = ({ skill }) => (
  <span className="flex font-medium items-center justify-center bg-[#121212] border border-[#252525] px-8 h-10 min-w-[80px] rounded-full w-fit text-sm hover:bg-[#1a1a1a] transition-colors">
    {skill}
  </span>
);

export const SkillsSection = ({ 
  data, 
  className = "flex flex-col gap-6 my-8 items-start border-b pb-12 border-[#1e1e1e]"
}) => {
  if (!data?.skills || data.skills.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">Skills</h2>
      <div className="flex flex-wrap gap-3 w-full">
        {data.skills.map((skill, index) => (
          <SkillBadge key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
};