import { CommentPlatform } from '@/hooks/useCommentState';

export interface CommentScenario {
  platform: CommentPlatform;
  name: string;
  creator: { name: string; handle: string; avatar: string };
  comments: Array<{
    id: string;
    userId: string;
    name: string;
    text: string;
    likes: string;
    timeAgo: string;
    isLikedByAuthor?: boolean;
  }>;
}

export const commentScenarios: CommentScenario[] = [
  {
    platform: 'youtube',
    name: "Tutorial Feedback",
    creator: { name: "Code with Arjun", handle: "@codearjun", avatar: "https://i.pravatar.cc/150?u=codearjun" },
    comments: [
      { id: 'c1', userId: 'u1', name: "Rahul Singh", text: "bhai best explanation! finally understood how to use promises properly. 🚀", likes: "1.2K", timeAgo: "2h" },
      { id: 'c2', userId: 'u2', name: "Sarah Miller", text: "Can you do a follow up on async/await? Great video as always!", likes: "450", timeAgo: "5h" }
    ]
  },
  {
    platform: 'instagram',
    name: "Social Hype",
    creator: { name: "Aesthetic Vibes", handle: "@asthetic_vibes", avatar: "https://i.pravatar.cc/150?u=aesthetic" },
    comments: [
      { id: 'c1', userId: 'u3', name: "Priya Sharma", text: "omg where is this dress from?? 😍", likes: "842", timeAgo: "1h", isLikedByAuthor: true },
      { id: 'c2', userId: 'u4', name: "Jake Wilson", text: "vibes are actually immaculate", likes: "120", timeAgo: "3h" }
    ]
  },
  {
    platform: 'tiktok',
    name: "Viral Trend",
    creator: { name: "Trending Daily", handle: "@trending_daily", avatar: "https://i.pravatar.cc/150?u=trending" },
    comments: [
      { id: 'c1', userId: 'u5', name: "Kavya Iyer", text: "the way my jaw DROPPED 😭😭", likes: "45K", timeAgo: "4h", isLikedByAuthor: true },
      { id: 'c2', userId: 'u6', name: "Marcus Chen", text: "standard lol", likes: "12K", timeAgo: "6h" }
    ]
  },
  {
    platform: 'twitter',
    name: "Tech Debate",
    creator: { name: "Tech Insider", handle: "@techinsider", avatar: "https://i.pravatar.cc/150?u=tech" },
    comments: [
      { id: 'c1', userId: 'u7', name: "Tyler Smith", text: "ratio + you're wrong + here are the actual stats 📉", likes: "2.4K", timeAgo: "12m" },
      { id: 'c2', userId: 'u8', name: "Ananya Singh", text: "ngl i saw this coming miles away", likes: "450", timeAgo: "45m" }
    ]
  },
  {
    platform: 'youtube',
    name: "Giveaway Beggars",
    creator: { name: "Mr. Giveaway", handle: "@mr_giveaway", avatar: "https://i.pravatar.cc/150?u=giveaway" },
    comments: [
      { id: 'c1', userId: 'u9', name: "Amit Kumar", text: "sir please i need iphone 15 my phone broke last week crying while watching this video 🙏🙏😭😭", likes: "2.3K", timeAgo: "30m" },
      { id: 'c2', userId: 'u10', name: "Emily Davis", text: "can i have the ps5? my brother is sick and this would make his year honestly ❤️", likes: "1.1K", timeAgo: "45m" },
      { id: 'c3', userId: 'u11', name: "Vikram Reddy", text: "bro just announced the giveaway and people are already writing sob stories in the comments 😂😂", likes: "8.9K", timeAgo: "1h" }
    ]
  },
  {
    platform: 'youtube',
    name: "Love From India",
    creator: { name: "World Travels", handle: "@worldtravels", avatar: "https://i.pravatar.cc/150?u=worldtravels" },
    comments: [
      { id: 'c1', userId: 'u12', name: "Sandeep Patel", text: "Love from India 🇮🇳❤️ anyone watching in 2026?", likes: "12K", timeAgo: "2h" },
      { id: 'c2', userId: 'u13', name: "Arun Nair", text: "Who's here after 10 years? Still a masterpiece. Love from Kerala 🌴", likes: "5.6K", timeAgo: "4h" },
      { id: 'c3', userId: 'u14', name: "Meera Joshi", text: "This song never gets old. Sending love from Mumbai 💕", likes: "3.2K", timeAgo: "8h" }
    ]
  },
  {
    platform: 'tiktok',
    name: "Dance Challenge",
    creator: { name: "Move With Mia", handle: "@movewithmia", avatar: "https://i.pravatar.cc/150?u=withmia" },
    comments: [
      { id: 'c1', userId: 'u15', name: "Zara Williams", text: "HOW ARE YOUR HIPS DOING THAT i tried and pulled something 💀", likes: "67K", timeAgo: "2h", isLikedByAuthor: true },
      { id: 'c2', userId: 'u16', name: "Liam Chen", text: "this choreo is actually insane, the footwork at 0:23 had me rewatching 5 times", likes: "23K", timeAgo: "3h" }
    ]
  },
  {
    platform: 'twitter',
    name: "Controversial Thread",
    creator: { name: "Hot Takes Daily", handle: "@hottakesdaily", avatar: "https://i.pravatar.cc/150?u=hottakes" },
    comments: [
      { id: 'c1', userId: 'u17', name: "RealTalk23", text: "y'all aren't ready for this conversation but i've been saying this for YEARS", likes: "3.4K", timeAgo: "10m" },
      { id: 'c2', userId: 'u18', name: "Devil's Advocate", text: "this is the worst take i've ever read and i've been on this app since 2013", likes: "5.6K", timeAgo: "25m" },
      { id: 'c3', userId: 'u19', name: "Context Provider", text: "for everyone in the replies: here's the original thread with full context. OP conveniently left out the part where they were wrong 🧵👇", likes: "12K", timeAgo: "40m" }
    ]
  },
  {
    platform: 'youtube',
    name: "Music Video Premiere",
    creator: { name: "Music World", handle: "@musicworld", avatar: "https://i.pravatar.cc/150?u=musicworld" },
    comments: [
      { id: 'c1', userId: 'u20', name: "Faith Harvey", text: "the cinematography in this is actually oscar-worthy. the director deserves a raise 🔥", likes: "45K", timeAgo: "1h" },
      { id: 'c2', userId: 'u21', name: "Beat Inspector", text: "2:47 that bass switch went CRAZY. produced, written, AND directed by the artist himself. talent.", likes: "28K", timeAgo: "2h" }
    ]
  },
  {
    platform: 'instagram',
    name: "Celebrity Selfie",
    creator: { name: "Celeb Daily", handle: "@celebdaily", avatar: "https://i.pravatar.cc/150?u=celeb" },
    comments: [
      { id: 'c1', userId: 'u22', name: "Stella Rose", text: "mother is mothering 😭😭", likes: "89K", timeAgo: "15m", isLikedByAuthor: true },
      { id: 'c2', userId: 'u23', name: "Daniel Park", text: "drop the skincare routine immediately", likes: "34K", timeAgo: "30m" },
      { id: 'c3', userId: 'u24', name: "Olivia Brown", text: "living for this era honestly 🔥", likes: "22K", timeAgo: "45m" }
    ]
  },
  {
    platform: 'youtube',
    name: "Cooking Tutorial",
    creator: { name: "Home Chef Riya", handle: "@homechefriya", avatar: "https://i.pravatar.cc/150?u=chefriya" },
    comments: [
      { id: 'c1', userId: 'u25', name: "Mike's Kitchen", text: "made this for my family last night and they thought I ordered from a restaurant. your recipes never miss 🙌", likes: "3.4K", timeAgo: "3h" },
      { id: 'c2', userId: 'u26', name: "Neha Gupta", text: "didi aapke haath ka khaana dekh ke ghar ki yaad aa gayi 😭❤️", likes: "8.7K", timeAgo: "5h" }
    ]
  },
  {
    platform: 'tiktok',
    name: "Comedy Skit",
    creator: { name: "Funny Side", handle: "@funnyside", avatar: "https://i.pravatar.cc/150?u=funnyside" },
    comments: [
      { id: 'c1', userId: 'u27', name: "Chloe Adams", text: "the way i SCREAMED at the plot twist 😂😂😂😂", likes: "112K", timeAgo: "1h", isLikedByAuthor: true },
      { id: 'c2', userId: 'u28', name: "Noah Kim", text: "bro really committed to the bit and i respect it 💀", likes: "67K", timeAgo: "2h" }
    ]
  },
  {
    platform: 'twitter',
    name: "Sports Hot Take",
    creator: { name: "ESPN Wannabe", handle: "@espn_wannabe", avatar: "https://i.pravatar.cc/150?u=espn" },
    comments: [
      { id: 'c1', userId: 'u29', name: "Ball Knower", text: "delete this right now. i've been watching football for 30 years and this is categorically false", likes: "4.5K", timeAgo: "20m" },
      { id: 'c2', userId: 'u30', name: "Stat Guy", text: "actually if you look at the advanced metrics from 2019-2024 you'll see he's absolutely right. here's the data 📊👇", likes: "2.8K", timeAgo: "40m" }
    ]
  },
  {
    platform: 'youtube',
    name: "Gaming Highlights",
    creator: { name: "ProGamerX", handle: "@progamerx", avatar: "https://i.pravatar.cc/150?u=gamerx" },
    comments: [
      { id: 'c1', userId: 'u31', name: "FaZe Wannabe", text: "that flick at 1:34 was NOT human. aimbot allegations incoming 🎯", likes: "5.2K", timeAgo: "1h" },
      { id: 'c2', userId: 'u32', name: "SilentButDeadly", text: "bro is playing on PC with controller and still clapping mnk players. absolute menace 😤", likes: "3.8K", timeAgo: "3h" },
      { id: 'c3', userId: 'u33', name: "Casual Gamer", text: "meanwhile i can't even hit a stationary target in the tutorial 💀", likes: "1.2K", timeAgo: "5h" }
    ]
  },
  {
    platform: 'instagram',
    name: "Travel Influencer",
    creator: { name: "Wanderlust Diaries", handle: "@wanderlust", avatar: "https://i.pravatar.cc/150?u=wanderlust" },
    comments: [
      { id: 'c1', userId: 'u34', name: "Maya Torres", text: "adding this to my bucket list immediately 😍 which hotel is this??", likes: "2.1K", timeAgo: "30m", isLikedByAuthor: true },
      { id: 'c2', userId: 'u35', name: "Backpacker Sam", text: "was there last summer! such a hidden gem. the street food around the corner is even better", likes: "890", timeAgo: "2h" }
    ]
  },
  {
    platform: 'tiktok',
    name: "Life Hack",
    creator: { name: "Daily Hacks", handle: "@dailyhacks", avatar: "https://i.pravatar.cc/150?u=dailyhacks" },
    comments: [
      { id: 'c1', userId: 'u36', name: "Curious Cat", text: "wait this actually works??? trying this right now BRB", likes: "34K", timeAgo: "45m" },
      { id: 'c2', userId: 'u37', name: "Skeptical Steve", text: "i tested 7 of these 'hacks' and only 2 worked. doing the lord's work so you don't have to 💪", likes: "89K", timeAgo: "2h" }
    ]
  },
  {
    platform: 'youtube',
    name: "Product Review",
    creator: { name: "Unbox Therapy Clone", handle: "@unboxdaily", avatar: "https://i.pravatar.cc/150?u=unbox" },
    comments: [
      { id: 'c1', userId: 'u38', name: "Tech Enthusiast", text: "just got mine delivered and this review is spot on. the build quality is actually incredible", likes: "1.8K", timeAgo: "4h" },
      { id: 'c2', userId: 'u39', name: "Budget Gamer", text: "$800 for this? i'll stick with my 5 year old setup that still runs everything at 60fps 😅", likes: "3.2K", timeAgo: "6h" }
    ]
  },
  {
    platform: 'twitter',
    name: "Political Discourse",
    creator: { name: "Centrist Enjoyer", handle: "@centrist_enjoyer", avatar: "https://i.pravatar.cc/150?u=centrist" },
    comments: [
      { id: 'c1', userId: 'u40', name: "Left Leaner", text: "this is exactly why we need systemic change. you're blaming individuals for systemic problems", likes: "6.7K", timeAgo: "15m" },
      { id: 'c2', userId: 'u41', name: "Right Thinker", text: "personal responsibility is dead and this thread proves it. can't believe this has 10k likes", likes: "5.4K", timeAgo: "22m" },
      { id: 'c3', userId: 'u42', name: "Sane Person", text: "both of you are so far in your bubbles you can't even see how ridiculous this argument is", likes: "15K", timeAgo: "35m" }
    ]
  },
  {
    platform: 'instagram',
    name: "Makeup Tutorial",
    creator: { name: "Glow Up Gals", handle: "@glowupgals", avatar: "https://i.pravatar.cc/150?u=glowup" },
    comments: [
      { id: 'c1', userId: 'u43', name: "Beauty Newbie", text: "the blend on that eyeshadow is actually witchcraft. what brushes do you use?? 😍😍", likes: "4.5K", timeAgo: "1h", isLikedByAuthor: true },
      { id: 'c2', userId: 'u44', name: "Makeup Artist Pro", text: "finally someone who color corrects properly before foundation. thank you for educating the masses 🙏", likes: "2.3K", timeAgo: "2h" }
    ]
  },
  {
    platform: 'tiktok',
    name: "Fitness Transformation",
    creator: { name: "Fit Journey", handle: "@fitjourney", avatar: "https://i.pravatar.cc/150?u=fitjourney" },
    comments: [
      { id: 'c1', userId: 'u45', name: "Gym Newbie", text: "drop the full workout routine rn i am BEGGING you 😭", likes: "78K", timeAgo: "3h" },
      { id: 'c2', userId: 'u46', name: "Transformation King", text: "from zero pullups to 20 in 6 months. the dedication is unreal bro keep going 🔥", likes: "45K", timeAgo: "5h" }
    ]
  }
];
