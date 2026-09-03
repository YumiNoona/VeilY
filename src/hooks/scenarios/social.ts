import { SocialPlatform } from '@/hooks/useSocialPostState';

export interface SocialScenario {
  platform: SocialPlatform;
  name: string;
  author: { name: string; handle: string };
  text: string;
  image?: string | null;
  metrics: { likes: string; comments: string; reposts: string; views: string };
}

export const socialScenarios: SocialScenario[] = [
  {
    platform: 'twitter',
    name: 'Monsoon Commute',
    author: { name: 'Neha Kulkarni', handle: 'nehakulkarni' },
    text: 'Left home early to beat the Pune rain. The rain also left early.',
    metrics: { likes: '2.8K', comments: '96', reposts: '311', views: '74K' }
  },
  {
    platform: 'twitter',
    name: 'Release Morning',
    author: { name: 'Omar Rahman', handle: 'omarbuilds' },
    text: 'Tiny release today: keyboard shortcuts now work in every dialog. It took longer than the headline suggests.',
    metrics: { likes: '684', comments: '37', reposts: '52', views: '18K' }
  },
  {
    platform: 'twitter',
    name: 'Bookshop Find',
    author: { name: 'Leah Morgan', handle: 'leahreads' },
    text: 'Found the out-of-print translation I have been hunting for since college. Best £4 I have spent this year.',
    metrics: { likes: '1.1K', comments: '44', reposts: '83', views: '29K' }
  },
  {
    platform: 'twitter',
    name: 'Cricket Evening',
    author: { name: 'Ishaan Batra', handle: 'ishaanb' },
    text: 'Five people in my building shouted before the replay even started. That catch has united the entire lane.',
    metrics: { likes: '7.9K', comments: '214', reposts: '1.3K', views: '206K' }
  },
  {
    platform: 'instagram',
    name: 'Sunday Breakfast',
    author: { name: 'Kavya Nair', handle: 'kavyaeats' },
    text: 'Appam, stew, and a second cup of coffee before anyone asked me to check my phone.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&h=1000&fit=crop',
    metrics: { likes: '1,842', comments: '63', reposts: '0', views: '0' }
  },
  {
    platform: 'instagram',
    name: 'Jaipur Walk',
    author: { name: 'Aditi Soni', handle: 'aditisoni' },
    text: 'We missed the museum closing time and found this lane instead. Fair trade.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&h=1000&fit=crop',
    metrics: { likes: '3,208', comments: '91', reposts: '0', views: '0' }
  },
  {
    platform: 'instagram',
    name: 'Pottery Class',
    author: { name: 'Sofia Martin', handle: 'sofia.makes' },
    text: 'Cup number six. It still leans, but now it leans on purpose.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1000&h=1000&fit=crop',
    metrics: { likes: '742', comments: '34', reposts: '0', views: '0' }
  },
  {
    platform: 'instagram',
    name: 'Coastal Train',
    author: { name: 'Rohan Desai', handle: 'rohanontheroad' },
    text: 'Window seat from Mangaluru to Goa. Packed lunch by Amma, playlist by my sister.',
    image: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=1000&h=1000&fit=crop',
    metrics: { likes: '2,516', comments: '78', reposts: '0', views: '0' }
  },
  {
    platform: 'linkedin',
    name: 'Project Retrospective',
    author: { name: 'Nandita Rao', handle: 'nanditarao' },
    text: 'We shipped our billing migration this morning. The useful lesson was simple: write the rollback plan before the launch plan. It saved us twice during testing. Credit to Arjun and Mei for insisting on the final dry run.',
    metrics: { likes: '418', comments: '32', reposts: '21', views: '13K' }
  },
  {
    platform: 'linkedin',
    name: 'Community Workshop',
    author: { name: 'Daniel Kim', handle: 'daniel-kim-design' },
    text: 'I am hosting a free portfolio review for early-career designers in Bengaluru next Saturday. We have eight seats and will spend twenty minutes on each portfolio. Details are in the first comment.',
    metrics: { likes: '286', comments: '47', reposts: '39', views: '9.4K' }
  },
  {
    platform: 'linkedin',
    name: 'New Role',
    author: { name: 'Maya Chen', handle: 'maya-chen-research' },
    text: 'Today was my first day with the accessibility research team at Northstar. I first met this group as a participant three years ago, so joining them feels especially meaningful. Thank you to everyone who helped me prepare for the move.',
    metrics: { likes: '734', comments: '84', reposts: '16', views: '22K' }
  },
  {
    platform: 'linkedin',
    name: 'Hiring Note',
    author: { name: 'Sameer Shah', handle: 'sameer-shah-product' },
    text: 'We are hiring a product designer for our payments team. The work is mostly systems thinking: permissions, edge cases, and clear recovery paths. Remote within India, with monthly team days in Mumbai.',
    metrics: { likes: '193', comments: '28', reposts: '61', views: '17K' }
  },
  {
    platform: 'facebook',
    name: 'Apartment Notice',
    author: { name: 'Anita Joseph', handle: 'anitajoseph' },
    text: 'The parcel left near B-204 belongs to us. If someone moved it inside because of the rain, please message me. It has medicine for my father.',
    metrics: { likes: '12', comments: '9', reposts: '0', views: '143' }
  },
  {
    platform: 'facebook',
    name: 'School Reunion',
    author: { name: 'Vivek Menon', handle: 'vivekmenon' },
    text: 'Found this photo while clearing an old hard drive. St. Thomas batch of 2008, after the inter-school final. Tag anyone I missed.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop',
    metrics: { likes: '86', comments: '31', reposts: '4', views: '1.2K' }
  },
  {
    platform: 'facebook',
    name: 'Garden Cuttings',
    author: { name: 'Helen Brooks', handle: 'helenbrooks' },
    text: 'I have six rooted rosemary cuttings to give away. Collection near Oak Street after 5 pm. No pots needed; I have spare ones.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&h=750&fit=crop',
    metrics: { likes: '27', comments: '18', reposts: '3', views: '392' }
  },
  {
    platform: 'facebook',
    name: 'Weekend Match',
    author: { name: 'Gurpreet Singh', handle: 'gurpreetsingh' },
    text: 'Need two more players for badminton tomorrow, 7 am at the community court. Intermediate level, doubles, one hour.',
    metrics: { likes: '8', comments: '14', reposts: '1', views: '126' }
  },
  {
    platform: 'reddit',
    name: 'Bengaluru Metro',
    author: { name: 'filterkaapi92', handle: 'bangalore' },
    text: 'The new interchange signs at Majestic are much clearer\n\nUsed the purple line connection this morning and did not need to ask anyone for directions. The platform numbers are finally visible before the escalator.',
    metrics: { likes: '846', comments: '117', reposts: '0', views: '0' }
  },
  {
    platform: 'reddit',
    name: 'Home Coffee',
    author: { name: 'smallbatchsam', handle: 'Coffee' },
    text: 'My first decent pour-over after changing one thing\n\nI stopped trying to copy a fixed recipe and adjusted the grind until the drawdown hit three minutes. Same beans, much sweeter cup.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=750&fit=crop',
    metrics: { likes: '392', comments: '54', reposts: '0', views: '0' }
  },
  {
    platform: 'reddit',
    name: 'Old Laptop Repair',
    author: { name: 'solderandtea', handle: 'righttorepair' },
    text: 'Replaced a five-cent capacitor and saved a ten-year-old laptop\n\nThe repair shop had quoted for a new motherboard. The boardview pointed to one shorted capacitor near the charging circuit. It is back on my dad\'s desk now.',
    metrics: { likes: '2.1K', comments: '188', reposts: '0', views: '0' }
  },
  {
    platform: 'reddit',
    name: 'Dinner Question',
    author: { name: 'weeknightcook', handle: 'IndianFood' },
    text: 'What do you serve with lemon rice besides curd?\n\nI make it for quick dinners, but I want one vegetable side that can cook in the same time. Preferably something that keeps well for lunch.',
    metrics: { likes: '214', comments: '73', reposts: '0', views: '0' }
  }
];
