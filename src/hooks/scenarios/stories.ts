import { StoryPlatform } from '@/hooks/useStoriesState';

export interface StoryScenario {
  platform: StoryPlatform;
  username: string;
  name: string;
  slides: Array<{ imageUrl: string }>;
}

export const storyScenarios: StoryScenario[] = [
  {
    platform: 'instagram',
    username: 'fitness_junkie',
    name: "Gym Session",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'cozy_mornings',
    name: "Morning Coffee",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'island_hopper',
    name: "Beach Day",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'city_scout',
    name: "Urban Vibe",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'style_edit',
    name: "Minimal Fashion",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'sunset_chaser',
    name: "Golden Hour",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'car_enthusiast',
    name: "Weekend Drive",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'mountain_dreams',
    name: "Alpine Escape",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'noodle_lover',
    name: "Ramen Date",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'street_art_hunter',
    name: "Mural Walk",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'paws_and_claws',
    name: "New Kitten",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'guitar_hours',
    name: "Late Night Jam",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'plant_mommy',
    name: "Jungle Room",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'skate_or_die',
    name: "Skate Park Sunday",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'ocean_eyes',
    name: "Surf Trip",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'night_photographer',
    name: "Neon City Walk",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'baking_bliss',
    name: "Fresh Sourdough",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'cycle_everyday',
    name: "Countryside Ride",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80" }
    ]
  },
  {
    platform: 'snapchat',
    username: 'candlelit_vibes',
    name: "Self Care Night",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1543087903-1ac2ec450393?w=800&q=80" }
    ]
  },
  {
    platform: 'instagram',
    username: 'aerial_view',
    name: "Drone Shots",
    slides: [
      { imageUrl: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=800&q=80" },
      { imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80" }
    ]
  }
];
