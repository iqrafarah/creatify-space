import React from 'react';
  
const SkillBadge = ({ skill }) => (
  <span className="flex items-center justify-center bg-[var(--button)] border border-[var(--grey)] px-8 h-10 min-w-[80px] rounded-md w-fit text-sm font-medium">
    {skill}
  </span>
);

export const SkillsSection = ({ 
  data, 
  className = "flex flex-col gap-6 my-8 items-start pb-12 border-[var(--grey)]"
}) => {
  
  // Handle different possible data formats
  let skillsArray;
  
  if (Array.isArray(data)) {
    skillsArray = data;
  } else if (data?.skills && Array.isArray(data.skills)) {
    skillsArray = data.skills;
  } else {
    skillsArray = [];
  }
  
  if (skillsArray.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">Skills</h2>
      <div className="flex flex-wrap gap-3 w-full">
        {skillsArray.map((skill, index) => (
          <SkillBadge key={index} skill={typeof skill === 'string' ? skill : skill.name || ''} />
        ))}
      </div>
    </div>


  );
};