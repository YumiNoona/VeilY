import { SocialPostState } from '@/hooks/useSocialPostState';

const now = () => new Date();

export const SOCIAL_TEMPLATES = {
  viralTweet: {
    platform: 'twitter',
    author: { name: 'Nandita Rao', handle: 'nanditarao', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', verified: false },
    content: { text: 'We removed three onboarding steps last week. Support tickets dropped before activation changed. Sometimes the confusing part is not the product; it is the tour.', image: null, date: now() },
    metrics: { likes: '1.8K', comments: '126', reposts: '214', views: '82K' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: [
      { id: 't1', parentId: null, author: { name: 'Nandita Rao', handle: 'nanditarao', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', verified: false }, content: { text: 'The step we nearly kept was the workspace naming screen. Most people accepted the default and renamed it later, so we moved it into settings.', image: null, date: now() }, metrics: { likes: '246' }, isThreadContinuation: true }
    ]
  } as SocialPostState,
  techNewsX: {
    platform: 'twitter',
    author: { name: 'City Desk Tech', handle: 'citydesktech', avatar: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=100&h=100&fit=crop', verified: true },
    content: { text: 'The public library has opened its digital media lab today. Residents can book the recording booth and borrow cameras with a library card.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=675&fit=crop', date: now() },
    metrics: { likes: '4.2K', comments: '173', reposts: '1.1K', views: '193K' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  instagramAesthetic: {
    platform: 'instagram',
    author: { name: 'Kavya Nair', handle: 'kavyanair', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', verified: false },
    content: { text: 'Breakfast stretched into lunch, exactly as Sundays should.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1000&fit=crop', date: now() },
    metrics: { likes: '2,431', comments: '74', reposts: '0', views: '0' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  instagramBrand: {
    platform: 'instagram',
    author: { name: 'Mitti Studio', handle: 'mittistudio', avatar: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=100&h=100&fit=crop', verified: true },
    content: { text: 'The monsoon glaze is back in a small batch this Friday. Each cup is wheel-thrown in our Pune studio.', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1000&h=1000&fit=crop', date: now() },
    metrics: { likes: '986', comments: '42', reposts: '0', views: '0' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  linkedinHired: {
    platform: 'linkedin',
    author: { name: 'Marcus Chen', handle: 'marcus-chen-research', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', verified: false },
    content: { text: 'I joined Northstar today as a user researcher. The team gave me the rare luxury of spending my first week listening to customer calls before opening a planning document. I am looking forward to learning the product properly.', image: null, date: now() },
    metrics: { likes: '642', comments: '71', reposts: '9', views: '18K' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  linkedinAdvice: {
    platform: 'linkedin',
    author: { name: 'Sana Qureshi', handle: 'sana-qureshi-ops', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', verified: false },
    content: { text: 'A small operations habit that has held up: write the owner beside every decision while the meeting is still happening. Our notes became shorter, and far fewer tasks disappeared between teams.', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=627&fit=crop', date: now() },
    metrics: { likes: '317', comments: '26', reposts: '41', views: '11K' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  redditAITA: {
    platform: 'reddit',
    author: { name: 'sharedflatthrowaway', handle: 'AmItheAsshole', avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png', verified: false },
    content: { text: 'AITA for asking my flatmate to replace the pan he ruined?\n\nHe borrowed my cast-iron pan, left it soaking overnight, and scrubbed it with steel wool. He says it is still usable, so replacing it would be wasteful. I paid for it and had asked him not to soak it.', image: null, date: now() },
    metrics: { likes: '6.4K', comments: '1.2K', reposts: '0', views: '0' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  facebookMarketplace: {
    platform: 'facebook',
    author: { name: 'Robert Wilson', handle: 'robertwilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', verified: false },
    content: { text: 'Oak dining chair, £35. Solid frame, a few marks on the seat shown in the photos. Collection from Springfield after 6 pm.', image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=800&fit=crop', date: now() },
    metrics: { likes: '7', comments: '11', reposts: '0', views: '264' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  redditTheory: {
    platform: 'reddit',
    author: { name: 'quietframe', handle: 'movies', avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png', verified: false },
    content: { text: 'A small continuity detail I noticed on rewatch\n\nThe kitchen clock is ten minutes slow in every scene except the flashback. It may be the film quietly showing when the narrator stopped trusting his memory.', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop', date: now() },
    metrics: { likes: '3.7K', comments: '284', reposts: '0', views: '0' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
  xSpace: {
    platform: 'twitter',
    author: { name: 'Open Source Bengaluru', handle: 'osbengaluru', avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop', verified: false },
    content: { text: 'Audio room starts at 7:30 pm IST. Maintainers from three small projects will compare how they handle first-time contributors. Questions are open now.', image: null, date: now() },
    metrics: { likes: '438', comments: '63', reposts: '117', views: '16K' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState
};
