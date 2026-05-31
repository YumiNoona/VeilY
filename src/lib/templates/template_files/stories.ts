import { StoriesState } from "@/hooks/useStoriesState";
import { AppearanceSettings } from "@/types/chat";

const createChatAppearance = (darkMode = false): AppearanceSettings => ({
  darkMode,
  showTimestamps: true,
  showStatus: true,
  use24HourFormat: false,
  showDeviceStatusBar: true,
  showDeviceFrame: true,
  statusBarTime: '9:41',
  batteryLevel: 85,
  transparentBackground: false,
});

export const STORIES_TEMPLATES = {
  influencerDay: {
    platform: 'instagram',
    username: 'travel_diaries',
    verified: true,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  productLaunch: {
    platform: 'instagram',
    username: 'tech_gear_daily',
    verified: true,
    timeAgo: '45m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  snapchatVibe: {
    platform: 'snapchat',
    username: 'chill_vibes',
    verified: false,
    timeAgo: 'Just now',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1499566727020-88026dc6a0de?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1518833559746-12128bd35c5c?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  dayInLife: {
    platform: 'instagram',
    username: 'sara_vlogs',
    verified: false,
    timeAgo: '5h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1494390648447-380ff9822a10?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  morningCoffee: {
    platform: 'instagram',
    username: 'cozy_mornings',
    verified: false,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  gymSession: {
    platform: 'instagram',
    username: 'fitness_junkie',
    verified: true,
    timeAgo: '45m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  travelJournal: {
    platform: 'snapchat',
    username: 'globetrotter',
    verified: false,
    timeAgo: '12h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  natureEscape: {
    platform: 'instagram',
    username: 'nature_seeker',
    verified: true,
    timeAgo: '1h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  urbanVibe: {
    platform: 'instagram',
    username: 'city_scout',
    verified: false,
    timeAgo: '3h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  petLove: {
    platform: 'instagram',
    username: 'paws_n_claws',
    verified: false,
    timeAgo: '15m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  foodieHeaven: {
    platform: 'instagram',
    username: 'chef_secrets',
    verified: true,
    timeAgo: '4h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  techSetup: {
    platform: 'instagram',
    username: 'code_lab',
    verified: true,
    timeAgo: '6h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  minimalFashion: {
    platform: 'instagram',
    username: 'style_edit',
    verified: false,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  modernArch: {
    platform: 'instagram',
    username: 'lines_n_space',
    verified: false,
    timeAgo: '8h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1449156001437-3a1411dfca19?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  beachDay: {
    platform: 'snapchat',
    username: 'island_hopper',
    verified: false,
    timeAgo: 'Just now',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  cityNight: {
    platform: 'snapchat',
    username: 'neon_vibes',
    verified: false,
    timeAgo: '10m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f2526019485b?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  luxuryDrive: {
    platform: 'snapchat',
    username: 'auto_elite',
    verified: true,
    timeAgo: '5m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  artGallery: {
    platform: 'instagram',
    username: 'palette_press',
    verified: true,
    timeAgo: '20m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1531913764164-f85c3e0125f7?w=800&q=80' },
      { id: 's4', imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,
};
