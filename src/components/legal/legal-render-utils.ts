export function calculateReadingTime(content: string): string {
  // Strip markdown syntax
  const cleanText = content
    .replace(/[#*`_\[\]()\-+]/g, " ") // replace markdown styling chars
    .replace(/\|/g, " ")             // replace table pipes
    .replace(/\s+/g, " ")            // collapse spacing
    .trim();
  
  const words = cleanText.split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(words / 200);
  const finalMinutes = Math.max(1, minutes);
  return `${finalMinutes} min read`;
}

export const deterministicSlugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export function extractKnownFields(text: string, labels: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  const occurrences: { label: string; index: number }[] = [];
  
  labels.forEach((lbl) => {
    const escaped = lbl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Ensure case-insensitive match
    const regex = new RegExp(escaped, "i");
    const match = text.match(regex);
    if (match && match.index !== undefined) {
      occurrences.push({ label: lbl, index: match.index });
    }
  });
  
  // Filter out overlapping occurrences where one is fully covered by another.
  // Example: "Support" at index 180 is fully covered by "Support enquiries" starting at 180 and ending at 197.
  const filteredOccurrences = occurrences.filter((occ) => {
    return !occurrences.some((other) => {
      if (other === occ) return false;
      const occEnd = occ.index + occ.label.length;
      const otherEnd = other.index + other.label.length;
      // Is occ inside other?
      return occ.index >= other.index && occEnd <= otherEnd;
    });
  });

  // Sort by index to get order of occurrence
  filteredOccurrences.sort((a, b) => a.index - b.index);
  
  for (let i = 0; i < filteredOccurrences.length; i++) {
    const current = filteredOccurrences[i];
    const next = filteredOccurrences[i + 1];
    const startVal = current.index + current.label.length;
    
    let segment = next 
      ? text.slice(startVal, next.index)
      : text.slice(startVal);
      
    // Clean leading/trailing colon, spaces, dashes
    segment = segment.replace(/^[:\s\-\u2013*]+/, "").trim();
    
    if (segment) {
      result[current.label] = segment;
    }
  }
  
  return result;
}
