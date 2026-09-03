import { CommentsState } from '@/hooks/useCommentState';

export const COMMENT_TEMPLATES = {
  instagramHype: {
    platform: 'instagram',
    profiles: [
      { id: 'c', name: 'Kavya Nair', handle: 'kavyanair', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', verified: false, isCreator: true },
      { id: 'p1', name: 'Rhea Dsouza', handle: 'rheadsouza', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', verified: false },
      { id: 'p2', name: 'Arun Menon', handle: 'arunmenon', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: 'You finally posted the ferry photo. Send me the uncropped one?', likes: '74', timeAgo: '1h', replies: [{ id: 'r1', userId: 'c', text: 'Check your messages, sending all four.', likes: '18', timeAgo: '42m', replies: [] }], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: 'That bakery near the church still has the best poi.', likes: '31', timeAgo: '50m', replies: [] }
    ],
    config: { theme: 'light' }
  } as CommentsState,
  tiktokViral: {
    platform: 'tiktok',
    profiles: [
      { id: 'c', name: 'Ira Draws', handle: 'iradraws', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop', verified: false, isCreator: true },
      { id: 'p1', name: 'Tanvi Rao', handle: 'tanvirao', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop', verified: false },
      { id: 'p2', name: 'Ben Wallace', handle: 'benwallace', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: 'You captured the exact face of someone who has missed their stop.', likes: '12K', timeAgo: '2h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: 'How do you keep the page steady while the train is moving?', likes: '2,704', timeAgo: '1h', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState,
  twitterRatio: {
    platform: 'twitter',
    profiles: [
      { id: 'c', name: 'Maya Chen', handle: 'mayachenux', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop', verified: false, isCreator: true },
      { id: 'p1', name: 'Jonas Lind', handle: 'jonaslind', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', verified: false },
      { id: 'p2', name: 'Sneha Iyer', handle: 'snehaiyer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: 'The disabled state still needs more contrast, but the spacing is much easier to scan.', likes: '126', timeAgo: '24m', replies: [] },
      { id: 'm2', userId: 'p2', text: 'Could you share how the table behaves at 320 px?', likes: '71', timeAgo: '17m', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState,
  youtubeKnowledge: {
    platform: 'youtube',
    profiles: [
      { id: 'c', name: 'Arjun Codes', handle: 'arjuncodes', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'Mehul Shah', handle: 'mehulshah', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', verified: false },
      { id: 'p2', name: 'Claire Adams', handle: 'claireadams', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: 'The narrowing example at 8:14 fixed the bug I had this morning. Thanks, bhai.', likes: '438', timeAgo: '3h', replies: [{ id: 'r1', userId: 'c', text: 'Glad it helped. I added the full example to the description.', likes: '52', timeAgo: '2h', replies: [] }], pinned: true },
      { id: 'm2', userId: 'p2', text: 'Could you show this with data from an API in the next video?', likes: '91', timeAgo: '2h', replies: [] }
    ],
    config: { theme: 'light' }
  } as CommentsState,
  tiktokRecipe: {
    platform: 'tiktok',
    profiles: [
      { id: 'c', name: 'Ammas Table', handle: 'ammastable', avatar: 'https://images.unsplash.com/photo-1583394238712-92d139ca3211?w=80&h=80&fit=crop', verified: false, isCreator: true },
      { id: 'p1', name: 'Deepa Nair', handle: 'deepanair', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', verified: false },
      { id: 'p2', name: 'Ravi Thomas', handle: 'ravithomas', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: 'Made this with kudampuli exactly as shown. My mother asked me for the recipe.', likes: '2,401', timeAgo: '6h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: 'For a smaller fish, should I reduce the simmer time?', likes: '176', timeAgo: '4h', replies: [] }
    ],
    config: { theme: 'dark' }
  } as CommentsState
};
