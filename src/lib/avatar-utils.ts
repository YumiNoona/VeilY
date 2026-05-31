const femaleNames = new Set([
  "sarah", "emma", "priya", "kavya", "neha", "ananya", "riya", "shreya", "olivia",
  "sophia", "ava", "mia", "zoe", "lily", "chloe", "emily", "elena", "luna",
  "diya", "amara", "fatima", "yasmin", "aisha", "jasmine", "rose", "grace",
  "hannah", "isabella", "charlotte", "amelia", "harper", "evelyn", "abigail",
  "ella", "scarlett", "victoria", "madison", "aria", "penelope", "layla",
  "riley", "nora", "ellie", "hazel", "violet", "aurora", "savannah", "audrey",
  "brooklyn", "bella", "claire", "skylar", "lucy", "anna", "samantha", "caroline",
  "maya", "katherine", "alice", "julia", "sadie", "eva", "jessica", "rachel",
  "natasha", "tanya", "meera", "divya", "sonia", "lisa", "diana", "clara"
]);

const maleAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1570158268183-d296b2892211?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop",
];

const femaleAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1545912453-db5233ffcf6f?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1564460576398-ef1d99586b21?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1581403341638-a6e0b9d2d257?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop",
];

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarUrl(name: string): string {
  const firstName = name.split(" ")[0].toLowerCase();
  const isFemale = femaleNames.has(firstName);
  const pool = isFemale ? femaleAvatars : maleAvatars;
  return pool[hashCode(name) % pool.length];
}
