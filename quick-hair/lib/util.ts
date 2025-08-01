export const serviceOptions = [
    "haircut",
    "shave",
    "beardTrim",
    "hairColoring",
    "hairStyling",
    "hairTreatment",
    "facial",
    "waxing",
    "threading",
    "manicure",
    "pedicure",
    "massage",
]

// export const COLORS2 = [
//     '#5d5fef',
//     '#4740b3'
// ];
export const COLORS2 = [
  '#00695c', // Dark teal
  '#4740b3', // Dark cyan-blue
  '#8e24aa', // Dark purple
  '#880e4f', // Raspberry
    '#ad1457', // Dark pink
    '#5d5fef', // Dark blue
    '#6a1b9a', // Deep violet
  '#4527a0', // Dark indigo
  '#283593', // Dark blue
  '#1565c0', // Vibrant navy blue
  '#2e7d32', // Dark green
  '#558b2f', // Olive green
  '#9e9d24', // Olive yellow
  '#f9a825', // Golden yellow
  '#ef6c00', // Deep orange
  '#d84315', // Brick orange
  '#4e342e', // Dark brown
  '#3e2723', // Deep chocolate
  '#263238', // Charcoal gray
  '#37474f', // Blue-gray
  '#5d4037', // Brown-gray
  '#1b5e20', // Forest green
  '#0d47a1', // Royal blue
  '#311b92', // Midnight purple
  '#b71c1c', // Blood red
  '#4a148c', // Dark magenta
  '#003c8f', // Sapphire blue
  '#004d40', // Deep sea green
  '#33691e', // Moss green
  '#ff6f00'  // Burnt amber
];

export function formatDateForIndia(dateString:Date) {
  const date = new Date(dateString);

  // Convert to IST
  const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  // Strip time to compare date only
  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Yesterday = today - 1
  const yesterday = new Date(istNow);
  yesterday.setDate(istNow.getDate() - 1);

  const time = istDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (isSameDate(istDate, istNow)) {
    return `Today, ${time}`;
  } else if (isSameDate(istDate, yesterday)) {
    return `Yesterday, ${time}`;
  } else {
    const fullDate = istDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${fullDate}, ${time}`;
  }
}
