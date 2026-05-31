import { EmailState } from "@/hooks/useEmailState";

export const EMAIL_TEMPLATES = {
  businessMeeting: {
    subject: 'Re: Thursday standup notes + Q3 deck',
    attachment: 'Q3_Strategy_V2.pdf',
    participants: [
      { id: 'p1', name: 'Sarah Jenkins', email: 's.jenkins@company.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'David Chen', email: 'd.chen@company.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p2',
        dateTime: 'Oct 12, 2023 at 9:15 AM',
        body: 'Hey Sarah,\n\nAttached the revised Q3 deck — made the changes we talked about in standup. Can you take a look before the board meeting tomorrow? Specifically the CAC numbers on slide 9.\n\nThanks,\nDavid'
      },
      {
        id: 'e2',
        fromParticipantId: 'p1',
        dateTime: 'Oct 12, 2023 at 10:30 AM',
        body: 'Got it, pulling it up now. Will ping you on Slack if anything looks off.'
      }
    ]
  } as EmailState,

  newsletterBoost: {
    subject: '4K exports are live (+ your early supporter discount)',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Alpha', email: 'hello@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'James Wilson', email: 'james@designco.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today at 8:45 AM',
        body: 'Hey James,\n\nThe 4K export engine just shipped. You were one of our first 200 users so we\'re locking in 50% off for life — no action needed, it\'s already on your account.\n\nWould love to hear what you think of the new dashboard.\n\n— The Veily team'
      }
    ]
  } as EmailState,

  jobOffer: {
    subject: 'Your offer — Senior Product Designer at Veily',
    attachment: 'Veily_Offer_Details.pdf',
    participants: [
      { id: 'p1', name: 'Alex Rivera', email: 'alex@veily.io', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Jordan Smith', email: 'jordan.smith@gmail.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday at 3:15 PM',
        body: 'Hi Jordan,\n\nReally enjoyed our conversations — the team loved your portfolio, especially the fintech case study.\n\nAttached is your offer letter and benefits summary for the Senior Product Designer role. Take your time reviewing it and feel free to reach out with any questions.\n\nExcited to hopefully have you on board.\n\nAlex'
      }
    ]
  } as EmailState,

  securityAlert: {
    subject: 'New sign-in from Chrome on Windows (San Jose, CA)',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Security', email: 'security@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'You', email: 'user@example.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'January 15, 2024 at 11:42 PM',
        body: 'We noticed a sign-in to your account from a new device.\n\nDevice: Chrome on Windows\nLocation: San Jose, CA\nTime: Jan 15, 2024 at 11:42 PM PST\n\nIf this wasn\'t you, reset your password now and enable 2FA.'
      }
    ]
  } as EmailState,

  partnershipInquiry: {
    subject: 'Quick question re: Veily integration for CreativeCloud',
    attachment: 'Veily_Partnership_Deck.pdf',
    participants: [
      { id: 'p1', name: 'Mark Thompson', email: 'mark@creativecloud.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Sarah Chen', email: 'sarah@veily.app', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Oct 14, 2023 at 2:00 PM',
        body: 'Hi Sarah,\n\nBeen following what you\'re building at Veily — our users keep asking for a native mockup tool and your engine is exactly what we\'d want to integrate.\n\nAttached a short deck on what we\'re thinking. Are you free for a 20 min call next Tuesday?\n\nMark'
      }
    ]
  } as EmailState,

  weeklyReview: {
    subject: 'Re: Week 12 — beta is ready for internal testing',
    attachment: 'Weekly_Report_W12.pdf',
    participants: [
      { id: 'p1', name: 'Leo Martinez', email: 'leo.m@agency.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Client Team', email: 'team@client.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Friday at 4:30 PM',
        body: 'Team,\n\nGood news — we hit all the W12 milestones. Beta is ready for internal testing whenever you are.\n\nQuick highlights:\n- Responsive UI is done across all breakpoints\n- Backend integration wrapped up yesterday\n- 4K export is running ~3x faster than the prototype\n\nFull report attached. Let me know if anything looks off.\n\nLeo'
      }
    ]
  } as EmailState,

  customerSupport: {
    subject: 'Re: Refund for Premium plan (Case #49201)',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Support', email: 'support@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Customer', email: 'customer@gmail.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Dec 05, 2023 at 10:15 AM',
        body: 'Hey there,\n\nYour refund for the Premium annual plan has been processed — should show up in your account within 5-7 business days.\n\nTotally understand if it wasn\'t the right fit. If you have a sec, we\'d love to know what we could do better.\n\nThanks,\nVeily Support'
      }
    ]
  } as EmailState,

  networkingInvite: {
    subject: 'Saw your SaaS mockups post — coffee next week?',
    attachment: '',
    participants: [
      { id: 'p1', name: 'David Lee', email: 'david.lee@startup.io', redactName: false, redactEmail: false },
      { id: 'p2', name: 'You', email: 'me@work.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: '9:30 AM',
        body: 'Hey,\n\nRead your LinkedIn post on the future of SaaS mockups — really resonated with some stuff we\'re working on.\n\nI\'m in town next Tues-Wed, would love to grab a quick coffee if you have 20 mins. No agenda, just curious to hear more about your approach.\n\nDavid'
      }
    ]
  } as EmailState,

  projectKickoff: {
    subject: 'Website redesign — timeline + first steps',
    attachment: 'Project_Timeline.xlsx',
    participants: [
      { id: 'p1', name: 'Emma Watson', email: 'emma@design-agency.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'John Doe', email: 'john@client-group.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Monday at 10:00 AM',
        body: 'Hi John,\n\nExcited to get this started. Attached the timeline we discussed — I padded the QA phase by a week based on your feedback.\n\nCan we do a quick kickoff call Thursday afternoon? I\'ll send a calendar invite.\n\nEmma'
      }
    ]
  } as EmailState,

  supportWelcome: {
    subject: 'You\'re in — here\'s how to get started with Veily',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Support', email: 'support@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'New User', email: 'new@user.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Just now',
        body: 'Welcome to Veily!\n\nYou can start creating mockups right away — no setup needed. Pick a template or start from scratch.\n\nIf anything feels confusing, just reply to this email. We actually read these.'
      }
    ]
  } as EmailState,

  invoiceReminder: {
    subject: 'Reminder: Invoice #INV-2024-001 due in 3 days',
    attachment: 'Invoice_INV-2024-001.pdf',
    participants: [
      { id: 'p1', name: 'Billing Team', email: 'billing@services.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Account Holder', email: 'account@company.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: '2 days ago',
        body: 'Hi there,\n\nJust a heads up — invoice #INV-2024-001 is due on the 18th (3 days from now). PDF attached if you need it.\n\nLet us know if there are any issues with payment.\n\nThanks,\nBilling'
      }
    ]
  } as EmailState,

  formalGreeting: {
    subject: 'Quick intro — Sarah from Global Tech',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Sarah Miller', email: 'sarah.miller@globaltech.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Business Owner', email: 'owner@localbiz.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday',
        body: 'Hi,\n\nI\'m Sarah from Global Tech — we work with small businesses on automation and ops tooling. Found your company through a mutual connection (James Park).\n\nWould love to chat if you\'re open to it. No pressure either way.\n\nBest,\nSarah'
      }
    ]
  } as EmailState,

  holidayReply: {
    subject: 'Automatic reply: Out of Office — Back Jan 5',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Megan Foster', email: 'megan.foster@agency.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Colleague', email: 'colleague@agency.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Dec 22, 2023 at 12:00 PM',
        body: 'Hi there,\n\nThanks for your email! I\'m currently out of the office for the winter holidays and will be back on January 5th.\n\nIf you need immediate assistance, please contact:\n- For client work: Rachel Kim (rachel.k@agency.com)\n- For billing: Accounting (billing@agency.com)\n- For emergencies: Call my cell at (555) 123-4567\n\nOtherwise, I\'ll get back to you as soon as I\'m back. Happy holidays! 🎄\n\nBest,\nMegan'
      }
    ]
  } as EmailState,

  eventInvite: {
    subject: 'You\'re invited: Product Design Meetup — Jan 18',
    attachment: 'Meetup_Flyer.pdf',
    participants: [
      { id: 'p1', name: 'Design Community', email: 'events@designcollective.io', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Community Member', email: 'member@email.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jan 8, 2024 at 11:00 AM',
        body: 'Hey designers! 👋\n\nWe\'re kicking off 2024 with an in-person product design meetup and you\'re invited.\n\n**Details:**\n- Date: Thursday, January 18th\n- Time: 6:00 PM — 8:30 PM\n- Location: The Hive Co-working, 3rd Floor (downtown)\n- Topic: "Designing for AI: Patterns & Pitfalls"\n\nFood and drinks are on us. We\'ve got three amazing speakers lined up and plenty of time to mingle.\n\nSpots are limited to 80 people so RSVP soon — link in the attached flyer.\n\nSee you there!\n\nThe Design Collective Team'
      }
    ]
  } as EmailState,

  teamAnnouncement: {
    subject: '[All Hands] Q4 Results + 2024 Strategy Update',
    attachment: 'Q4_All_Hands_Deck.pdf',
    participants: [
      { id: 'p1', name: 'CEO Office', email: 'ceo@startup.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'All Staff', email: 'all@startup.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jan 3, 2024 at 10:00 AM',
        body: 'Team,\n\nHappy new year! I wanted to share some updates as we kick off 2024.\n\n**Q4 Highlights:**\n- Revenue: $2.1M (+18% QoQ)\n- New customers: 340 businesses\n- NPS score: 72 (up from 64)\n\n**2024 Strategy:**\nWe\'re going all-in on three things this year: enterprise features, international expansion (EU first), and AI-powered workflows. I\'ve attached the full deck with detailed breakdowns.\n\nAll-hands meeting this Friday at 3pm EST — bring questions. Pizza provided for those in-office.\n\nExcited for what we\'ll build together this year.\n\n— Michael'
      }
    ]
  } as EmailState,
};
