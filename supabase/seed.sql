-- Seed data for ASSOC events
-- Run after schema.sql in your Supabase SQL editor

insert into events (
  title, slug, description, long_description,
  event_date, end_date, location, address,
  registration_url, registration_label,
  is_featured, tags, price
) values

(
  'Industry Networking Night 2025',
  'industry-networking-night-2025',
  'Connect with actuarial professionals from Deloitte, PwC, Finity, and more. Bring your resume and come ready to make lasting connections.',
  'ASSOC''s flagship networking event returns for 2025.

Join us for an evening with actuarial professionals from some of Australia''s leading firms — including Deloitte, PwC, Finity, KPMG, and more.

This is your chance to hear directly from industry leaders about what it takes to succeed in the actuarial profession, ask burning questions, and make connections that could shape your career.

Dress code: smart casual. Light refreshments provided. Bring plenty of business cards.',
  now() + interval '14 days',
  now() + interval '14 days' + interval '3 hours',
  'Macquarie University, Building E7B',
  'Balaclava Road, Macquarie Park NSW 2109',
  null,
  'Register Now',
  true,
  array['Networking', 'Professional', 'Careers'],
  'Free'
),

(
  'ASSOC Trivia Night',
  'assoc-trivia-night-2025',
  'Put your actuarial knowledge — and general trivia skills — to the test. Teams of 4–6, prizes for the top three teams!',
  'It''s time to put your brainpower to work — away from the exam hall.

ASSOC Trivia Night is one of our most beloved social events. Form a team of 4–6 and compete across rounds covering actuarial theory, current events, pop culture, and a mystery round.

There are prizes for the top three teams and plenty of laughs along the way. Food and drinks available for purchase on-site.

This event is open to all actuarial students — first years welcome!',
  now() + interval '28 days',
  now() + interval '28 days' + interval '3 hours',
  'The Noodle House, Macquarie Centre',
  '4 Waterloo Road, Macquarie Park NSW 2113',
  null,
  'Register Your Team',
  false,
  array['Social', 'Games'],
  'Free'
),

(
  'Resume & Interview Workshop',
  'resume-interview-workshop-2025',
  'Get personalised feedback on your actuarial CV from senior students and industry professionals before graduate applications open.',
  'Graduate recruitment season is just around the corner — is your resume ready?

Join us for an interactive workshop where you''ll get direct feedback on your CV from senior ASSOC members and actuarial professionals who have been through the graduate recruitment process.

We''ll cover:
- What actuarial firms look for in a graduate resume
- How to structure your experience and academic achievements
- Common mistakes to avoid
- Interview tips and behavioural question practice

Spaces are limited — register early to secure your spot. Bring a printed or digital copy of your resume.',
  now() + interval '42 days',
  now() + interval '42 days' + interval '2 hours',
  'Online (Zoom)',
  null,
  null,
  'Register Now',
  false,
  array['Workshop', 'Careers', 'Professional'],
  'Free'
),

(
  'Welcome BBQ 2025',
  'welcome-bbq-2025',
  'Kick off the year with ASSOC''s annual Welcome BBQ. Meet your fellow actuarial students, chat with the ASSOC cabinet, and enjoy a free sausage sizzle.',
  'Welcome to the new academic year!

Whether you''re a fresh first year or a returning student, our Welcome BBQ is the perfect chance to meet the ASSOC team and connect with your fellow actuarial students before semester gets too hectic.

Enjoy a free sausage sizzle, grab some ASSOC merch, and find out what''s on the calendar for 2025.

No registration required — just show up, say hi, and enjoy the sunshine.',
  now() - interval '60 days',
  now() - interval '60 days' + interval '2 hours',
  'Macquarie University, Central Courtyard',
  'Balaclava Road, Macquarie Park NSW 2109',
  null,
  'RSVP',
  false,
  array['Social', 'Welcome'],
  'Free'
),

(
  'Exam Preparation Session: ACST2001',
  'exam-prep-acst2001-2025',
  'Intensive exam prep session for ACST2001 — Probability & Statistical Inference. Worked examples, past paper questions, and live Q&A.',
  'Feeling nervous about your ACST2001 exam? You''re not alone.

ASSOC is hosting a focused exam preparation session led by high-achieving senior students who have excelled in ACST2001.

The session will cover:
- Key probability concepts and distributions
- Statistical inference methods
- Worked solutions to past exam questions
- Tips for maximising marks under time pressure

Attendance is free for all ASSOC members. Non-members are welcome for a $5 contribution.

Bring your notes, past papers, and questions.',
  now() - interval '30 days',
  now() - interval '30 days' + interval '3 hours',
  'Macquarie University, W5A 205',
  'Balaclava Road, Macquarie Park NSW 2109',
  null,
  'Register Now',
  false,
  array['Academic', 'Study', 'Workshop'],
  'Free for members'
),

(
  'End of Year Celebration',
  'end-of-year-celebration-2025',
  'Celebrate surviving another year of actuarial studies with the ASSOC end-of-year dinner and awards night.',
  'You made it through another year — time to celebrate!

Join us for ASSOC''s annual End of Year Celebration: a formal dinner recognising the achievements of our students and cabinet throughout 2025.

The evening will feature:
- Three-course dinner at a local venue
- ASSOC awards (Most Dedicated Member, Best Cabinet Contribution, and more)
- Farewell to our outgoing cabinet
- A look ahead at 2026

Tickets are limited. Early bird pricing available until two weeks before the event.',
  now() + interval '90 days',
  now() + interval '90 days' + interval '4 hours',
  'Doltone House, Hyde Park',
  '181 Elizabeth Street, Sydney NSW 2000',
  null,
  'Buy Tickets',
  true,
  array['Social', 'Awards', 'Dinner'],
  '$45 early bird / $55 general'
);
