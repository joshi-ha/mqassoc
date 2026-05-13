-- Seed: ACST1052 Unit Survival Guide by Isaac Cruikshank
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING)

-- Insert the guide
insert into guides (
  id,
  title,
  slug,
  unit_code,
  unit_name,
  intro,
  final_notes,
  author,
  difficulty,
  year_level,
  published,
  read_time_minutes,
  tags
) values (
  '11111111-1111-1111-1111-111111111111',
  'Guide to ACST1052: Introduction to Actuarial Studies',
  'acst1052-introduction-to-actuarial-studies',
  'ACST1052',
  'Introduction to Actuarial Studies',
  'Reflecting upon my first semester, ACST1052 was a wonderful introduction to the actuarial profession and what it entails. The unit covers a broad range of foundational topics — from probability and statistics to Excel and R — giving you a real taste of what lies ahead in the degree. While it may feel overwhelming at first, the key is to stay on top of the weekly content and not let it pile up. This guide is designed to share what I wish I had known going in.',
  'I wish you the best of luck with your final exams! Remember that everyone around you is going through the same experience, so lean on your peers and don''t be afraid to ask for help. You''ve got this.',
  'Isaac Cruikshank',
  'medium',
  1,
  true,
  5,
  array['ACST1052', 'first year', 'R', 'Excel', 'actuarial']
)
on conflict (id) do nothing;

-- Insert Q&A sections
-- Use fixed UUIDs so re-running is idempotent

insert into guide_sections (id, guide_id, question, answer, display_order) values
(
  '22222222-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'What is the most challenging part of the unit?',
  'The most challenging part of ACST1052 is arguably the R and Excel components, especially if you have little to no prior programming experience. In the first few weeks, tasks that might seem simple — like importing a dataset or running a regression — can feel completely foreign.

The best approach is to start the computing labs early and actually type out the code yourself rather than copying and pasting. Muscle memory matters more than you''d think. The lecturers provide excellent support during consultation hours, and there are often study groups that form around the computing assignments.

The probability content in the second half of the semester is also a step up in abstraction. Don''t wait until the week before the exam to work through the problem sets — do them as they are released.',
  0
),
(
  '22222222-2222-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'How do you balance your academics with everything else?',
  'University life is about much more than just studying, and ACST1052 is a manageable unit if you stay organised. A few things that helped me:

First, block out study time in your calendar at the start of each week rather than studying reactively. Even two focused hours per day will put you well ahead.

Second, get involved in ASSOC early. The social and professional events are genuinely useful — you''ll meet students in later years who can give you frank advice about the degree, and you''ll start building the network that matters once you''re job-seeking.

Third, don''t neglect sleep and exercise. Counterintuitively, students who sleep well tend to retain content better and perform more consistently in exams.',
  1
),
(
  '22222222-3333-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'General Study Tips / Techniques for Content',
  'For the theory content (probability, statistics, and actuarial concepts):

• Summarise each week''s lecture into a one-page cheat sheet. The act of summarising forces you to understand rather than just recognise the material.
• Work through every tutorial question — don''t just read the solutions. Getting stuck and then figuring it out is where the actual learning happens.
• Form a study group of 3–4 people. Explaining a concept to someone else is the fastest way to discover whether you actually understand it.

For the computing components (R and Excel):
• Follow along with every lab exercise in real time — don''t watch passively.
• Keep a personal "code notebook" where you record functions and their usage with your own notes. You''ll refer back to it constantly.
• Practice the past computing assignments under timed conditions in the week before the exam.',
  2
),
(
  '22222222-4444-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Final Exam Study',
  'The final exam for ACST1052 is a mix of theory and applied questions. Here is how I approached the final few weeks:

Week 3 before exam: Complete all outstanding tutorial questions. Identify the 3–4 topics you are least confident in.

Week 2 before exam: Focus intensely on your weak areas. Attempt at least two past papers in full under timed conditions. Review every error carefully — understanding why you got something wrong is more valuable than getting more questions right.

Week 1 before exam: Light revision and consolidation. Re-read your summary cheat sheets. Get your formula sheet ready (if permitted). Don''t cram new content — at this stage, sleep and confidence matter more.

One thing that tripped up many students: the exam often tests your ability to apply concepts in unfamiliar contexts, not just reproduce standard results. Practice explaining your reasoning, not just writing down the answer.',
  3
)
on conflict (id) do nothing;
