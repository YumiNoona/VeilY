import { SocialPostState, SocialPlatform } from '@/hooks/useSocialPostState';

export interface SocialScenario {
  platform: SocialPlatform;
  name: string;
  author: { name: string; handle: string };
  text: string;
  metrics: { likes: string; comments: string; reposts: string; views: string };
}

export const socialScenarios: SocialScenario[] = [
  {
    platform: 'twitter',
    name: "Tech Hot Take",
    author: { name: "Alex Rivera", handle: "arivera_dev" },
    text: "unpopular opinion: clean code is overrated if you don't ship anything. speed > perfectionism. fight me. 🧵",
    metrics: { likes: "12.4K", comments: "1.2K", reposts: "3.4K", views: "1.1M" }
  },
  {
    platform: 'twitter',
    name: "Indian Cricket",
    author: { name: "Rohan Gupta", handle: "rohan_cricket" },
    text: "Bhai kya catch pakda hai! 😱 Kohli is literally a beast. King for a reason. #INDvsAUS #KingKohli",
    metrics: { likes: "45.7K", comments: "2.1K", reposts: "12.5K", views: "2.8M" }
  },
  {
    platform: 'instagram',
    name: "Travel Aesthetic",
    author: { name: "Emma Wilson", handle: "emma_travels" },
    text: "mornings in bali... 🌴✨ honestly never want to leave. #travel #minimalist",
    metrics: { likes: "8.2K", comments: "142", reposts: "0", views: "0" }
  },
  {
    platform: 'instagram',
    name: "Indian Foodie",
    author: { name: "Kavya Iyer", handle: "kavya_cooks" },
    text: "This butter chicken was actually insane. Best dinner in Delhi ngl. 🍛🔥 #foodie #delhigram",
    metrics: { likes: "15.3K", comments: "312", reposts: "0", views: "0" }
  },
  {
    platform: 'linkedin',
    name: "Humble Brag Promotion",
    author: { name: "Sarah Jenkins", handle: "sjenkins-hr" },
    text: "I'm thrilled to share that I've been promoted to Senior Director of People Ops! 🚀 It's been an incredible 5 years at Veily. #career #promotion",
    metrics: { likes: "1,245", comments: "312", reposts: "12", views: "45K" }
  },
  {
    platform: 'reddit',
    name: "AITA Wedding Drama",
    author: { name: "u/throwaway_123", handle: "u/throwaway_123" },
    text: "AITA for telling my brother his wedding was boring? He spent $50k on a venue with no music or dancing.",
    metrics: { likes: "15.7K", comments: "3.2K", reposts: "0", views: "0" }
  },
  {
    platform: 'twitter',
    name: "Boy Flirting",
    author: { name: "Marcus Chen", handle: "marcus_flirts" },
    text: "saw you at the coffee shop today and didn't say hi bc you were way too pretty and i panicked. anyway what's your workout routine asking for me",
    metrics: { likes: "3.8K", comments: "890", reposts: "420", views: "340K" }
  },
  {
    platform: 'instagram',
    name: "Bestie Hype",
    author: { name: "Riya Kapoor", handle: "riya.kapoor" },
    text: "HAPPY BIRTHDAY TO MY RIDE OR DIE 💕👯‍♀️ literally no one understands me like you do. You deserve the entire world bestie @tanvi.slays 🎂🎈",
    metrics: { likes: "5.4K", comments: "234", reposts: "0", views: "0" }
  },
  {
    platform: 'linkedin',
    name: "Startup Layoff Post",
    author: { name: "Tyler Smith", handle: "tylersmith-tech" },
    text: "After 3 amazing years at NovaTech, I was unfortunately impacted by the layoffs today. I'm looking for my next role in Product Design. Here's what I've learned: resilience is everything. If your team is hiring, please reach out. 🙏 #OpenToWork",
    metrics: { likes: "4,872", comments: "1,203", reposts: "856", views: "89K" }
  },
  {
    platform: 'reddit',
    name: "TIFU Pizza Order",
    author: { name: "u/pizzalover99", handle: "u/pizzalover99" },
    text: "TIFU by ordering 47 pizzas instead of 4. I work at a daycare and we were ordering for a party. Apparently when you type '4-7' in the quantity box on DoorDash it defaults to 47. Now I have 43 extra pepperoni pizzas and my boss is calling corporate.",
    metrics: { likes: "22.3K", comments: "1.8K", reposts: "0", views: "0" }
  },
  {
    platform: 'facebook',
    name: "Marketplace Gems",
    author: { name: "Ananya Singh", handle: "ananya.market" },
    text: "Selling my 2018 MacBook Pro. Lightly used, only one small dent where I dropped it during a Zoom call. Battery lasts 45 minutes on a good day. Asking $900 firm. NO LOWBALLERS I KNOW WHAT I HAVE 😤",
    metrics: { likes: "234", comments: "89", reposts: "12", views: "2.3K" }
  },
  {
    platform: 'twitter',
    name: "Viral Tech Thread",
    author: { name: "CodeWithHarry", handle: "codewithharry" },
    text: "Hot take: Most developers don't need Kubernetes. You're running a blog with 100 visitors a day on a $400/month K8s cluster. Just use a $5 VPS my guy. 🧵👇",
    metrics: { likes: "88.2K", comments: "4.5K", reposts: "22.1K", views: "3.4M" }
  },
  {
    platform: 'instagram',
    name: "Fashion OOTD",
    author: { name: "Sofia Martinez", handle: "sofia.style" },
    text: "fit check: thrifted blazer + vintage levis + chunky loafers ✨ who says broke girls can't slay? 💅 #ootd #thriftflip #slowfashion",
    metrics: { likes: "23.1K", comments: "567", reposts: "0", views: "0" }
  },
  {
    platform: 'twitter',
    name: "Savage Roast",
    author: { name: "Urvashi Rautela Fan", handle: "urvashi_zone" },
    text: "bro said 'i'm a 10' but walks around looking like an unmade bed and smells like Axe body spray from 2012 💀 sit down",
    metrics: { likes: "34.5K", comments: "1.8K", reposts: "8.2K", views: "780K" }
  },
  {
    platform: 'linkedin',
    name: "Thought Leader",
    author: { name: "David Park", handle: "davidpark-ceo" },
    text: "I woke up at 3:47 AM today. Cold plunge. Meditated for 18 minutes. Journaled 3 pages. Read 2 chapters of Meditations by Marcus Aurelius. All before my first coffee. The grind doesn't stop. Are you optimizing your morning? 🤔💭",
    metrics: { likes: "3,201", comments: "845", reposts: "234", views: "62K" }
  },
  {
    platform: 'reddit',
    name: "Unpopular Opinion",
    author: { name: "u/hot_takes_only", handle: "u/hot_takes_only" },
    text: "Unpopular opinion: Pineapple on pizza is actually elite. The sweetness cuts through the saltiness of the ham and the acidity balances the cheese perfectly. You people are just closed-minded.",
    metrics: { likes: "8.9K", comments: "4.2K", reposts: "0", views: "0" }
  },
  {
    platform: 'facebook',
    name: "Mom Group Post",
    author: { name: "Jennifer Miller", handle: "jen.miller84" },
    text: "Does anyone know of a good gluten-free, dairy-free, nut-free, egg-free, soy-free birthday cake recipe? Little Braxlynn has 17 food allergies but still deserves a special day. Also must be sugar-free. TIA mamas! 🎂✨",
    metrics: { likes: "78", comments: "156", reposts: "3", views: "1.8K" }
  },
  {
    platform: 'instagram',
    name: "Pet Portrait",
    author: { name: "DogsofNYC", handle: "dogsofnyc" },
    text: "meet tofu. he's 12 weeks old, 3 pounds, and already runs this household. swipe for the blep 👅🐶 #puppiesofinstagram #shihtzu #dogdad",
    metrics: { likes: "47.2K", comments: "891", reposts: "0", views: "0" }
  },
  {
    platform: 'twitter',
    name: "Movie Hot Take",
    author: { name: "FilmBroReviews", handle: "filmbroreviews" },
    text: "just rewatched inception and realized the entire movie is literally about a man who didn't back up his wife's files. cobb just needed iCloud. that's the plot. 4/10 realism.",
    metrics: { likes: "19.7K", comments: "2.3K", reposts: "5.8K", views: "1.2M" }
  },
  {
    platform: 'linkedin',
    name: "Job Offer Acceptance",
    author: { name: "Priya Sharma", handle: "priyasharma-eng" },
    text: "I'm excited to announce that I'll be joining Google as a Senior Software Engineer on the Chrome team! 🎉 After 1500+ LeetCode problems, 47 rejections, and countless sleepless nights, dreams do come true. To everyone still grinding: keep going. #Google #SoftwareEngineering #DreamJob",
    metrics: { likes: "12,345", comments: "2,891", reposts: "1,204", views: "156K" }
  }
];
