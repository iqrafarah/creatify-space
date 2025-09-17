export function mapLinkedInTextToEntities(text) {
  const result = {
    profile: {
      available: false,
      name: "",
      headline: "",
      intro: "",
      about: "",
    },
    experiences: [],
    skills: [],
  };

  if (!text || typeof text !== "string") return result;

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Available for new opportunities
  result.profile.available = lines.some(line =>
    /available for new opportunities/i.test(line)
  );

  // Name and headline
  const hiIdx = lines.findIndex(line => /^hi there/i.test(line));
  if (hiIdx !== -1) {
    result.profile.name = lines[hiIdx].replace(/^hi there\.? (i[’']?m|my name is)\s*/i, "").replace(/\.$/, "");
    if (lines[hiIdx + 1]) result.profile.headline = lines[hiIdx + 1];
    if (lines[hiIdx + 2]) result.profile.intro = lines[hiIdx + 2];
  }

  // About me
  const aboutIdx = lines.findIndex(line => /^about me$/i.test(line));
  if (aboutIdx !== -1) {
    let aboutLines = [];
    for (let i = aboutIdx + 1; i < lines.length; i++) {
      if (/^experience$/i.test(lines[i]) || /^skills$/i.test(lines[i])) break;
      aboutLines.push(lines[i]);
    }
    result.profile.about = aboutLines.join(" ");
  }

  // Experience
  const expIdx = lines.findIndex(line => /^experience$/i.test(line));
  if (expIdx !== -1) {
    let i = expIdx + 1;
    while (i < lines.length && !/^skills$/i.test(lines[i])) {
      const company = lines[i];
      const titleMatch = lines[i + 1] && lines[i + 1].match(/^(.+) • (\d{4} - (?:\d{4}|present))/i);
      if (company && titleMatch) {
        result.experiences.push({
          company,
          title: titleMatch[1].trim(),
          duration: titleMatch[2].trim(),
        });
        i += 2;
      } else {
        i++;
      }
    }
  }

  // Skills
  const skillsIdx = lines.findIndex(line => /^skills$/i.test(line));
  if (skillsIdx !== -1) {
    let i = skillsIdx + 1;
    while (i < lines.length && lines[i] && !/^\w+$/i.test(lines[i])) {
      result.skills.push(...lines[i].split(/[•,]/).map(s => s.trim()).filter(Boolean));
      i++;
    }
    result.skills = [...new Set(result.skills)];
  }

  return result;
}