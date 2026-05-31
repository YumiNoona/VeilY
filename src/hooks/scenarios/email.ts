export interface EmailScenario {
  name: string;
  subject: string;
  attachment: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    redactName: boolean;
    redactEmail: boolean;
  }>;
  emails: Array<{
    id: string;
    fromParticipantId: string;
    dateTime: string;
    body: string;
  }>;
}

export const emailScenarios: EmailScenario[] = [
  {
    name: "Jeffrey Epstein Files",
    subject: "URGENT: Regarding the travel logs and island guest list",
    attachment: "travel_logs_2008.pdf",
    participants: [
      { id: 'p1', name: "Jeffrey Epstein", email: "je@island.com", redactName: false, redactEmail: false },
      { id: 'p2', name: "Ghislaine Maxwell", email: "gm@london.net", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'May 14, 2008 at 11:42 PM',
        body: "Make sure those files are **encrypted** before the flight tomorrow. We can't afford any leaks regarding the **V.I.P. list**. Check the **Black Book** again for any missing entries."
      }
    ]
  },
  {
    name: "FBI Security Alert",
    subject: "CRITICAL: Potential unauthorized access to federal systems",
    attachment: "incident_report_FBI.docx",
    participants: [
      { id: 'p1', name: "FBI Cyber Division", email: "security@fbi.gov", redactName: false, redactEmail: false },
      { id: 'p2', name: "Agent Mulder", email: "f.mulder@fbi.gov", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Just now',
        body: "Agent, we've detected a breach in the **classified server**. Immediate action is required to secure the **evidence files**. Do not discuss this over unsecured lines."
      }
    ]
  },
  {
    name: "Corporate Resignation",
    subject: "Resignation - Rohan Gupta",
    attachment: "",
    participants: [
      { id: 'p1', name: "Rohan Gupta", email: "rohan.g@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "HR Department", email: "hr@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 10:00 AM',
        body: "Hi Team,\n\nPlease accept this email as formal notification that I am resigning from my position as Senior Developer. My last day will be October 15th. Thank you for the opportunities during my time here."
      }
    ]
  },
  {
    name: "Job Offer",
    subject: "Offer Letter: Software Engineer - Veily",
    attachment: "Offer_Letter_Veily.pdf",
    participants: [
      { id: 'p1', name: "Sarah Jenkins", email: "s.jenkins@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Ananya Singh", email: "ananya.s@gmail.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday',
        body: "Hi Ananya,\n\nWe were incredibly impressed with your technical rounds! Included is your official offer letter for the Software Engineer position. We'd love to have you join the team."
      }
    ]
  },
  {
    name: "Partnership Inquiry",
    subject: "Collaboration Opportunity: AI Integration for Enterprise",
    attachment: "partnership_deck_Q3.pdf",
    participants: [
      { id: 'p1', name: "David Kim", email: "david.kim@techcorp.com", redactName: false, redactEmail: false },
      { id: 'p2', name: "Partnerships Team", email: "partnerships@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jun 1, 2026 at 2:15 PM',
        body: "Hi Partnerships Team,\n\nI'm reaching out on behalf of TechCorp to discuss a potential **strategic partnership**. We've been following Veily's growth and believe our **AI infrastructure** could complement your platform beautifully. Would love to schedule a 30-minute call this week to explore synergies.\n\nBest,\nDavid"
      }
    ]
  },
  {
    name: "Newsletter Welcome",
    subject: "Welcome to the Veily Weekly Digest! 🎉",
    attachment: "",
    participants: [
      { id: 'p1', name: "Veily Newsletter", email: "newsletter@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "New Subscriber", email: "subscriber@gmail.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 8:00 AM',
        body: "Hey there! 👋\n\nWelcome to the **Veily Weekly Digest** — your curated roundup of everything happening in tech, privacy, and design.\n\nHere's what you can expect every Friday:\n\n- **Top privacy tools** we're loving\n- **Industry insights** from our team\n- **Exclusive tutorials** and early access\n\nReply to this email anytime — we actually read them!\n\nCheers,\nThe Veily Team"
      }
    ]
  },
  {
    name: "Customer Support Thread",
    subject: "Re: Unable to upload profile picture - Error #4521",
    attachment: "error_screenshot.png",
    participants: [
      { id: 'p1', name: "Support Team", email: "support@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Marcus Chen", email: "marcus.chen@gmail.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p2',
        dateTime: 'Today, 3:10 PM',
        body: "Hi,\n\nI've been trying to upload a profile picture for the last hour and keep getting **error #4521**. I've tried on Chrome and Safari, cleared my cache, and used different images. Nothing works. Please help!"
      },
      {
        id: 'e2',
        fromParticipantId: 'p1',
        dateTime: 'Today, 3:25 PM',
        body: "Hi Marcus,\n\nThanks for reaching out! I'm sorry about the trouble. We've identified this as a known issue with images over **5MB** on some browsers. Could you try resizing your image below that threshold? We're deploying a fix this evening to handle larger uploads gracefully.\n\nLet me know if that helps!\n\nBest,\nVeily Support"
      }
    ]
  },
  {
    name: "Invoice Reminder",
    subject: "Payment Due: Invoice #INV-2026-0891",
    attachment: "Invoice_INV-2026-0891.pdf",
    participants: [
      { id: 'p1', name: "Billing Department", email: "billing@agency.co", redactName: false, redactEmail: false },
      { id: 'p2', name: "Alex Rivera", email: "alex@freelance.dev", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'May 30, 2026 at 9:00 AM',
        body: "Dear Alex,\n\nThis is a friendly reminder that your invoice **#INV-2026-0891** for **$4,200** is due on June 5, 2026. The project — Q2 Dashboard Redesign — was completed and signed off on May 15th.\n\nPayment can be made via wire transfer or ACH. Details are on the attached invoice.\n\nPlease confirm receipt.\n\nRegards,\nBilling Team"
      }
    ]
  },
  {
    name: "Event Invitation",
    subject: "You're Invited: Veily Launch Party - June 15th",
    attachment: "event_invite.ics",
    participants: [
      { id: 'p1', name: "Events Team", email: "events@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Priya Sharma", email: "priya.s@startup.in", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'May 28, 2026 at 11:00 AM',
        body: "Hey Priya! 🥂\n\nYou're cordially invited to the **Veily 2.0 Launch Party** on June 15th at 7 PM. Join us for an evening of:\n\n- **Live demos** of our new features\n- **Open bar** and curated appetizers\n- **Networking** with founders and investors\n\n**Venue:** The Glasshouse, 214 Innovation Drive, San Francisco\n**Dress code:** Smart casual\n\nRSVP by replying to this email or using the calendar invite attached. We'd love to see you there!"
      }
    ]
  },
  {
    name: "Holiday Auto-Reply",
    subject: "Auto-reply: Out of Office - Returning June 10th",
    attachment: "",
    participants: [
      { id: 'p1', name: "Tyler Smith", email: "tyler.s@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Random Sender", email: "random@example.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jun 1, 2026 at 12:01 AM',
        body: "Hi there!\n\nThanks for your email. I'm currently **out of office** on vacation and will have **limited access to email** until June 10th.\n\nIf your matter is urgent, please contact:\n- **Emma Wilson** (emma.w@veily.app) for product questions\n- **Support Team** (support@veily.app) for technical issues\n\nOtherwise, I'll get back to you as soon as I return. Have a great week!\n\nCheers,\nTyler"
      }
    ]
  },
  {
    name: "Meeting Minutes",
    subject: "Q3 Planning Sync — Meeting Notes & Action Items",
    attachment: "Q3_Planning_Notes.docx",
    participants: [
      { id: 'p1', name: "Emma Wilson", email: "emma.w@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Engineering Team", email: "eng@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 4:00 PM',
        body: "Hi everyone,\n\nThanks for the productive Q3 planning session! Here's a summary:\n\n**Key Decisions:**\n- Launch **dark mode** by July 15th\n- Migrate to **React 19** in August\n- Begin user research for **mobile app** in September\n\n**Action Items:**\n- @Alex — Finalize dark mode design specs (due June 7)\n- @Rohan — Audit current dependencies for React 19 compatibility (due June 14)\n- @Priya — Prepare user research survey draft (due June 21)\n\nPlease review the attached notes and let me know if I missed anything.\n\nBest,\nEmma"
      }
    ]
  },
  {
    name: "Password Reset",
    subject: "Verify Your Identity — Password Reset Request",
    attachment: "",
    participants: [
      { id: 'p1', name: "Security Bot", email: "no-reply@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Kavya Iyer", email: "kavya.iyer@gmail.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Just now',
        body: "Hi Kavya,\n\nWe received a request to reset the password for your Veily account. If this was you, click the link below to create a new password:\n\n[**Reset Your Password**](https://veily.app/reset?token=abc123)\n\nThis link will **expire in 1 hour**. If you didn't request this, you can safely ignore this email — your account is secure.\n\nStay safe,\nVeily Security Team"
      }
    ]
  },
  {
    name: "Project Deadline Extension",
    subject: "Re: Sprint 24 Delivery — Extension Request",
    attachment: "",
    participants: [
      { id: 'p1', name: "Rahul Mehta", email: "rahul.m@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Project Manager", email: "pm@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 1:30 PM',
        body: "Hi PM Team,\n\nI'm requesting a **48-hour extension** on the Sprint 24 deliverables. The **payment gateway integration** with Stripe has uncovered some edge cases in our billing system that need additional testing. We've already handled 80% of the issues — the remaining work involves writing comprehensive **integration tests** and updating documentation.\n\nNew proposed deadline: **June 3rd, 6 PM**.\n\nHappy to jump on a quick call to discuss if needed.\n\nThanks,\nRahul"
      }
    ]
  },
  {
    name: "Referral Request",
    subject: "Quick Favor: Referral for SWE Role at Google",
    attachment: "Resume_Ananya_Singh.pdf",
    participants: [
      { id: 'p1', name: "Ananya Singh", email: "ananya.s@gmail.com", redactName: false, redactEmail: false },
      { id: 'p2', name: "Rohan Gupta", email: "rohan.g@google.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday, 9:15 PM',
        body: "Hey Rohan! 👋\n\nHope you're doing well! I saw that Google has a **Software Engineer, Frontend** opening that I'm really excited about. I know you've been there for a couple of years now — would you be open to submitting a **referral** for me?\n\nI've attached my updated resume. The job ID is **G-2026-FE-SF** and here's the link: [Google Careers].\n\nTotally understand if it's not possible, just thought I'd ask! Coffee on me next time you're in town either way. ☕\n\nThanks,\nAnanya"
      }
    ]
  },
  {
    name: "Server Downtime Notice",
    subject: "Scheduled Maintenance: Platform Downtime - June 8th 2AM UTC",
    attachment: "",
    participants: [
      { id: 'p1', name: "Infrastructure Team", email: "infra@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "All Users", email: "all-users@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jun 1, 2026 at 6:00 AM',
        body: "Dear Veily Users,\n\nWe will be performing **scheduled database maintenance** on June 8th, 2026, starting at **2:00 AM UTC**. Expected downtime is **45 minutes**.\n\n**What to expect:**\n- The platform will be **unavailable** during this window\n- All scheduled tasks and notifications will be **queued** and delivered once maintenance completes\n- No data loss is expected — this is a routine upgrade\n\nWe apologize for any inconvenience and appreciate your patience as we work to keep Veily running smoothly.\n\nVeily Infrastructure Team"
      }
    ]
  },
  {
    name: "Conference Acceptance",
    subject: "Congratulations! Your Talk Has Been Accepted — ReactConf 2026",
    attachment: "speaker_guide.pdf",
    participants: [
      { id: 'p1', name: "ReactConf Committee", email: "cfp@reactconf.com", redactName: false, redactEmail: false },
      { id: 'p2', name: "Alex Rivera", email: "alex@arivera.dev", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'May 25, 2026 at 10:30 AM',
        body: "Dear Alex,\n\nWe're thrilled to let you know that your talk — **\"Building Resilient UI: Lessons from 10 Million Renders\"** — has been accepted for **ReactConf 2026**! 🎉\n\nYour session is scheduled for **Day 2 (November 5th) at 2:30 PM** in the main auditorium.\n\n**Next steps:**\n- Review the attached speaker guide\n- Confirm your availability by **June 10th**\n- Submit your final slides by **October 15th**\n\nWe received over 800 submissions this year, and yours stood out for its depth and practical insights. Congratulations again!\n\nReactConf Program Committee"
      }
    ]
  },
  {
    name: "Data Breach Notification",
    subject: "IMPORTANT: Security Incident Notification — Action Required",
    attachment: "",
    participants: [
      { id: 'p1', name: "Chief Security Officer", email: "cso@banksecure.com", redactName: false, redactEmail: false },
      { id: 'p2', name: "Valued Customer", email: "customer@gmail.com", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 7:00 AM',
        body: "Dear Valued Customer,\n\nWe are writing to inform you of a **security incident** that may have involved your personal information.\n\n**What happened:** On May 28th, an unauthorized party gained access to our **customer support database** through a compromised employee credential. The breach was detected and contained within **4 hours**.\n\n**What information was involved:** Names, email addresses, and the last four digits of payment cards. **Full card numbers and passwords were NOT exposed.**\n\n**What we're doing:** We've reset all support portal passwords, engaged a **forensic security firm**, and notified law enforcement.\n\n**What you should do:** Enable **two-factor authentication** on your account and monitor your statements for unusual activity.\n\nWe deeply regret this incident. Please contact us at security@banksecure.com with any questions.\n\nSincerely,\nChief Security Officer"
      }
    ]
  },
  {
    name: "Vendor Negotiation",
    subject: "Re: SaaS Contract Renewal — Counter Proposal",
    attachment: "Updated_Contract_Terms.pdf",
    participants: [
      { id: 'p1', name: "Legal Team", email: "legal@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Sales Rep", email: "sales@cloudsuite.io", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 11:45 AM',
        body: "Hi CloudSuite Team,\n\nThanks for the renewal proposal. After reviewing our actual usage and budget for the upcoming year, we'd like to propose the following:\n\n- **Seats:** Reduce from 50 to 35 (reflecting actual active users)\n- **Term:** 12 months (with a **90-day** opt-out clause)\n- **Rate:** $42/seat/month (matching the current rate, not the proposed $55 increase)\n\nOur usage data shows we're well under the 50-seat threshold, and given our multi-year relationship, we believe **grandfathered pricing** is appropriate.\n\nLooking forward to your thoughts. We'd love to keep this partnership going.\n\nBest,\nVeily Legal"
      }
    ]
  },
  {
    name: "Birthday Celebration",
    subject: "🎂 Happy Birthday, Sarah! — Virtual Card from the Team",
    attachment: "birthday_e_card.gif",
    participants: [
      { id: 'p1', name: "Team Veily", email: "team@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Sarah Jenkins", email: "sarah.j@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today, 12:00 AM',
        body: "Happy Birthday, Sarah! 🎉🎈\n\nThe entire Veily team wanted to wish you the most amazing day. Your **leadership** and **positivity** make every standup better (and we all know how rare that is 😄).\n\nWe've arranged a little something — check your desk when you come in!\n\n**Birthday fun facts about Sarah:**\n- Started at Veily as the 4th employee\n- Has never lost a Mario Kart race against the team\n- Makes the office's best banana bread (we're still waiting for the recipe)\n\nHave the best day! 🎂\n\n— The Veily Crew"
      }
    ]
  },
  {
    name: "Exit Interview",
    subject: "Re: Exit Interview Confirmation & Offboarding Checklist",
    attachment: "Offboarding_Checklist.pdf",
    participants: [
      { id: 'p1', name: "HR Department", email: "hr@veily.app", redactName: false, redactEmail: false },
      { id: 'p2', name: "Rohan Gupta", email: "rohan.g@veily.app", redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Jun 1, 2026 at 9:30 AM',
        body: "Hi Rohan,\n\nConfirming that your **exit interview** is scheduled for **October 14th at 3:00 PM** with Sarah from HR. This is a casual conversation — we value honest feedback on your experience at Veily.\n\n**Offboarding checklist (due by October 15th):**\n- Return laptop and access badge to IT\n- Complete **knowledge transfer** documentation for your active projects\n- Confirm forwarding email address\n- Submit final expense reports\n\nWe're sad to see you go but wish you the absolute best in your next chapter! Don't be a stranger.\n\nBest,\nVeily HR"
      }
    ]
  }
];
