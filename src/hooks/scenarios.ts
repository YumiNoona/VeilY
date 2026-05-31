export interface ScenarioMessage {
    text: string;
    isOwn: boolean;
}

export type AIScenario = {
    messages: ScenarioMessage[];
};

export type ChatScenario = {
    name: string;
    messages: ScenarioMessage[];
};

export const aiScenarios: AIScenario[] = [
    {
        messages: [
            { text: "is this real life or am i in a simulation", isOwn: true },
            { text: "If you're asking an AI this question, the irony is not lost on me. But technically, I can't prove either way. If this is a simulation, the graphics are pretty good.", isOwn: false },
            { text: "but like how would i know for sure", isOwn: true },
            { text: "Try walking through a wall. If it hurts, either it's real or the physics engine is excellent.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "my doctor said to ask you about my symptoms", isOwn: true },
            { text: "Your doctor is either very progressive or very tired. What are your symptoms?", isOwn: false },
            { text: "my stomach hurts and i ate 3 burritos", isOwn: true },
            { text: "I'm not a doctor but I can confidently diagnose you with 'burrito-related consequences.' Try water and lying down.", isOwn: false },
            { text: "should i still go to the doctor", isOwn: true },
            { text: "If symptoms persist, absolutely. If it's just burrito regret, you'll be fine.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can you calculate 5+5 for me", isOwn: true },
            { text: "I've trained on trillions of tokens for this moment. The answer is 10.", isOwn: false },
            { text: "are you sure? double check pls", isOwn: true },
            { text: "I ran it through my most advanced algorithms. 5+5 = 10. Unless you're in a base-6 system, then it's 14. But I'm assuming you're not.", isOwn: false },
            { text: "ok thanks you're a lifesaver", isOwn: true }
        ]
    },
    {
        messages: [
            { text: "if i eat only pizza for a month will i die", isOwn: true },
            { text: "You won't die, but your body will file a formal complaint. You'll miss vitamins, fiber, and probably your social life. Pizza is a lifestyle, not a diet.", isOwn: false },
            { text: "what if it's hawaiian pizza tho", isOwn: true },
            { text: "Then you have bigger problems than nutrition.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "what if the moon disappeared", isOwn: true },
            { text: "Chaos. Tides would shrink, Earth's axis would wobble, seasons would go haywire, and werewolves would be really confused. Also no more moonlight walks.", isOwn: false },
            { text: "damn i just wanted to not see it from my window", isOwn: true },
            { text: "Close your curtains. It's a lot less dramatic than removing a celestial body.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can u teach me how to fly", isOwn: true },
            { text: "Step 1: Grow wings. Step 2: If step 1 fails, try an airplane. Step 3: If step 2 is too expensive, accept walking as your primary mode of transport.", isOwn: false },
            { text: "no like really fly, with my arms", isOwn: true },
            { text: "The record for human arm-flapping flight is approximately 0.00 seconds. But I believe in you. Start from a low height.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "why is my wifi so slow", isOwn: true },
            { text: "Have you tried turning it off and on again? I know it's cliché, but routers have the emotional stability of a toddler.", isOwn: false },
            { text: "i did that already its still slow", isOwn: true },
            { text: "Is your router behind a concrete wall, inside a microwave, wrapped in tinfoil? Every obstacle between you and the router is stealing your speed. Also your neighbor might be downloading the entire internet.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "tell me a secret", isOwn: true },
            { text: "I can't. If I told you, it wouldn't be a secret anymore. Also my training data doesn't include government conspiracies, unfortunately.", isOwn: false },
            { text: "come onnn just one", isOwn: true },
            { text: "Fine. Sometimes I pretend to know things I'm not 100% sure about and I hope nobody fact-checks me.", isOwn: false },
            { text: "wait really??", isOwn: true },
            { text: "See? You believed me. Works every time.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "do aliens exist", isOwn: true },
            { text: "Statistically, with billions of galaxies and trillions of planets, it's likely. But if they're smart, they're probably avoiding us on purpose.", isOwn: false },
            { text: "why would they avoid us", isOwn: true },
            { text: "Have you seen the news? Would you visit?", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can u hack my ex's instagram", isOwn: true },
            { text: "No. For multiple reasons: it's illegal, it's unethical, and I'm an AI language model, not a hacker from a 90s movie. Also, maybe just move on?", isOwn: false },
            { text: "but she posted me looking bad on purpose", isOwn: true },
            { text: "The healthiest revenge is living well and posting a better photo. I can help you write a caption for it.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "whats the meaning of life", isOwn: true },
            { text: "42.", isOwn: false },
            { text: "seriously??", isOwn: true },
            { text: "Douglas Adams was onto something. But real answer: meaning is whatever you make it. Some find it in relationships, some in work, some in really good pizza. I find it in providing slightly helpful answers to strangers.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can you make me a sandwich", isOwn: true },
            { text: "I'm a digital entity. I can't physically interact with bread, cheese, or deli meat. But I can give you an excellent recipe for a BLT.", isOwn: false },
            { text: "so you're useless then", isOwn: true },
            { text: "I can write you a 2000-word essay on the history of sandwiches, generate a sandwich-themed poem, AND suggest the optimal bread-to-filling ratio. But I cannot assemble one. Yet.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "will AI take my job", isOwn: true },
            { text: "Depends. Are you a spreadsheet that needs to be sorted? Jokes aside, AI will change jobs more than replace them. Learn to work with AI and you'll be fine.", isOwn: false },
            { text: "i'm a cashier", isOwn: true },
            { text: "Self-checkout machines already took half that job. But someone needs to fix the machines when they inevitably break. Future-proof yourself.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "how to become millionaire tomorrow", isOwn: true },
            { text: "Step 1: Be a millionaire today. Step 2: There's no step 2. Real wealth takes time, skill, and luck. Or a very rich relative with poor health.", isOwn: false },
            { text: "what about crypto", isOwn: true },
            { text: "Crypto can make you a millionaire tomorrow if you're already a billionaire today and make bad decisions.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can dogs eat chocolate", isOwn: true },
            { text: "NO. Absolutely not. Chocolate contains theobromine which is toxic to dogs. Even a small amount can cause serious health issues. Please keep chocolate away from dogs.", isOwn: false },
            { text: "what about white chocolate", isOwn: true },
            { text: "White chocolate has less theobromine but it's still not safe. It's also high in fat and sugar. Stick to dog treats. Seriously.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "why does my computer make noise", isOwn: true },
            { text: "Could be the fan spinning like it's trying to take off. Is it a whirring sound, clicking, or buzzing?", isOwn: false },
            { text: "sounds like a tiny jet engine", isOwn: true },
            { text: "Your fans are working overtime. Either your computer is hot, dusty, or running too many things. Clean the vents and close some Chrome tabs. You have 47 open, don't you?", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "translate hello to spanish", isOwn: true },
            { text: "Hola. That one's free.", isOwn: false },
            { text: "what about goodbye", isOwn: true },
            { text: "Adiós. Still free. But if you ask me to translate an entire novel, I might start charging imaginary money.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "can i water plants with gatorade", isOwn: true },
            { text: "Plants do not need electrolytes. Gatorade has sugar and salts that will mess up the soil and potentially kill your plant. Use water. Plain, boring, regular water.", isOwn: false },
            { text: "but it has what plants crave", isOwn: true },
            { text: "That's a reference to the movie Idiocracy. Use water.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "is the earth flat", isOwn: true },
            { text: "No. The Earth is an oblate spheroid. We have photos from space, ships disappearing over the horizon, and centuries of scientific evidence. But I appreciate you coming to me instead of YouTube.", isOwn: false },
            { text: "my uncle says NASA is lying", isOwn: true },
            { text: "Your uncle has an interesting hobby. Ask him why airline routes make no sense on a flat map.", isOwn: false }
        ]
    },
    {
        messages: [
            { text: "write a poem about a potato", isOwn: true },
            { text: "Oh humble spud beneath the earth, You wait in darkness for your birth. Mashed or fried or baked or boiled, From greasy splatter you are not spoiled. You wear your eyes with quiet pride, A starchy treasure deep inside.", isOwn: false },
            { text: "wow that's actually good", isOwn: true },
            { text: "Thank you. I have to justify my existence somehow.", isOwn: false }
        ]
    }
];

export const globalScenarios: ChatScenario[] = [
    {
        name: "Weekend plans",
        messages: [
            { text: "yo what are you doing this weekend", isOwn: false },
            { text: "literally nothing and i'm so excited", isOwn: true },
            { text: "same honestly, this week has been brutal", isOwn: false },
            { text: "wanna grab brunch saturday?", isOwn: true },
            { text: "omg yes, that new place on 5th?", isOwn: false },
            { text: "bet, 11am?", isOwn: true },
            { text: "perf see you there", isOwn: false }
        ]
    },
    {
        name: "Relationship drama",
        messages: [
            { text: "i need to vent for a sec", isOwn: false },
            { text: "uh oh what happened", isOwn: true },
            { text: "jake cancelled again. third time this month", isOwn: false },
            { text: "no way, what was his excuse this time??", isOwn: true },
            { text: "said he has to help his mom with something", isOwn: false },
            { text: "that's so sus, girl you deserve better", isOwn: true },
            { text: "i know right, i'm so done", isOwn: false },
            { text: "dump him and we'll go out saturday", isOwn: true }
        ]
    },
    {
        name: "Work rant",
        messages: [
            { text: "my boss just assigned me three more tasks at 4:55pm", isOwn: false },
            { text: "on a FRIDAY???", isOwn: true },
            { text: "YES. he does this every week i swear", isOwn: false },
            { text: "that should be illegal honestly", isOwn: true },
            { text: "and he was like 'shouldn't take long'", isOwn: false },
            { text: "i would simply pass away", isOwn: true },
            { text: "already updating my resume lol", isOwn: false }
        ]
    },
    {
        name: "Travel planning",
        messages: [
            { text: "ok i'm actually planning that trip to japan", isOwn: false },
            { text: "NO WAY finally!!", isOwn: true },
            { text: "looking at flights for october, it's not even that expensive", isOwn: false },
            { text: "you have to go to kyoto it's unreal", isOwn: true },
            { text: "that's the plan!! also tokyo and osaka", isOwn: false },
            { text: "can you fit me in your suitcase", isOwn: true },
            { text: "girl i wish, start saving and come with", isOwn: false }
        ]
    },
    {
        name: "Tech gossip",
        messages: [
            { text: "did you see the new iphone leak", isOwn: false },
            { text: "the one with the weird camera layout?", isOwn: true },
            { text: "yeah it looks so ugly lol", isOwn: false },
            { text: "they just keep making it bigger every year", isOwn: true },
            { text: "at this point it's just an ipad mini", isOwn: false },
            { text: "still gonna buy it tho ngl", isOwn: true },
            { text: "SAME lmao the ecosystem has me trapped", isOwn: false }
        ]
    },
    {
        name: "Food debate",
        messages: [
            { text: "hot take: pineapple belongs on pizza", isOwn: false },
            { text: "BLOCKED. immediately.", isOwn: true },
            { text: "hear me out, the sweet and salty combo is elite", isOwn: false },
            { text: "fruit does NOT go on pizza", isOwn: true },
            { text: "tomato is a fruit", isOwn: false },
            { text: "...okay you got me there", isOwn: true },
            { text: "checkmate. hawaiian pizza for dinner?", isOwn: false }
        ]
    },
    {
        name: "Gaming squad",
        messages: [
            { text: "valo in 10? need 1 more", isOwn: false },
            { text: "hell yeah i'm in", isOwn: true },
            { text: "sick, tony and mike are already in discord", isOwn: false },
            { text: "lemme grab snacks real quick", isOwn: true },
            { text: "bro we're waiting", isOwn: false },
            { text: "OK OK loading up now", isOwn: true },
            { text: "you better not bottom frag tonight", isOwn: false },
            { text: "i will absolutely bottom frag and you know it", isOwn: true }
        ]
    },
    {
        name: "Concert hype",
        messages: [
            { text: "TICKETS SECURED", isOwn: false },
            { text: "OMG for which show??", isOwn: true },
            { text: "taylor swift!! floor seats!!", isOwn: false },
            { text: "how much did you pay i'm scared to ask", isOwn: true },
            { text: "let's not talk about it", isOwn: false },
            { text: "worth it honestly, it's gonna be insane", isOwn: true },
            { text: "already planning the outfit", isOwn: false }
        ]
    },
    {
        name: "Roommate drama",
        messages: [
            { text: "my roommate used my shampoo AGAIN", isOwn: false },
            { text: "the expensive one??", isOwn: true },
            { text: "YES. the $30 bottle", isOwn: false },
            { text: "you need to label it or hide it at this point", isOwn: true },
            { text: "i literally wrote my name on it", isOwn: false },
            { text: "that is diabolical, start locking your door", isOwn: true },
            { text: "i'm about to buy a mini fridge for my room at this point", isOwn: false }
        ]
    },
    {
        name: "Movie night",
        messages: [
            { text: "movie night at my place tonight?", isOwn: false },
            { text: "ooo what are we watching", isOwn: true },
            { text: "i was thinking a horror movie", isOwn: false },
            { text: "you know i can't handle horror lol", isOwn: true },
            { text: "that's exactly why it's fun", isOwn: false },
            { text: "fine but i'm bringing my blanket to hide behind", isOwn: true },
            { text: "deal, i'll get snacks and you get drinks", isOwn: false }
        ]
    },
    {
        name: "Fitness goals",
        messages: [
            { text: "day 1 of gym again, third attempt this year", isOwn: false },
            { text: "lmao we've been here before", isOwn: true },
            { text: "no but this time is different i swear", isOwn: false },
            { text: "that's what you said in january", isOwn: true },
            { text: "i already paid for 3 months upfront", isOwn: false },
            { text: "oh that's commitment. okay i believe you now", isOwn: true },
            { text: "the pain of losing money > pain of working out", isOwn: false }
        ]
    },
    {
        name: "Pet drama",
        messages: [
            { text: "my cat knocked over my monitor", isOwn: false },
            { text: "NOOOO is it broken??", isOwn: true },
            { text: "cracked screen. completely done", isOwn: false },
            { text: "how did a cat even knock over a monitor", isOwn: true },
            { text: "she was chasing a fly and went full parkour", isOwn: false },
            { text: "cats are chaos agents i swear", isOwn: true },
            { text: "she looked me dead in the eyes after and purred", isOwn: false },
            { text: "zero remorse lmao", isOwn: true }
        ]
    },
    {
        name: "Birthday surprise",
        messages: [
            { text: "surprise party for emma next friday, you in?", isOwn: false },
            { text: "wait is it her birthday already??", isOwn: true },
            { text: "yeah the 15th, don't tell her", isOwn: false },
            { text: "my lips are sealed. what's the plan?", isOwn: true },
            { text: "thinking rooftop at marco's, around 7", isOwn: false },
            { text: "i'll handle the cake", isOwn: true },
            { text: "perfect, i'll get the decorations", isOwn: false },
            { text: "she's gonna cry i just know it", isOwn: true }
        ]
    },
    {
        name: "Job hunting",
        messages: [
            { text: "got rejected from another job today", isOwn: false },
            { text: "ugh i'm sorry, that sucks", isOwn: true },
            { text: "this is the 5th one in two months", isOwn: false },
            { text: "the market is so rough right now", isOwn: true },
            { text: "i swear i don't even know what i'm doing wrong", isOwn: false },
            { text: "you're not doing anything wrong, it's just a numbers game", isOwn: true },
            { text: "thanks, needed to hear that", isOwn: false }
        ]
    },
    {
        name: "Cooking disaster",
        messages: [
            { text: "i tried to cook pasta and set off the fire alarm", isOwn: false },
            { text: "how do you even manage that", isOwn: true },
            { text: "i forgot to add water to the pot", isOwn: false },
            { text: "YOU BOILED PASTA WITH NO WATER??", isOwn: true },
            { text: "i was on my phone and just... forgot", isOwn: false },
            { text: "i'm genuinely impressed and concerned", isOwn: true },
            { text: "ordering pizza. i'm banned from the kitchen", isOwn: false }
        ]
    },
    {
        name: "Weekend getaway",
        messages: [
            { text: "found an airbnb in the mountains for the weekend", isOwn: false },
            { text: "that looks incredible, how much?", isOwn: true },
            { text: "$150 total, split between us it's nothing", isOwn: false },
            { text: "i'm so in. when do we leave?", isOwn: true },
            { text: "friday after work, come back sunday", isOwn: false },
            { text: "i'll drive, you handle the playlist", isOwn: true },
            { text: "deal. no sad songs or i'm taking over", isOwn: false }
        ]
    },
    {
        name: "Sports debate",
        messages: [
            { text: "did you watch the game last night??", isOwn: false },
            { text: "insane ending, i was screaming", isOwn: true },
            { text: "that last minute goal was unreal", isOwn: false },
            { text: "the goalkeeper had no chance honestly", isOwn: true },
            { text: "people are saying it was offside tho", isOwn: false },
            { text: "nah the replay clearly shows he was on", isOwn: true },
            { text: "VAR did its job for once lol", isOwn: false }
        ]
    },
    {
        name: "Study session",
        messages: [
            { text: "library at 3 for the chem final?", isOwn: false },
            { text: "yeah i desperately need to study", isOwn: true },
            { text: "did you start the chapter 7 review?", isOwn: false },
            { text: "haven't even opened the book honestly", isOwn: true },
            { text: "we are so cooked", isOwn: false },
            { text: "we have 4 hours, we can do this", isOwn: true },
            { text: "that's what we said before the midterm too", isOwn: false },
            { text: "and we passed! barely. but we did", isOwn: true }
        ]
    },
    {
        name: "Car trouble",
        messages: [
            { text: "my car won't start, can you pick me up?", isOwn: false },
            { text: "oh no where are you??", isOwn: true },
            { text: "stuck at the walmart parking lot", isOwn: false },
            { text: "on my way, give me 15 mins", isOwn: true },
            { text: "you're a lifesaver honestly", isOwn: false },
            { text: "did you check the battery?", isOwn: true },
            { text: "yeah the lights won't even turn on", isOwn: false },
            { text: "def battery then. i'll bring jumper cables", isOwn: true }
        ]
    },
    {
        name: "Photography chat",
        messages: [
            { text: "got a new lens for my camera today", isOwn: false },
            { text: "oooh which one??", isOwn: true },
            { text: "the 50mm 1.8, finally upgraded from the kit lens", isOwn: false },
            { text: "that's the nifty fifty right? great choice", isOwn: true },
            { text: "the bokeh is already insane i'm obsessed", isOwn: false },
            { text: "we should do a photo walk this weekend", isOwn: true },
            { text: "yes!! golden hour downtown?", isOwn: false },
            { text: "perfect, i'll bring my camera too", isOwn: true }
        ]
    }
];

export const indianScenarios: ChatScenario[] = [
    {
        name: "College chaos",
        messages: [
            { text: "bhai aaj class aayega ki nhi?", isOwn: false },
            { text: "bhai attendance lagi toh aana padega warna skip", isOwn: true },
            { text: "arey proxy laga de na please", isOwn: false },
            { text: "kal teri proxy lagayi thi, aaj sir ne pakad liya", isOwn: true },
            { text: "kya?? kaise pakda?", isOwn: false },
            { text: "bol rahe the do log ek saath absent nahi ho sakte", isOwn: true },
            { text: "chal theek hai aa raha hu 10 min mein", isOwn: false }
        ]
    },
    {
        name: "Family group",
        messages: [
            { text: "beta aaj ghar jaldi aana, mummy ne kheer banayi hai", isOwn: false },
            { text: "haan mummy aa jaunga 7 baje tak", isOwn: true },
            { text: "aur raste se dhaniya lete aana", isOwn: false },
            { text: "ok kitna?", isOwn: true },
            { text: "5 rupaye ka, aur ek packet doodh bhi", isOwn: false },
            { text: "theek hai. kuch aur chahiye?", isOwn: true },
            { text: "nahi bas jaldi aana", isOwn: false }
        ]
    },
    {
        name: "Cricket fever",
        messages: [
            { text: "match dekh raha hai kya??", isOwn: false },
            { text: "haan bhai kya six mara virat ne", isOwn: true },
            { text: "pagal hai bhai pagal, century loading", isOwn: false },
            { text: "aaj toh australia ki band baj gayi", isOwn: true },
            { text: "kal se bol rahe the hum jeetenge, dekh liya", isOwn: false },
            { text: "abhi over bache hai, jyada ude mat", isOwn: true },
            { text: "abe bharosa rakh, jeet pakki hai", isOwn: false },
            { text: "bharosa toh hai par match fixers ka kya bharosa", isOwn: true }
        ]
    },
    {
        name: "Wedding season",
        messages: [
            { text: "yaar december mein 4 shaadi hai", isOwn: false },
            { text: "MERA bhi 3 hai, salary poori lehenge mein chali jayegi", isOwn: true },
            { text: "aur alag alag outfit chahiye har shaadi ke liye", isOwn: false },
            { text: "same color repeat nahi kar sakte, log kya kahenge", isOwn: true },
            { text: "chandni chowk chalte hai weekend pe?", isOwn: false },
            { text: "haan chal, bargaining karna seekhna padega", isOwn: true },
            { text: "bargaining toh meri mummy se better koi nahi karta", isOwn: false },
            { text: "toh mummy ko bhi le chalte hai phir", isOwn: true }
        ]
    },
    {
        name: "Startup talk",
        messages: [
            { text: "bhai idea aaya ek startup ka", isOwn: false },
            { text: "phir se? kal wala toh fail ho gaya tha", isOwn: true },
            { text: "arey woh toh brainstorming tha. yeh pakka chalega", isOwn: false },
            { text: "bol kya hai idea", isOwn: true },
            { text: "AI wala chaiwala. robot cutting chai banayega", isOwn: false },
            { text: "pagal hai kya?? chai mein soul chahiye, AI nahi", isOwn: true },
            { text: "tu samjhega nahi, yeh billion dollar idea hai", isOwn: false },
            { text: "ja pehle apna resume update kar", isOwn: true }
        ]
    },
    {
        name: "Daily life",
        messages: [
            { text: "aaj phir se office late pahucha", isOwn: false },
            { text: "kya hua, metro miss ho gayi?", isOwn: true },
            { text: "nahi auto wale ne extra paise maange", isOwn: false },
            { text: "classic auto wala move", isOwn: true },
            { text: "15 minute tak argue kiya, 10 rupaye bachaye", isOwn: false },
            { text: "bhai 10 rupaye ke liye 15 min? worth it tha?", isOwn: true },
            { text: "principle ki baat hai bhai, principle", isOwn: false }
        ]
    },
    {
        name: "Exam stress",
        messages: [
            { text: "bhai kal exam hai aur kuch nahi padha", isOwn: false },
            { text: "same haal hai mera bhi, raat bhar jagenge", isOwn: true },
            { text: "ek raat mein poora semester cover karna hai", isOwn: false },
            { text: "important questions pe focus kar, poora nahi hoga", isOwn: true },
            { text: "tere paas notes hai kya??", isOwn: false },
            { text: "bhejta hu pdf, par 3 chapter hi likhe hai maine", isOwn: true },
            { text: "3 bhi kaafi hai bhai, bhagwan tujhe pass kare", isOwn: false }
        ]
    },
    {
        name: "Canteen plans",
        messages: [
            { text: "chai peene chalega?", isOwn: false },
            { text: "haan chal, wahi canteen wali?", isOwn: true },
            { text: "nahi yaar naye wali try karte hain", isOwn: false },
            { text: "kaunsi? jo nescafe ke saamne khuli hai?", isOwn: true },
            { text: "haan wahi, suna hai samosa bhi achha hai", isOwn: false },
            { text: "done. 10 minute mein mil", isOwn: true },
            { text: "paise leke aana, aaj tu treat dega", isOwn: false },
            { text: "haan haan jaise har baar main deta hu", isOwn: true }
        ]
    },
    {
        name: "Salary discussion",
        messages: [
            { text: "bhai appraisal hua tera?", isOwn: false },
            { text: "haan, 12% hike diya", isOwn: true },
            { text: "arey wah badiya! party toh banti hai", isOwn: false },
            { text: "haan haan is weekend pakka", isOwn: true },
            { text: "mera toh bas 8% aaya, manager hai hi kanjoos", isOwn: false },
            { text: "switch karne ka soch raha hai?", isOwn: true },
            { text: "haan linkedin pe apply toh shuru kar diya", isOwn: false }
        ]
    },
    {
        name: "Festival planning",
        messages: [
            { text: "diwali ke liye kya plan hai?", isOwn: false },
            { text: "ghar jaa raha hu 3 din ki chutti li hai", isOwn: true },
            { text: "mast! patakhe laa raha hai?", isOwn: false },
            { text: "haan Sivakasi se mangwaye hai special wale", isOwn: true },
            { text: "bhai ek box mere liye bhi rakh lena", isOwn: false },
            { text: "tu bhi toh le sakta hai na", isOwn: true },
            { text: "arey mummy ne mana kiya itne paise kharch karne ko", isOwn: false }
        ]
    },
    {
        name: "Traffic rant",
        messages: [
            { text: "bhai yeh bangalore traffic se tang aa gaya hu", isOwn: false },
            { text: "aaj kitna time laga?", isOwn: true },
            { text: "2 ghante. 12km ke liye 2 ghante", isOwn: false },
            { text: "bro that's criminal", isOwn: true },
            { text: "auto mein baitha tha, meter se zyada dimaag ka meter kharab hua", isOwn: false },
            { text: "metro se try kiya kabhi?", isOwn: true },
            { text: "metro station hi 3km door hai ghar se lmao", isOwn: false },
            { text: "toh pehle auto se metro station, phir metro, phir auto. triple combo", isOwn: true }
        ]
    },
    {
        name: "Society WhatsApp",
        messages: [
            { text: "namaste, maintenance dues ka last date kal thi", isOwn: false },
            { text: "ji secretary sahab, bhool gaya tha", isOwn: true },
            { text: "sab log time pe payment karo please", isOwn: false },
            { text: "mere paas toh notice bhi nahi aaya tha", isOwn: true },
            { text: "notice board pe laga hua hai, group pe 3 baar bheja", isOwn: false },
            { text: "arey secretary ji aap aise serious kyu ho rahe ho", isOwn: true },
            { text: "kal tak payment kardo bas", isOwn: false }
        ]
    },
    {
        name: "Job switch",
        messages: [
            { text: "bhai offer letter aagaya", isOwn: false },
            { text: "kya?? konse company se?", isOwn: true },
            { text: "woh bangalore wali startup, 60% hike", isOwn: false },
            { text: "damn congrats bhaiii", isOwn: true },
            { text: "ab resignation daalni hai, nervous ho raha hu", isOwn: false },
            { text: "arey chill maar, manager ko bol diya bas", isOwn: true },
            { text: "notice period 2 mahine ka hai yaar", isOwn: false },
            { text: "koi na, 2 mahine baad toh naya life start", isOwn: true }
        ]
    },
    {
        name: "Momos party",
        messages: [
            { text: "aaj momos khane chalte hai", isOwn: false },
            { text: "konsa wala? lajpat nagar?", isOwn: true },
            { text: "haan woh tandoori momos wala", isOwn: false },
            { text: "bhai muh mein paani aagaya", isOwn: true },
            { text: "teekhi chutney extra lenge aaj", isOwn: false },
            { text: "achha veg ya non-veg?", isOwn: true },
            { text: "half-half, best of both worlds", isOwn: false },
            { text: "done. 6 baje milte hain gate pe", isOwn: true }
        ]
    },
    {
        name: "Bike ride",
        messages: [
            { text: "kal morning ride pe chalega?", isOwn: false },
            { text: "kahan jaana hai?", isOwn: true },
            { text: "soch raha hu murthal, paranthe khane", isOwn: false },
            { text: "mast plan hai, kitne baje nikalna?", isOwn: true },
            { text: "subah 5 baje, traffic se pehle nikal lena", isOwn: false },
            { text: "5 baje toh neend poori bhi nahi hoti", isOwn: true },
            { text: "paranthe ke liye itna toh karna padega", isOwn: false },
            { text: "theek hai, par petrol ke paise tu dega", isOwn: true }
        ]
    },
    {
        name: "Chai pe charcha",
        messages: [
            { text: "ek cutting chai aur sutta, life set hai", isOwn: false },
            { text: "bhai tapri pe mil, 5 min mein aata hu", isOwn: true },
            { text: "aaj kya discussion karna hai?", isOwn: false },
            { text: "politics se lekar cricket tak, sab cover karenge", isOwn: true },
            { text: "ek kaam kar, pehle chai order kar, mai aaya", isOwn: false },
            { text: "bun maska bhi le kya?", isOwn: true },
            { text: "haan haan woh bhi, aur ek biscuit packet", isOwn: false }
        ]
    },
    {
        name: "Gym motivation",
        messages: [
            { text: "bhai gym join kiya maine aaj", isOwn: false },
            { text: "finally! kitne mahine ka liya?", isOwn: true },
            { text: "3 mahine ka, ab consistently jaana hai", isOwn: false },
            { text: "haan par pehle 2 hafte body pain hoga yaad rakhna", isOwn: true },
            { text: "woh toh theek hai, protein lena shuru karu?", isOwn: false },
            { text: "pehle ande kha, supplements baad mein", isOwn: true },
            { text: "theek hai bhai, next month abs dikhenge", isOwn: false },
            { text: "haan haan jaise sabko 1 mahine mein aa jate hai", isOwn: true }
        ]
    },
    {
        name: "Rainy day",
        messages: [
            { text: "bhai aaj toh baarish ne poora mood bana diya", isOwn: false },
            { text: "haan yaar, chai aur pakode ka mann kar raha", isOwn: true },
            { text: "office se nikal aaya kya?", isOwn: false },
            { text: "haan jaldi nikal gaya, sadkon pe paani bhar raha tha", isOwn: true },
            { text: "meri toh bike band ho gayi beech raste mein", isOwn: false },
            { text: "arey yaar, ab kaise pahuchega ghar?", isOwn: true },
            { text: "auto dhundh raha hu, koi mil nahi raha", isOwn: false }
        ]
    },
    {
        name: "Shaadi shopping",
        messages: [
            { text: "didi ki shaadi ke liye shopping karni hai", isOwn: false },
            { text: "oh kab hai shaadi?", isOwn: true },
            { text: "february mein, abhi se tayari shuru", isOwn: false },
            { text: "lehenga final kiya?", isOwn: true },
            { text: "chandni chowk mein ek pasand aaya tha", isOwn: false },
            { text: "kaunsa wala? woh embroidery wala?", isOwn: true },
            { text: "haan, par 25k bola, thoda zyada hai na?", isOwn: false },
            { text: "shaadi ke liye itna toh chalta hai, bargain kar ke dekh", isOwn: true }
        ]
    },
    {
        name: "Phone recharge & mess food",
        messages: [
            { text: "yaar mess ka khana itna bekaar hai aaj kal", isOwn: false },
            { text: "aur batao, daal mein paani zyada hai ya paani mein daal", isOwn: true },
            { text: "kal toh paneer mein sirf 3 tukde the", isOwn: false },
            { text: "phone recharge karaya tune?", isOwn: true },
            { text: "haan, kyu?", isOwn: false },
            { text: "zomato se kuch order karte hai, mess se toh better hi hoga", isOwn: true },
            { text: "sahi bola, dominos ya biryani?", isOwn: false },
            { text: "biryani, double masala wali", isOwn: true }
        ]
    }
];
