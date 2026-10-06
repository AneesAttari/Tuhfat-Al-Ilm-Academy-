import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'nazra',
    slug: 'quran-reading',
    name: 'Quran Reading / Nazra',
    category: 'Foundational Recitation',
    shortDesc: 'Hone your Quran reading skills with guided lessons suitable for beginners and learners who want to improve their recitation.',
    detailedDesc: 'Our Quran Reading (Nazra) course provides systematic, patient instruction for students taking their first steps in reading the Holy Quran or those who wish to correct and polish their reading fluency. Beginning with Arabic letter recognition and phonetics from the Qaida, students progress methodically through connecting letters, vowel markings (Harakat), Tanween, Sukoon, and Madd rules until they read directly from the Holy Quran with confidence, clarity, and correct pronunciation.',
    suitableLearners: 'Beginners of all ages, children starting their Quran journey, and adults wishing to refresh, correct, or build steady reading fluency from the basics.',
    iconName: 'BookOpen',
    features: [
      'Letter recognition & articulation points (Makharij)',
      'Step-by-step Qaida to Quran transition',
      'Phonetic vowel control and fluid recitation'
    ],
    whatYouLearn: [
      'Arabic alphabet recognition, phonetic sounds, and single-letter articulation',
      'Mastery of essential Harakat (Fatha, Kasra, Damma), Tanween, Sukoon, and Tashdeed',
      'Rules of connecting letters into words and smooth continuous sentences',
      'Methodical graduation from foundational Qaida to reading the Holy Quran directly',
      'Proper breath management, stopping points, and natural recitation rhythm',
      'Guided recitation practice of selected short Surahs with individual correction'
    ],
    learningApproach: 'Step-by-step guided recitation with continuous, gentle teacher feedback and repeated vocal practice to ensure proper fluency and eliminate hesitation.',
    classFormat: 'Personalized 1-on-1 online classes (30 to 45 minutes) scheduled at your preferred daily or weekly times across any timezone.',
    benefits: [
      'Build a rock-solid foundation for reciting the Holy Quran accurately',
      'Overcome hesitation, stammering, and pronunciation errors',
      'Patient, qualified teachers experienced with both young children and adult beginners',
      'Flexible scheduling adapted to work, school, and family routines'
    ],
    faq: [
      {
        question: 'Can an absolute beginner who does not know Arabic letters join?',
        answer: 'Yes, absolutely. The course starts from the foundational Qaida level, teaching Arabic alphabet recognition from the very first letter.'
      },
      {
        question: 'How long does it take to start reading from the Quran?',
        answer: 'Most students complete the foundational Qaida and begin reading directly from the Holy Quran within 3 to 6 months, depending on weekly class frequency and regular practice.'
      },
      {
        question: 'Is this course suitable for adult learners?',
        answer: 'Yes. Many adult students join us to correct their pronunciation, eliminate old recitation habits, and gain confidence reading the Quran fluently.'
      },
      {
        question: 'Are classes one-to-one or in groups?',
        answer: 'All our core Nazra classes are conducted one-to-one, ensuring 100% individual attention from the teacher.'
      }
    ],
    published: 1,
    display_order: 1
  },
  {
    id: 'hifz',
    slug: 'hifz-ul-quran',
    name: 'Hifz-ul-Quran',
    category: 'Memorization Program',
    shortDesc: 'A structured learning environment for students working toward memorizing the Holy Quran.',
    detailedDesc: 'The Hifz-ul-Quran program provides a disciplined, structured, and spiritually nurturing atmosphere for students dedicated to memorizing the Holy Quran. Guided by experienced Huffaz, the curriculum balances daily new lessons (Sabaq) with recent lesson retention (Sabaqi) and long-term cumulative revision (Manzil). Each student receives personalized targets and daily attention to maintain strong retention, accuracy, and Tajweed standards.',
    suitableLearners: 'Committed students of all ages who can read the Quran with good fluency and wish to memorize selected Surahs, specific Ajza (Juz), or complete the entire Holy Quran.',
    iconName: 'BookMarked',
    features: [
      'Daily Sabaq and systematic revision',
      'Personalized retention strategies',
      'Continuous progress monitoring and Tajweed verification'
    ],
    whatYouLearn: [
      'Proven Quranic memorization methodologies tailored to individual cognitive capacity',
      'Daily Sabaq: Reciting newly memorized verses with zero errors to the instructor',
      'Daily Sabaqi: Thorough consolidation of verses memorized in the past 7 to 14 days',
      'Daily Manzil: Long-term revision cycles covering previously mastered Ajza to prevent forgetting',
      'Maintaining precise Tajweed and correct Waqf conventions during memorization',
      'Spiritual disciplines, ethics, and habits of preserving the Holy Quran in the heart'
    ],
    learningApproach: 'Daily one-to-one recitation to a certified Hafiz instructor with strict monitoring of retention, phonetic precision, and personalized revision schedules.',
    classFormat: 'Dedicated 1-on-1 daily or 4-5 days/week sessions with structured tracking of Sabaq, Sabaqi, and Manzil.',
    benefits: [
      'Structured memorization roadmap prevents fatigue and memory loss',
      'Daily accountability and motivating guidance from experienced Huffaz',
      'Customized memorization pace suited to school, work, or full-time schedules',
      'Option to memorize specific portions (e.g. Juz Amma, Surah Al-Baqarah, Surah Yaseen) or the entire Quran'
    ],
    faq: [
      {
        question: 'Can I memorize part of the Quran rather than the entire Quran?',
        answer: 'Yes. Many students enroll to memorize specific chapters like Juz Amma, Surah Al-Mulk, Surah Al-Kahf, or Surah Ar-Rahman.'
      },
      {
        question: 'What is required before starting Hifz?',
        answer: 'Students should be able to read the Quran fluently with basic Tajweed before beginning memorization.'
      },
      {
        question: 'How much revision is done daily?',
        answer: 'Equal or greater time is dedicated to revising previous portions (Sabaqi and Manzil) alongside learning new verses to guarantee long-term retention.'
      }
    ],
    published: 1,
    display_order: 2
  },
  {
    id: 'tajweed',
    slug: 'tajweed',
    name: 'Tajweed',
    category: 'Art of Recitation',
    shortDesc: 'Learn the principles of correct Quranic pronunciation and recitation.',
    detailedDesc: 'The Tajweed course is designed for students who can read Arabic but want to perfect their articulation and recite the Holy Quran exactly as it was revealed to Prophet Muhammad (peace be upon him). Through deep study of Makharij (points of articulation), Sifaat (characteristics of letters), rules of Noon and Meem Saakin, Ghunnah, Qalqalah, Idgham, Ikhfa, and Waqf (stopping signs), students transform their recitation into an accurate, melodious, and spiritually moving experience.',
    suitableLearners: 'Learners who already read the Quran but wish to eliminate pronunciation flaws, understand classical Tajweed principles, and recite with accuracy and beauty.',
    iconName: 'Sparkles',
    features: [
      'Makharij & letter articulation rules',
      'Rules of Noon Saakin, Meem Saakin & Madd',
      'Practical recitation correction'
    ],
    whatYouLearn: [
      'Makharij al-Huroof: Precise origin points of all 28 Arabic letters in the throat, tongue, and lips',
      'Sifaat al-Huroof: Permanent and conditional letter characteristics (Hams, Jahr, Isti’la, Istifal, etc.)',
      'Rules of Noon Saakin and Tanween: Izhar, Idgham, Iqlab, and Ikhfa with practical application',
      'Rules of Meem Saakin: Idgham Shafawi, Ikhfa Shafawi, and Izhar Shafawi',
      'Rules of Madd: Obligatory, permissible, and natural lengthening of vowels',
      'Rules of Raa and Lam: Tafkheem (heavy) and Tarqeeq (light) conditions',
      'Rules of Waqf (stopping) and Ibtida (resuming) to maintain the integrity of Quranic meaning'
    ],
    learningApproach: 'Practical talaqqi (oral transmission) and mushafaha (direct listening and correction) where the instructor demonstrates and the student practices until mastery.',
    classFormat: '1-on-1 personalized sessions focusing on practical recitation alongside essential theoretical explanations.',
    benefits: [
      'Recite the Holy Quran with precision according to traditional prophetic rules',
      'Prevent hidden (Khafi) and obvious (Jali) recitation mistakes',
      'Gain confidence reciting aloud in Salah and communal gatherings',
      'Direct individual correction of subtle tongue and throat placements'
    ],
    faq: [
      {
        question: 'Is Tajweed difficult for non-native Arabic speakers?',
        answer: 'Not with proper guidance. Our teachers specialize in training non-native speakers to produce authentic Arabic sounds with patience and exercises.'
      },
      {
        question: 'Do I need to memorize complex Arabic terminology?',
        answer: 'Our priority is practical application in recitation. Theory is explained simply to support correct spoken recitation.'
      },
      {
        question: 'How soon will I notice improvement in my recitation?',
        answer: 'Most students notice marked improvements in pronunciation and letter clarity within the first few weeks of regular classes.'
      }
    ],
    published: 1,
    display_order: 3
  },
  {
    id: 'translation',
    slug: 'quran-translation',
    name: 'Quran Translation',
    category: 'Comprehension',
    shortDesc: 'Develop an understanding of Quranic meanings through guided study.',
    detailedDesc: 'Our Quran Translation and Comprehension course allows students to connect directly with the divine message. Moving beyond recitation alone, this course provides clear word-for-word translation, idiomatic sentence understanding, and essential contextual explanations (Tafsir highlights). Students discover the themes, commands, parables, and timeless guidance of the Quran, enriching their daily Salah and personal faith.',
    suitableLearners: 'Students and adults desiring to comprehend the Quranic message during daily recitation and Salah, deepening their personal connection with Allah SWT.',
    iconName: 'Languages',
    features: [
      'Word-by-word Quranic vocabulary',
      'Contextual verse explanations',
      'Deeper connection with daily prayers'
    ],
    whatYouLearn: [
      'Word-by-word translation and root word analysis of frequently repeated Quranic terms',
      'Clear grammatical breakdown of Quranic sentence structures',
      'Contextual background (Asbab al-Nuzul - reasons for revelation) of key Surahs',
      'Central themes, moral lessons, and spiritual insights of the verses',
      'Understanding the recitations and Surahs recited during daily prayers (Salah)',
      'Connecting Quranic guidance with modern daily life questions'
    ],
    learningApproach: 'Verse-by-verse translation with linguistic explanation, thematic summaries, and interactive discussion of practical lessons.',
    classFormat: '1-on-1 or interactive small group online lessons with structured study sheets and vocabulary lists.',
    benefits: [
      'Understand the meaning of the verses during daily prayers (Salah) and Taraweeh',
      'Build a working vocabulary of common Quranic Arabic words',
      'Engage with the Quran as a direct source of personal guidance and solace',
      'Structured pace adapted to your learning capability'
    ],
    faq: [
      {
        question: 'Do I need to know classical Arabic grammar first?',
        answer: 'No prior Arabic grammar knowledge is required. The course teaches vocabulary and grammar organically through the verses.'
      },
      {
        question: 'Which Surahs are studied first?',
        answer: 'We typically begin with Surah Al-Fatihah and the short Surahs of Juz Amma (frequently recited in prayer), then proceed progressively.'
      },
      {
        question: 'Can I choose specific Surahs to study?',
        answer: 'Yes. In one-to-one classes, you can customize your curriculum to focus on Surahs of your choice.'
      }
    ],
    published: 1,
    display_order: 4
  },
  {
    id: 'islamic-studies',
    slug: 'islamic-studies',
    name: 'Islamic Studies',
    category: 'Core Curriculum',
    shortDesc: 'Learn essential Islamic beliefs, practices, manners, and knowledge.',
    detailedDesc: 'A comprehensive, well-rounded curriculum designed to provide students with authentic, grounded Islamic knowledge. Covering the foundational articles of faith (Aqeedah), the essential rules of daily worship and dealings (Fiqh), the inspiring life and character of Prophet Muhammad (Seerah), and the stories of the noble Prophets and Sahabah. This course equips learners with clear knowledge and strong moral identity.',
    suitableLearners: 'Youth and adult learners seeking a balanced, authentic grounding in Islamic faith, everyday practice, and classical Islamic history.',
    iconName: 'GraduationCap',
    features: [
      'Articles of Islamic faith (Aqeedah)',
      'Fiqh of everyday worship and transactions',
      'Prophetic biography (Seerah)'
    ],
    whatYouLearn: [
      'Aqeedah: The six pillars of Iman (belief in Allah, Angels, Books, Messengers, the Last Day, and Divine Decree)',
      'Fiqh: Essential rulings of Taharah (purification), Salah (prayer), Sawm (fasting), and Zakah',
      'Seerah: Life of Prophet Muhammad (peace be upon him) from early life to the Madinan era',
      'Stories of the Prophets (Qisas al-Anbiya) and noble companions (Sahabah)',
      'Islamic ethics, family rights, honesty, and respectful societal interactions',
      'Contemporary Islamic guidance for living with dignity and faith in modern society'
    ],
    learningApproach: 'Interactive modules combining historical narrative, authentic evidence, practical life examples, and Q&A sessions.',
    classFormat: 'Personalized online classes with customized weekly lessons and age-appropriate study materials.',
    benefits: [
      'Develop a firm, confident Islamic identity grounded in authentic sources',
      'Understand the wisdom behind Islamic commands and prohibitions',
      'Gain clarity on everyday religious questions and obligations',
      'Compassionate teachers ready to answer questions openly'
    ],
    faq: [
      {
        question: 'Is the syllabus suitable for youth living in Western countries?',
        answer: 'Yes. The curriculum is specifically curated to help young Muslims navigate everyday challenges while preserving strong faith and manners.'
      },
      {
        question: 'Can this course be combined with Quran reading?',
        answer: 'Yes! Many students enroll in a blended plan combining 20 minutes of Quran with 20 minutes of Islamic studies.'
      }
    ],
    published: 1,
    display_order: 5
  },
  {
    id: 'basic-knowledge',
    slug: 'basic-islamic-knowledge',
    name: 'Basic Islamic Knowledge',
    category: 'Essentials',
    shortDesc: 'Build a strong foundation in everyday Islamic knowledge.',
    detailedDesc: 'The Basic Islamic Knowledge course provides practical, step-by-step guidance on the essential daily duties every Muslim needs to know. From how to perform Wudu and Ghusl with proper Sunnah methods, to performing the five daily prayers (Salah) with correct postures, recitations, and timings. Students also learn Halal and Haram boundaries, basic food guidelines, and foundational Islamic terminology.',
    suitableLearners: 'Reverts, beginners, and young students building the core essentials of Islamic practice and daily obligations.',
    iconName: 'Compass',
    features: [
      'Salah (Prayer) fundamentals & practical postures',
      'Rules of purity, Wudu and Ghusl',
      'Everyday Islamic obligations and boundaries'
    ],
    whatYouLearn: [
      'Step-by-step practical demonstration of Wudu (ablution) and Taharah (purity)',
      'The five daily prayers (Salah): positions, recitations, Tashahhud, and Dua Qunoot',
      'How to avoid common prayer mistakes and what invalidates prayer',
      'Essential Islamic terms, greetings, and daily phrases',
      'Basic Halal and Haram principles in food, earnings, and personal conduct',
      'The Five Pillars of Islam and their practical meaning in a Muslim’s daily routine'
    ],
    learningApproach: 'Clear step-by-step practical coaching, audio-visual posture demonstrations, and friendly recitation practice.',
    classFormat: '1-on-1 flexible sessions designed to ensure comfort, privacy, and thorough comprehension.',
    benefits: [
      'Complete confidence in performing daily Wudu and Salah correctly',
      'Overcome uncertainty regarding purification and prayer rulings',
      'Supportive, non-judgmental learning atmosphere for beginners',
      'Practical guidance that can be immediately applied each day'
    ],
    faq: [
      {
        question: 'I am a new Muslim. Will this course start from zero?',
        answer: 'Yes. We begin with the very basics without assuming any prior background, moving at your comfortable pace.'
      },
      {
        question: 'Will the teacher check my prayer recitation and postures?',
        answer: 'Yes. The teacher will listen to your recitations and guide you on the exact postures of Ruku, Sujood, and Tashahhud.'
      }
    ],
    published: 1,
    display_order: 6
  },
  {
    id: 'islah',
    slug: 'islah-character-development',
    name: 'Islah / Character Development',
    category: 'Tarbiyah',
    shortDesc: 'Learn Islamic manners, discipline, character, and personal development.',
    detailedDesc: 'Focuses on the ethical heart of Islam: cultivating humility, honesty, patience, forgiveness, respect for parents, and eliminating harmful habits in line with Islamic morals. Students learn to cultivate virtues such as humility, honesty, gratitude, filial piety (respect for parents), and forgiveness, while identifying and curing harmful spiritual traits like anger, jealousy, arrogance, and dishonesty.',
    suitableLearners: 'Children, teenagers, and adults aiming for personal spiritual refinement and refined Islamic etiquette (Adab).',
    iconName: 'HeartHandshake',
    features: [
      'Islamic etiquette (Adab) in daily life',
      'Cultivating honesty, patience & humility',
      'Family values and respectful conduct'
    ],
    whatYouLearn: [
      'Islamic etiquette (Adab) in speech, listening, eating, and interacting with others',
      'Cultivating patience (Sabr), gratitude (Shukr), and reliance upon Allah (Tawakkul)',
      'The high status and rights of parents, relatives, and neighbors',
      'Controlling anger, avoiding backbiting (Gheebah), lying, and ill speech',
      'Purification of the heart from jealousy (Hasad), pride (Kibr), and showing off (Riya)',
      'Personal discipline, time management, and consistency in good deeds'
    ],
    learningApproach: 'Reflective learning through Prophetic traditions, practical self-evaluation, and constructive mentor coaching.',
    classFormat: '1-on-1 mentoring sessions focusing on character transformation and real-world application.',
    benefits: [
      'Transform theoretical Islamic knowledge into beautiful, visible behavior',
      'Strengthen family harmony and respectful communication at home',
      'Develop inner peace, emotional maturity, and self-restraint',
      'Equip youth with moral resilience against negative peer pressure'
    ],
    faq: [
      {
        question: 'Can parents discuss specific behavioral goals for their child?',
        answer: 'Yes. Our instructors work closely with parents to address specific areas of focus like respect, discipline, or anger management.'
      },
      {
        question: 'Is this course relevant for adults?',
        answer: 'Very much so. Spiritual purification and character refinement are lifelong obligations for every believer.'
      }
    ],
    published: 1,
    display_order: 7
  },
  {
    id: 'dua-sunnah',
    slug: 'dua-and-sunnah',
    name: 'Dua and Sunnah',
    category: 'Daily Practice',
    shortDesc: 'Learn important daily duas and Sunnah practices.',
    detailedDesc: 'Memorize and understand authentic supplications for waking up, sleeping, entering the home, eating, traveling, as well as morning and evening protection Adhkar. Students discover the beauty of reviving prophetic Sunnahs in their day-to-day routines, memorizing authentic words of remembrance with proper pronunciation and understanding.',
    suitableLearners: 'Learners of all age groups wishing to revive prophetic Sunnahs and authentic remembrance in their day-to-day routines.',
    iconName: 'Sun',
    features: [
      'Essential daily occasion supplications',
      'Morning and evening protection Adhkar',
      'Practical Sunnah manners and routines'
    ],
    whatYouLearn: [
      'Morning and evening protection supplications (Adhkar al-Sabah wal-Masaa)',
      'Duas for daily routines: waking up, sleeping, bathroom entry/exit, dressing, and eating',
      'Duas for entering/leaving the mosque, home, and marketplace',
      'Supplications for traveling, anxiety, distress, seeking forgiveness (Istighfar), and illness',
      'Practical Sunnah habits in hygiene, eating, drinking, sleeping, and speaking',
      'Etiquettes and optimal conditions for having Duas accepted by Allah SWT'
    ],
    learningApproach: 'Memorization with correct pronunciation, understanding word meanings, and daily habit tracking.',
    classFormat: '1-on-1 sessions with audio guides, memory cards, and practical review.',
    benefits: [
      'Fill your daily hours with the remembrance of Allah and divine protection',
      'Revive prophetic Sunnahs that bring tranquility into your home',
      'Memorize short, powerful Duas that are easy to remember and recite',
      'Understand the deep spiritual meaning of what you ask Allah for'
    ],
    faq: [
      {
        question: 'Are all the Duas taught authentic?',
        answer: 'Yes. All supplications are sourced directly from the Holy Quran and authentic Hadith collections (Sahih al-Bukhari, Muslim, Abu Dawood, etc.).'
      },
      {
        question: 'Will children receive help memorizing the Arabic text?',
        answer: 'Yes. Teachers practice repetitive recitation with children until the Dua is memorized fluently with correct pronunciation.'
      }
    ],
    published: 1,
    display_order: 8
  },
  {
    id: 'children',
    slug: 'childrens-islamic-education',
    name: "Children's Islamic Education",
    category: 'Youth Focused',
    shortDesc: 'Engaging and age-appropriate Islamic learning for children.',
    detailedDesc: 'Crafted with patience and warm encouragement to give young children a joyful introduction to the Quran, short Surahs, inspiring prophetic stories, and foundational Islamic manners. We recognize that children learn best when encouraged with warmth, patience, and positive reinforcement, setting them up for a lifetime of love for Islam.',
    suitableLearners: 'Young learners aged 4 to 15 requiring gentle guidance, interactive pacing, and positive reinforcement.',
    iconName: 'Baby',
    features: [
      'Child-friendly teaching pace and methods',
      'Moral stories from the Quran & Seerah',
      'Supportive, encouraging, stress-free atmosphere'
    ],
    whatYouLearn: [
      'Interactive, stress-free Qaida and Quran reading lessons',
      'Memorization of Juz Amma short Surahs with correct Tajweed',
      'Captivating stories of the Prophets (Adam, Nuh, Ibrahim, Musa, Isa, Muhammad PBUT)',
      'Everyday Islamic manners: kindness to parents, honesty, sharing, and clean habits',
      'Basic daily Duas (eating, sleeping, leaving home, greeting)',
      'How to perform Wudu and pray Salah with enthusiasm and understanding'
    ],
    learningApproach: 'Gamified milestones, positive reinforcement, moral storytelling, and child-friendly pacing that prevents burnout.',
    classFormat: '1-on-1 online classes (30 minutes) designed to maintain young attention spans with interactive pacing.',
    benefits: [
      'Nurtures a natural love for the Quran and Islam in your child’s heart',
      'Paves the way for strong character, respectful behavior, and Islamic values',
      'Friendly, background-checked teachers trained in teaching young children',
      'Regular progress updates and feedback shared with parents'
    ],
    faq: [
      {
        question: 'My child is energetic and gets easily distracted. Can your teachers handle this?',
        answer: 'Yes. Our teachers specialize in keeping young students engaged with varied pacing, stories, encouragement, and shorter 30-minute sessions.'
      },
      {
        question: 'Can I choose between a male or female teacher for my child?',
        answer: 'Yes. Female and male teachers are available to accommodate family preferences.'
      }
    ],
    published: 1,
    display_order: 9
  },
  {
    id: 'one-to-one',
    slug: 'one-to-one-classes',
    name: 'One-to-One Classes',
    category: 'Personalized Coaching',
    shortDesc: "Personalized online learning according to the student's level and goals.",
    detailedDesc: 'Dedicated one-to-one class slots allowing 100% individual teacher focus, flexible schedule arrangements, and a course pace customized exactly to your learning capacity. Whether you are a busy professional with unpredictable hours, an adult learner desiring privacy, a parent wanting dedicated focus for your child, or a student seeking rapid progress, this bespoke format fits your needs.',
    suitableLearners: 'Busy professionals, learners wanting accelerated progress, or students needing focused individual attention.',
    iconName: 'UserCheck',
    features: [
      '100% individual teacher focus',
      'Flexible scheduling across timezones',
      'Tailored syllabus and pacing'
    ],
    whatYouLearn: [
      'Customized syllabus based on your current level assessment and personal goals',
      'Option to combine multiple subjects (e.g. Quran recitation + Tajweed + Islamic Studies)',
      '100% individual attention with immediate phonetic correction and feedback',
      'Accelerated or relaxed pacing aligned exactly with your learning capacity',
      'Dedicated schedule tailored to your exact work, school, or timezone requirements',
      'Continuous one-on-one progress review and personalized homework plans'
    ],
    learningApproach: 'Bespoke individual curriculum where the teacher adapts the teaching style, pacing, and materials specifically to the student’s learning style.',
    classFormat: '1-on-1 private video/audio sessions (30, 45, or 60 minutes) at mutually agreed times across any timezone.',
    benefits: [
      'Zero wasted time—every session is entirely devoted to your specific progress',
      'Complete flexibility to reschedule or adjust class timings as needed',
      'Comfortable, private environment for adult brothers and sisters',
      'Fast-track your learning journey at twice the speed of group classes'
    ],
    faq: [
      {
        question: 'Can I change my schedule if my work shift changes?',
        answer: 'Yes. We offer schedule flexibility to accommodate shifting work and academic commitments with advance notice.'
      },
      {
        question: 'Can I study more than one course in my one-to-one classes?',
        answer: 'Yes! Many students dedicate half of their class to Quran reading and the other half to Dua & Sunnah or Islamic Studies.'
      }
    ],
    published: 1,
    display_order: 10
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  const normalized = slug.toLowerCase().replace(/^\/|\/$/g, '');
  return COURSES.find((c) => c.slug === normalized || c.id === normalized);
}

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id || c.slug === id);
}

export function getRelatedCourses(currentSlug: string, count: number = 3): Course[] {
  return COURSES.filter((c) => c.slug !== currentSlug && c.id !== currentSlug).slice(0, count);
}
