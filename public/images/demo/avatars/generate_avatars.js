// Node.js script to generate SVG avatars for demo people
// Usage: node generate_avatars.js
// This script parses the demo.mysql file and creates SVG avatars for each person in the avatars directory

const fs = require("fs");
const path = require("path");

// Path to the demo.mysql file
const DEMO_MYSQL =
  "E:/LCS/CoreApis/MembershipApi/tools/dbScripts/demo.mysql";
const OUTPUT_DIR =
  __dirname;

// Helper: Calculate age group from birthdate
function getAgeGroup(
  birthDate
) {
  if (
    !birthDate ||
    birthDate ===
      "NULL"
  )
    return "adult";
  const birth =
    new Date(
      birthDate
    );
  const today =
    new Date();
  let age =
    today.getFullYear() -
    birth.getFullYear();
  const m =
    today.getMonth() -
    birth.getMonth();
  if (
    m <
      0 ||
    (m ===
      0 &&
      today.getDate() <
        birth.getDate())
  )
    age--;
  if (
    age <
    13
  )
    return "child";
  if (
    age <
    20
  )
    return "teen";
  if (
    age <
    60
  )
    return "adult";
  return "senior";
}

// Helper: Generate a random color from a palette
function randomFrom(
  arr
) {
  return arr[
    Math.floor(
      Math.random() *
        arr.length
    )
  ];
}
const skinTones =
  [
    "#F9D7B5",
    "#F2C49B",
    "#D1A074",
    "#A8754A",
    "#7C4F2A"
  ];
const hairColors =
  [
    "#2C1B10",
    "#6B3E26",
    "#A0522D",
    "#D2B48C",
    "#000",
    "#FFF",
    "#B5651D",
    "#4B3621"
  ];
const bgColors =
  [
    "#F5A623",
    "#50E3C2",
    "#B8E986",
    "#4A90E2",
    "#D0021B",
    "#9013FE",
    "#F8E71C",
    "#8B572A"
  ];
const shirtColors =
  [
    "#7ED6DF",
    "#E056FD",
    "#F6E58D",
    "#30336B",
    "#F9CA24",
    "#686DE0",
    "#22A6B3",
    "#4834D4"
  ];

// Helper: SVG avatar generator (simple, flat, faceless)
function makeAvatar({
  gender,
  ageGroup,
  skin,
  hair,
  bg,
  shirt
}) {
  // Basic shapes for different age/gender
  let hairShape =
    "";
  if (
    gender ===
    "female"
  ) {
    if (
      ageGroup ===
      "child"
    )
      hairShape =
        '<ellipse cx="64" cy="54" rx="38" ry="32" fill="' +
        hair +
        '"/>';
    else if (
      ageGroup ===
      "teen"
    )
      hairShape =
        '<ellipse cx="64" cy="50" rx="36" ry="30" fill="' +
        hair +
        '"/>';
    else if (
      ageGroup ===
      "senior"
    )
      hairShape =
        '<ellipse cx="64" cy="48" rx="34" ry="28" fill="' +
        hair +
        '"/>';
    else
      hairShape =
        '<ellipse cx="64" cy="52" rx="38" ry="32" fill="' +
        hair +
        '"/>';
  } else {
    if (
      ageGroup ===
      "child"
    )
      hairShape =
        '<ellipse cx="64" cy="54" rx="30" ry="18" fill="' +
        hair +
        '"/>';
    else if (
      ageGroup ===
      "teen"
    )
      hairShape =
        '<ellipse cx="64" cy="50" rx="28" ry="16" fill="' +
        hair +
        '"/>';
    else if (
      ageGroup ===
      "senior"
    )
      hairShape =
        '<ellipse cx="64" cy="48" rx="26" ry="14" fill="' +
        hair +
        '"/>';
    else
      hairShape =
        '<ellipse cx="64" cy="52" rx="30" ry="18" fill="' +
        hair +
        '"/>';
  }
  return `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" fill="${bg}"/>
    ${hairShape}
    <ellipse cx="64" cy="64" rx="28" ry="32" fill="${skin}"/>
    <rect x="36" y="96" width="56" height="24" rx="12" fill="${shirt}"/>
  </svg>`;
}

// Parse people from demo.mysql
const sql =
  fs.readFileSync(
    DEMO_MYSQL,
    "utf8"
  );

console.log(
  "SQL LENGTH",
  sql.length
);
const peopleRegex =
  /\('(?<id>PER\d+)',\s*'[^']+',\s*'[^']+',\s*'[^']+',\s*'[^']+',\s*'(?<gender>Male|Female)',\s*'[^']+',\s*'(?<birth>[^']*)'/g;
let match;
const people =
  [];

let matchCount = 0;

const matches =
  peopleRegex.exec(
    sql
  );
console.log(
  "MATCHES",
  matches
);

while (
  (match =
    peopleRegex.exec(
      sql
    ))
) {
  matchCount++;
  people.push(
    {
      id: match
        .groups
        .id,
      gender:
        match.groups.gender.toLowerCase(),
      birth:
        match
          .groups
          .birth
    }
  );
}
console.log(
  `Regex matched ${matchCount} people records.`
);

people.forEach(
  (
    person
  ) => {
    const ageGroup =
      getAgeGroup(
        person.birth
      );
    const skin =
      randomFrom(
        skinTones
      );
    const hair =
      randomFrom(
        hairColors
      );
    const bg =
      randomFrom(
        bgColors
      );
    const shirt =
      randomFrom(
        shirtColors
      );
    const svg =
      makeAvatar(
        {
          gender:
            person.gender,
          ageGroup,
          skin,
          hair,
          bg,
          shirt
        }
      );
    fs.writeFileSync(
      path.join(
        OUTPUT_DIR,
        `${person.id}.svg`
      ),
      svg,
      "utf8"
    );
  }
);

console.log(
  `Generated ${people.length} avatars in ${OUTPUT_DIR}`
);
