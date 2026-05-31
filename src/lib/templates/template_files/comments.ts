import { CommentsState } from "@/hooks/useCommentState";

export const COMMENT_TEMPLATES = {
  instagramHype: {
    platform: 'instagram',
    profiles: [
      { id: 'c', name: 'Main Creator', handle: 'creator', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'SuperFan 99', handle: 'sf99', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop', verified: false },
      { id: 'p2', name: 'Hater 01', handle: 'hater', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "THE VIBE omg 🔥🔥🔥 this is actually insane", likes: '1,347', timeAgo: '2h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: "overrated tbh", likes: '14', timeAgo: '4h', replies: [] }
    ],
    config: { theme: 'light' }
  } as CommentsState,

  tiktokViral: {
    platform: 'tiktok',
    profiles: [
      { id: 'c', name: 'TikTok Star', handle: 'star', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'Confused User', handle: 'user1', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "the way my jaw DROPPED 😭😭 this is the standard", likes: '44.7K', timeAgo: '3h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'c', text: "storytime coming soon 👀", likes: '127K', timeAgo: '1h', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState,

  twitterRatio: {
    platform: 'twitter',
    profiles: [
      { id: 'c', name: 'HotTakeAccount', handle: 'takes', avatar: '', verified: false, isCreator: true },
      { id: 'p1', name: 'FactChecker', handle: 'facts', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop', verified: true }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "ratio + you're wrong + here are the actual stats 📉", likes: '91.4K', timeAgo: '12m', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState,

  youtubeKnowledge: {
    platform: 'youtube',
    profiles: [
      { id: 'c', name: 'Polymath Hub', handle: 'polymath', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'Learner One', handle: 'studious', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "i've literally been wondering about this for 10 years and this is the first time someone actually explained it right. thank u", likes: '4,712', timeAgo: '5h', replies: [], pinned: true },
      { id: 'm2', userId: 'c', text: "glad it helped! got another vid on this if u want to go deeper", likes: '1,183', timeAgo: '2h', replies: [] }
    ],
    config: { theme: 'light' }
  } as CommentsState,

  tiktokRecipe: {
    platform: 'tiktok',
    profiles: [
        { id: 'c', name: 'Chef Mario', handle: 'chef_mario', avatar: 'https://images.unsplash.com/photo-1583394238712-92d139ca3211?w=50&h=50&fit=crop', verified: true, isCreator: true },
        { id: 'p1', name: 'Foodie Lover', handle: 'foodie', avatar: '', verified: false }
    ],
    comments: [
        { id: 'm1', userId: 'p1', text: "wait this looks so good im making this tonight", likes: '14.8K', timeAgo: '4h', replies: [] },
        { id: 'm2', userId: 'c', text: "pro tip toast the pine nuts first it makes a huge difference 🤌", likes: '8,347', timeAgo: '3h', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState,
};
