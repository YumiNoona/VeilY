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

const avatar = (seed: string) => `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;

export const commentScenarios: CommentScenario[] = [
  {
    platform: 'youtube', name: 'TypeScript Walkthrough',
    creator: { name: 'Arjun Codes', handle: 'arjuncodes', avatar: avatar('arjuncodes') },
    comments: [
      { id: 'c1', userId: 'u1', name: 'Mehul Shah', text: 'The part about narrowing at 8:14 fixed the exact bug I had this morning. Thanks, bhai.', likes: '438', timeAgo: '3h', isLikedByAuthor: true },
      { id: 'c2', userId: 'u2', name: 'Claire Adams', text: 'Could you show the same example with data coming from an API next time?', likes: '91', timeAgo: '2h' }
    ]
  },
  {
    platform: 'youtube', name: 'Classical Guitar',
    creator: { name: 'Nikhil Plays', handle: 'nikhilplays', avatar: avatar('nikhilplays') },
    comments: [
      { id: 'c1', userId: 'u3', name: 'Aarohi Sen', text: 'I have been practising this arrangement for two weeks. The right-hand close-up helps a lot.', likes: '1.1K', timeAgo: '1d' },
      { id: 'c2', userId: 'u4', name: 'Jon Bell', text: 'That last chord rings so cleanly. What strings are you using?', likes: '214', timeAgo: '22h' }
    ]
  },
  {
    platform: 'youtube', name: 'Kerala Fish Curry',
    creator: { name: 'Ammas Table', handle: 'ammastable', avatar: avatar('ammastable') },
    comments: [
      { id: 'c1', userId: 'u5', name: 'Deepa Nair', text: 'Made this with kudampuli exactly as shown. My mother asked for the recipe, which is the real test.', likes: '2.4K', timeAgo: '6h', isLikedByAuthor: true },
      { id: 'c2', userId: 'u6', name: 'Ravi Thomas', text: 'For a smaller fish, should I reduce the simmer time or keep it the same?', likes: '176', timeAgo: '4h' }
    ]
  },
  {
    platform: 'youtube', name: 'Camera Review',
    creator: { name: 'Frame by Frame', handle: 'framebyframe', avatar: avatar('framebyframe') },
    comments: [
      { id: 'c1', userId: 'u7', name: 'Maya Chen', text: 'Thank you for showing the autofocus misses instead of cutting around them.', likes: '684', timeAgo: '9h' },
      { id: 'c2', userId: 'u8', name: 'Dev Malhotra', text: 'The low-light sample at 12:30 made the decision for me. Keeping my current body for another year.', likes: '327', timeAgo: '7h' }
    ]
  },
  {
    platform: 'youtube', name: 'Train Journey Film',
    creator: { name: 'Window Seat Films', handle: 'windowseatfilms', avatar: avatar('windowseatfilms') },
    comments: [
      { id: 'c1', userId: 'u9', name: 'Sana Qureshi', text: 'The station tea vendor calling out in the background took me straight back to summer trips with my grandparents.', likes: '3.8K', timeAgo: '2d' },
      { id: 'c2', userId: 'u10', name: 'Alex Morgan', text: 'No narration was the right choice. The journey carries the whole film.', likes: '941', timeAgo: '1d' }
    ]
  },
  {
    platform: 'instagram', name: 'Handloom Detail',
    creator: { name: 'Tara Textiles', handle: 'taratextiles', avatar: avatar('taratextiles') },
    comments: [
      { id: 'c1', userId: 'u11', name: 'Mira Iyer', text: 'Is this the rust colour from your winter collection? I have been waiting for it to return.', likes: '86', timeAgo: '40m', isLikedByAuthor: true },
      { id: 'c2', userId: 'u12', name: 'Naina Kapoor', text: 'The selvedge detail is beautiful. Please show the full drape too.', likes: '51', timeAgo: '28m' }
    ]
  },
  {
    platform: 'instagram', name: 'Goa Photo Roll',
    creator: { name: 'Kavya Nair', handle: 'kavyanair', avatar: avatar('kavyanair') },
    comments: [
      { id: 'c1', userId: 'u13', name: 'Rhea Dsouza', text: 'You finally posted the ferry photo! Send me the fourth one without the crop.', likes: '73', timeAgo: '1h', isLikedByAuthor: true },
      { id: 'c2', userId: 'u14', name: 'Arun Menon', text: 'That tiny bakery near the church is still there. Their poi sells out by ten.', likes: '34', timeAgo: '47m' }
    ]
  },
  {
    platform: 'instagram', name: 'First 10K Run',
    creator: { name: 'Zoya Khan', handle: 'zoyaruns', avatar: avatar('zoyaruns') },
    comments: [
      { id: 'c1', userId: 'u15', name: 'Pallavi Joshi', text: 'You looked far too calm at kilometre eight. I was negotiating with every streetlight.', likes: '129', timeAgo: '2h' },
      { id: 'c2', userId: 'u16', name: 'Sameer Ali', text: 'Sub-60 on your first one is solid. Recover properly tomorrow.', likes: '62', timeAgo: '1h' }
    ]
  },
  {
    platform: 'instagram', name: 'Ceramic Studio',
    creator: { name: 'Sofia Makes', handle: 'sofiamakes', avatar: avatar('sofiamakes') },
    comments: [
      { id: 'c1', userId: 'u17', name: 'Lena Park', text: 'The blue glaze broke so nicely around the rim. Was this one fired twice?', likes: '44', timeAgo: '3h' },
      { id: 'c2', userId: 'u18', name: 'Noah Reed', text: 'I still use the mug I bought from you last year every morning.', likes: '28', timeAgo: '2h', isLikedByAuthor: true }
    ]
  },
  {
    platform: 'instagram', name: 'Balcony Garden',
    creator: { name: 'Ritu Grows', handle: 'ritugrows', avatar: avatar('ritugrows') },
    comments: [
      { id: 'c1', userId: 'u19', name: 'Anjali Bose', text: 'My curry leaf plant has the same spots. Did neem spray help yours?', likes: '37', timeAgo: '5h' },
      { id: 'c2', userId: 'u20', name: 'Kabir Sethi', text: 'That tomato plant has taken over the whole railing since last month.', likes: '19', timeAgo: '4h' }
    ]
  },
  {
    platform: 'tiktok', name: 'Desk Repair',
    creator: { name: 'Fix It with Sam', handle: 'fixitwithsam', avatar: avatar('fixitwithsam') },
    comments: [
      { id: 'c1', userId: 'u21', name: 'Emily Ross', text: 'The folded paper under my desk leg has just been made redundant.', likes: '8.2K', timeAgo: '5h', isLikedByAuthor: true },
      { id: 'c2', userId: 'u22', name: 'Harsh Vardhan', text: 'Can confirm the washer trick works. Mine has been steady for six months.', likes: '1.9K', timeAgo: '4h' }
    ]
  },
  {
    platform: 'tiktok', name: 'Metro Sketch',
    creator: { name: 'Ira Draws', handle: 'iradraws', avatar: avatar('iradraws') },
    comments: [
      { id: 'c1', userId: 'u23', name: 'Tanvi Rao', text: 'You caught the exact expression of someone who has missed their stop.', likes: '12K', timeAgo: '2h' },
      { id: 'c2', userId: 'u24', name: 'Ben Wallace', text: 'How do you keep the page still while the train is moving?', likes: '2.7K', timeAgo: '1h' }
    ]
  },
  {
    platform: 'tiktok', name: 'Chai Test',
    creator: { name: 'Rohan Cooks', handle: 'rohancooks', avatar: avatar('rohancooks') },
    comments: [
      { id: 'c1', userId: 'u25', name: 'Ishita Sen', text: 'You skipped ginger and still called it the rainy-day version. I need an explanation.', likes: '18K', timeAgo: '3h' },
      { id: 'c2', userId: 'u26', name: 'Nikhil Jain', text: 'Two crushed cardamom pods is correct. We can move on.', likes: '7.4K', timeAgo: '2h', isLikedByAuthor: true }
    ]
  },
  {
    platform: 'tiktok', name: 'Thrift Alteration',
    creator: { name: 'Mina Sews', handle: 'minasews', avatar: avatar('minasews') },
    comments: [
      { id: 'c1', userId: 'u27', name: 'Jess Turner', text: 'The shoulder adjustment made more difference than I expected. Trying this on my blazer tonight.', likes: '6.1K', timeAgo: '7h' },
      { id: 'c2', userId: 'u28', name: 'Aditi Verma', text: 'Please do the sleeve lining in a slower video. Mine keeps twisting.', likes: '3.3K', timeAgo: '6h' }
    ]
  },
  {
    platform: 'tiktok', name: 'Dog Training',
    creator: { name: 'Milo Learns', handle: 'milolearns', avatar: avatar('milolearns') },
    comments: [
      { id: 'c1', userId: 'u29', name: 'Chris Hall', text: 'He checked whether you still had the treat before doing the second spin.', likes: '21K', timeAgo: '1h' },
      { id: 'c2', userId: 'u30', name: 'Riya Mehta', text: 'My beagle heard the treat bag through the phone and came running.', likes: '9.8K', timeAgo: '48m', isLikedByAuthor: true }
    ]
  },
  {
    platform: 'twitter', name: 'Transit Reply',
    creator: { name: 'Mumbai Metro Updates', handle: 'mumbaimetroupdate', avatar: avatar('mumbaimetro') },
    comments: [
      { id: 'c1', userId: 'u31', name: 'Devika Rao', text: 'Will the last train from Andheri still leave at 11:18 tonight?', likes: '43', timeAgo: '18m' },
      { id: 'c2', userId: 'u32', name: 'Aman Sheikh', text: 'The new signs at the east exit are much easier to read. Thank you.', likes: '87', timeAgo: '11m' }
    ]
  },
  {
    platform: 'twitter', name: 'Design Detail',
    creator: { name: 'Maya Chen', handle: 'mayachenux', avatar: avatar('mayachenux') },
    comments: [
      { id: 'c1', userId: 'u33', name: 'Jonas Lind', text: 'The disabled state needs more contrast, but the new spacing is a big improvement.', likes: '126', timeAgo: '24m' },
      { id: 'c2', userId: 'u34', name: 'Sneha Iyer', text: 'Would love to see how the table behaves at 320 px.', likes: '71', timeAgo: '17m' }
    ]
  },
  {
    platform: 'twitter', name: 'Local Bookshop',
    creator: { name: 'Paper Boat Books', handle: 'paperboatbooks', avatar: avatar('paperboatbooks') },
    comments: [
      { id: 'c1', userId: 'u35', name: 'Farah Ali', text: 'Could you hold one copy of the blue cover until Saturday?', likes: '12', timeAgo: '32m' },
      { id: 'c2', userId: 'u36', name: 'Rohit Bose', text: 'I picked this up from you last month. The translation is excellent.', likes: '28', timeAgo: '21m' }
    ]
  },
  {
    platform: 'twitter', name: 'Match Discussion',
    creator: { name: 'Maya Krishnan', handle: 'mayawatchescricket', avatar: avatar('mayawatchescricket') },
    comments: [
      { id: 'c1', userId: 'u37', name: 'Aditya Menon', text: 'That over changed the field completely. They never recovered the singles after it.', likes: '532', timeAgo: '9m' },
      { id: 'c2', userId: 'u38', name: 'Sonal Kapoor', text: 'The replay from behind the bowler explains why the batter was late.', likes: '304', timeAgo: '6m' }
    ]
  },
  {
    platform: 'twitter', name: 'Library Notice',
    creator: { name: 'City Central Library', handle: 'citycentrallib', avatar: avatar('citycentrallib') },
    comments: [
      { id: 'c1', userId: 'u39', name: 'Priya Nair', text: 'Is the quiet study room included in the late opening hours?', likes: '19', timeAgo: '46m' },
      { id: 'c2', userId: 'u40', name: 'Marcus Reed', text: 'The returns slot on King Street is full, just a heads-up.', likes: '11', timeAgo: '35m' }
    ]
  }
];
