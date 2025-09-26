export function mapLinkedInTextToEntities(text) {
  // Default result structure
  const result = {
    profile: {
      available: false,
      name: "",
      headline: "",
      about: "",
    },
    experiences: [],
    skills: [],
  };

  // Return empty result if no text
  if (!text || typeof text !== "string") return result;

  // Split text into lines and clean up whitespace
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  console.log("Processing lines:", lines); // Debug log

  // Find section indexes for summary, experience, skills, etc.
  const sectionIndexes = {
    skills: lines.findIndex(line => /^belangrijkste vaardigheden$/i.test(line)),
    summary: lines.findIndex(line => /^samenvatting$/i.test(line)),
    experience: lines.findIndex(line => /^ervaring$/i.test(line)),
    education: lines.findIndex(line => /^opleiding$/i.test(line))
  };

  // Check if user is available for new opportunities (Dutch/English)
  result.profile.available = text.includes("I'm currently open to new opportunities") || 
                            /open to new opportunities|available for new|beschikbaar voor nieuwe/i.test(text);

  // Try to find the user's name (First Last pattern)
  const nameIdx = lines.findIndex(line => 
    line.length > 3 && 
    line.length < 50 && 
    /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line) && // Looks like a name
    !line.includes('@') && 
    !line.includes('www')
  );
  
  if (nameIdx !== -1) {
    result.profile.name = lines[nameIdx];
    
    // Headline is usually the next line after the name
    if (nameIdx + 1 < lines.length) {
      const nextLine = lines[nameIdx + 1];
      if (nextLine && 
          !nextLine.includes('@') &&
          !nextLine.includes('www') &&
          !/^(contactgegevens|belangrijkste|samenvatting|ervaring)$/i.test(nextLine)) {
        result.profile.headline = nextLine;
      }
    }
  }

  // Extract summary/about section (Dutch: "Samenvatting")
  if (sectionIndexes.summary !== -1) {
    const startIdx = sectionIndexes.summary + 1;
    const endIdx = sectionIndexes.experience !== -1 ? sectionIndexes.experience : lines.length;
    const aboutLines = lines.slice(startIdx, endIdx);
    result.profile.about = aboutLines.join(" ").trim();
  }

  // Extract experience section (Dutch: "Ervaring")
  if (sectionIndexes.experience !== -1) {
    const startIdx = sectionIndexes.experience + 1;
    const endIdx = sectionIndexes.education !== -1 ? sectionIndexes.education : lines.length;
    
    let i = startIdx;
    while (i < endIdx) {
      const line = lines[i];
      
      // Look for company name (single line, reasonable length)
      if (line && line.length > 1 && line.length < 50 && 
          !line.includes('•') && !line.includes('(') && 
          !/^\d{4}/.test(line) && // Not a year
          !/^(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december)/i.test(line) &&
          !line.includes(',') && !line.includes('Nederland')) { // Not location
        
        const company = line;
        
        // Next line should be job title
        if (i + 1 < endIdx && lines[i + 1]) {
          const title = lines[i + 1];
          
          // Look for duration in the next line
          let duration = "";
          if (i + 2 < endIdx && lines[i + 2] && /\d{4}.*(-|tot|present|heden)/i.test(lines[i + 2])) {
            duration = lines[i + 2];
            i += 3; // Skip company, title, and duration
          } else {
            i += 2; // Skip company and title
          }
          
          // Add experience entry
          result.experiences.push({
            company: company.trim(),
            title: title.trim(),
            duration: duration.trim()
          });
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
  }

  // Extract skills section (Dutch: "Belangrijkste vaardigheden")
  if (sectionIndexes.skills !== -1) {
    const startIdx = sectionIndexes.skills + 1;
    
    // Skills are typically the next few lines after the section header
    for (let i = startIdx; i < Math.min(startIdx + 10, lines.length); i++) {
      const line = lines[i];
      
      // Stop at major sections or when we hit the name
      if (!line || 
          /^(samenvatting|ervaring|opleiding|contactgegevens)$/i.test(line) ||
          /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line)) { // Stop at name pattern
        break;
      }
      
      // Add individual skills (each line is typically one skill)
      if (line.length > 2 && line.length < 50 && !line.includes('@')) {
        result.skills.push(line.trim());
      }
    }
  }

  // Remove duplicate skills
  result.skills = [...new Set(result.skills)];

  console.log("Mapped LinkedIn text to entities:", result);
  return result;
}