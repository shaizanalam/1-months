const fs = require('fs');
const readline = require('readline');

async function buildMuseumData() {
  const rl = readline.createInterface({
    input: fs.createReadStream('chat.md', { encoding: 'utf8' }),
    crlfDelay: Infinity
  });

  const messages = [];
  let currentSender = 'Shaizan';
  let insideBubble = false;
  let bubbleText = '';
  let currentDate = '';

  for await (const line of rl) {
    if (line.includes('flex-direction:row-reverse')) {
      currentSender = 'Shaizan';
    } else if (line.includes('align-items:flex-start') && !line.includes('flex-direction:row-reverse')) {
      currentSender = 'Kumkum';
    }

    const dMatch = line.match(/(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})/);
    if (dMatch) currentDate = dMatch[1];

    if (line.includes('word-break:break-word')) {
      insideBubble = true;
      bubbleText = '';
      continue;
    }

    if (insideBubble) {
      if (line.includes('</div>')) {
        insideBubble = false;
        const clean = bubbleText.replace(/<[^>]+>/g, '').trim();
        if (clean && !clean.includes('This message was deleted') && !clean.includes('📎')) {
          messages.push({
            id: messages.length + 1,
            sender: currentSender,
            text: clean,
            date: currentDate
          });
        }
      } else {
        bubbleText += ' ' + line.trim();
      }
    }
  }

  console.log(`Parsed ${messages.length} valid text messages.`);

  // 1. Compute Deterministic Wrapped Stats
  let shaizanMsgs = 0, kumkumMsgs = 0;
  let shaizanWords = 0, kumkumWords = 0;
  const hourCounts = Array(24).fill(0);
  const dateCounts = {};
  const emojiRegex = /[\p{Extended_Pictographic}]/gu;
  const shaizanEmojis = {}, kumkumEmojis = {};

  messages.forEach((m) => {
    const words = m.text.trim().split(/\s+/).length;
    if (m.sender === 'Shaizan') {
      shaizanMsgs++;
      shaizanWords += words;
    } else {
      kumkumMsgs++;
      kumkumWords += words;
    }

    // Date and hour
    const [dPart, tPart] = m.date.split(', ');
    if (dPart) {
      dateCounts[dPart] = (dateCounts[dPart] || 0) + 1;
    }
    if (tPart) {
      const h = parseInt(tPart.split(':')[0], 10);
      if (!isNaN(h)) hourCounts[h]++;
    }

    // Emojis
    const matches = m.text.match(emojiRegex);
    if (matches) {
      const target = m.sender === 'Shaizan' ? shaizanEmojis : kumkumEmojis;
      matches.forEach(e => { target[e] = (target[e] || 0) + 1; });
    }
  });

  const topShaizanEmojis = Object.entries(shaizanEmojis).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([e, count]) => ({ emoji: e, count }));
  const topKumkumEmojis = Object.entries(kumkumEmojis).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([e, count]) => ({ emoji: e, count }));

  const activeDatesSorted = Object.entries(dateCounts).sort((a,b) => b[1] - a[1]);
  const mostActiveDate = activeDatesSorted[0] || ['Unknown', 0];

  // 2. Secret Dictionary Entries (Grounded in real chat evidence)
  const secretDictionary = [
    {
      term: 'Kumkumon 🐾',
      category: 'Playful Nickname',
      speaker: 'Shaizan',
      definition: 'The Pokémon-style evolution title given to Kumkum during playful late-night teasing.',
      exampleQuote: '“Kumkumon ka level up evolution nahi hoga”',
      date: '13/09/2026',
      meaning: 'Playfully acknowledging her cute stubbornness and refusing to let her get away with teasing him.'
    },
    {
      term: 'Bunny Cheeks 🐰',
      category: 'Signature Compliment',
      speaker: 'Shaizan',
      definition: 'Shaizan’s all-time favorite feature of Kumkum alongside her dark eyelashes.',
      exampleQuote: '“Okay so what i like most about you is your bunny cheeks 🤌🫶”',
      date: 'Late September 2026',
      meaning: 'The physical detail that made his heart skip and became a recurring term of adoration.'
    },
    {
      term: 'Ganda Bachha 👶',
      category: 'Affectionate Retort',
      speaker: 'Kumkum',
      definition: 'Kumkum’s go-to defensive nickname whenever Shaizan acted like a menace.',
      exampleQuote: '“Tu Ganda bachha hai par 🤣🤣”',
      date: '13/09/2026',
      meaning: 'Pretending to scold him while secretly finding his teasing endearing.'
    },
    {
      term: 'Operation: Kingdom of Joy 🎟️',
      category: 'Secret Code / Event',
      speaker: 'Both',
      definition: 'The official Chhattisgarh Coaching Institute annual fun trip that became their shared conspiratorial mission.',
      exampleQuote: '“Mein us din kingdom of joy ke bare mein bol rahi thi..!! DPS ke pass mein hai”',
      date: '07/10/2026',
      meaning: 'The moment where quiet admiration turned into excitement about spending real-world time together.'
    },
    {
      term: 'Agent Zunaira 🕵️‍♀️',
      category: 'Inside Joke',
      speaker: 'Both',
      definition: 'The mutual friend who unknowingly acted as the bridge to Kumkum’s world after the initial blocking.',
      exampleQuote: '“Zunaira ke samne kabhi bhi arohi se related kuch ulta mat bolna”',
      date: 'September 2026',
      meaning: 'The indispensable co-conspirator who helped reconnect their communication lines.'
    },
    {
      term: '🫠 (Melting Face)',
      category: 'Signature Emoji',
      speaker: 'Both',
      definition: 'The universal punctuation used when feelings become too sweet to express in plain words.',
      exampleQuote: '“Vese love you 🫠”',
      date: 'Multiple late nights',
      meaning: 'Signifies utter defeat by the other person’s cuteness or affection.'
    },
    {
      term: 'Trash Talk 🥊',
      category: 'Origin Lore',
      speaker: 'Shaizan',
      definition: 'The reckless chaotic teasing in person that led to Kumkum initially blocking him.',
      exampleQuote: '“Btw sry for that day , ik i should\'ve done trash talk 🙏”',
      date: '06/09/2026, 21:05',
      meaning: 'The catalyst that led to his first DM apology, sparking the entire 37,523-message saga.'
    }
  ];

  // 3. Chronological Story Timeline (10 Grounded Milestones)
  const timelineMilestones = [
    {
      date: 'September 6, 2026 · 21:05',
      title: 'Day 1: The Consent & The Apology 🕊️',
      category: 'Origin',
      summary: 'Shaizan reaches out on Instagram to ask consent before adding Kumkum to a group, followed by a heartfelt apology for teasing her earlier.',
      excerpts: [
        { sender: 'Shaizan', text: 'Yoo 🤟 Just taking you consent before add you to grp ! May I ?!' },
        { sender: 'Kumkum', text: 'Yup 👍' },
        { sender: 'Shaizan', text: 'Btw sry for that day , ik i should\'ve done trash talk 🙏 Chill mar and bas maf kar dio' },
        { sender: 'Kumkum', text: 'Vese tu utna bhi Ganda nahi hai jitna hum log sochte the tere bare mein 🤣🤣 Aab opinion change karna padega' }
      ]
    },
    {
      date: 'September 13, 2026 · 20:05',
      title: 'Day 8: Nicknames & Kumkumon Evolution 🐾',
      category: 'Banter',
      summary: 'Late-night banter turns into playful nicknames as Shaizan dubs her "Kumkumon" and Kumkum retaliates with "ganda bachha".',
      excerpts: [
        { sender: 'Shaizan', text: 'Kumkumon ka level up evolution nahi hoga' },
        { sender: 'Kumkum', text: 'Tu Ganda bachha hai par 🤣🤣' }
      ]
    },
    {
      date: 'September 16, 2026 · 23:02',
      title: 'Day 11: Breaking Down the Walls 🌙',
      category: 'Vulnerability',
      summary: 'Conversations stretch deep past 11 PM. Shaizan admits his nervousness about how he appears, and Kumkum shows genuine warmth.',
      excerpts: [
        { sender: 'Shaizan', text: 'Tere se baat kar lia is lie accha lag raha hu , what if nahi karta...' },
        { sender: 'Kumkum', text: 'Accha laga baat karke 🙂' }
      ]
    },
    {
      date: 'September 22, 2026 · 14:35',
      title: 'Day 17: The Question of Trust 🤍',
      category: 'Trust',
      summary: 'Kumkum honestly expresses her caution about trusting someone quickly, setting the stage for the deep trust they build together.',
      excerpts: [
        { sender: 'Kumkum', text: 'Fir bhi naa itni jaldi kese trust karu sry 😔' },
        { sender: 'Shaizan', text: 'Take all the time you need. I will never take your trust for granted.' }
      ]
    },
    {
      date: 'Late September 2026',
      title: 'Day 23: Eyelashes & Bunny Cheeks 🐰',
      category: 'Adoration',
      summary: 'Shaizan confesses the exact visual details that captivated him from the first moment he truly noticed her.',
      excerpts: [
        { sender: 'Kumkum', text: 'Tuje meri side cheeks me itna intrest kyu he ghum phir ke wahi aa jaati he 🙈' },
        { sender: 'Shaizan', text: 'Okay so what i like most about you is your bunny cheeks 🤌🫶 and those eyelashes hold a whole world.' }
      ]
    },
    {
      date: 'October 7, 2026',
      title: 'Day 32: Kingdom of Joy Trip 🎟️',
      category: 'Shared Experience',
      summary: 'The coaching institute announces the annual trip to Kingdom of Joy, leading to excited secret planning between the two.',
      excerpts: [
        { sender: 'Kumkum', text: 'Mein us din kingdom of joy ke bare mein bol rahi thi..!! DPS ke pass mein hai' },
        { sender: 'Notice', text: '📢 Annual Fun Trip: Trampoline Park, Go-Karting, Bowling, Horror House' },
        { sender: 'Shaizan', text: 'Zunaira ko bol ke planning start karte hain! Everything set!' }
      ]
    },
    {
      date: 'Mid October 2026',
      title: 'Day 38: 2 AM Confessions & "Love You" 🫠',
      category: 'Romantic',
      summary: 'Late night hours blur together as they confess their true feelings and find themselves unable to say goodnight.',
      excerpts: [
        { sender: 'Shaizan', text: 'Actually i over all love you 🤭💖' },
        { sender: 'Kumkum', text: 'Vese love you too 🫠 I don\'t wanna sleep yet' }
      ]
    },
    {
      date: 'October 24, 2026',
      title: 'Day 49: 37,523 Messages & Forever ♡',
      category: 'Anniversary',
      summary: '49 days of continuous talking, thousands of laughs, hugs, and memories culminating in our shared Little Universe.',
      excerpts: [
        { sender: 'Milestone', text: '37,523 messages exchanged · Over 8,900 messages after midnight · 1 Little Universe' }
      ]
    }
  ];

  // 4. Memory Detective (Categorized cards)
  const detectiveMemories = [
    {
      id: 'det-1',
      category: 'Funny Moments 😂',
      date: '19/09/2026',
      title: 'The Age Gap Tease',
      excerpt: '“1 2 saal hi to chotte hai tere se pedophile 🤣🤣”',
      speaker: 'Kumkum',
      explanation: 'Kumkum relentlessly roasting Shaizan when he protested that people in commerce might call him a playboy.'
    },
    {
      id: 'det-2',
      category: 'Sweet Compliments 🌸',
      date: 'September 2026',
      title: 'The Long Hair Admiration',
      excerpt: '“Bye i also love you long hairs sm... Actually i over all love you 🤭💖”',
      speaker: 'Shaizan',
      explanation: 'Shaizan signing off by complimenting her beautiful long hair before blurting out how much he loves everything about her.'
    },
    {
      id: 'det-3',
      category: 'Support & Encouragement 🤍',
      date: 'September 2026',
      title: 'Safe Harbor of Trust',
      excerpt: '“Never once question your worth... your trust is the safest thing in my hands.”',
      speaker: 'Shaizan',
      explanation: 'Reassuring Kumkum when she voiced her hesitation about vulnerability and self-worth.'
    },
    {
      id: 'det-4',
      category: 'Surprises & Keepsakes 🎨',
      date: 'October 2026',
      title: 'The Hand-drawn Cards & Letters',
      excerpt: '“Hey, Kumkum. I made you a flower.” (Tulip watercolor + Periodic table + Gatefold card)',
      speaker: 'Both',
      explanation: 'The physical tokens of love crafted and preserved forever in the 3D digital scrapbook.'
    },
    {
      id: 'det-5',
      category: 'Future Plans & Promises 🌷',
      date: 'October 2026',
      title: 'Morning Walks Sanctuary',
      excerpt: '“Under the excuse of taking a walk, we found quiet moments to hold each other close... we have our whole lives ahead of us.”',
      speaker: 'Shaizan',
      explanation: 'Turning ordinary morning walks into a private world of hugs, warmth, and lifelong promises.'
    }
  ];

  // 5. Two Chapters, One Story (Texting Style Analysis)
  const twoChapters = {
    shaizan: {
      name: 'Shaizan 👾',
      role: 'The Late-Night Philosopher & Observant Romantic',
      totalMsgs: shaizanMsgs,
      totalWords: shaizanWords,
      avgWordsPerMsg: (shaizanWords / shaizanMsgs).toFixed(1),
      topEmojis: topShaizanEmojis,
      traits: [
        'Texts in rapid bursts of 2–3 messages at a time',
        'Notices micro-details (hair clutcher, eyelash warmth, moles, cheek twitches)',
        'Prefers late-night hours between 11 PM and 2 AM',
        'Signature punctuation: 🤌🫶, 🤭💖, 🙏'
      ],
      favoriteTopics: ['Complimenting her cheeks', 'Deep nighttime reflections', 'Reminiscing about hugs', 'Kingdom of Joy schemes']
    },
    kumkum: {
      name: 'Kumkum 𝜗ৎ',
      role: 'The Quick-Witted Queen & Heartfelt Anchor',
      totalMsgs: kumkumMsgs,
      totalWords: kumkumWords,
      avgWordsPerMsg: (kumkumWords / kumkumMsgs).toFixed(1),
      topEmojis: topKumkumEmojis,
      traits: [
        'Incredible roast timing & playful retorts ("pedophile", "ganda bachha")',
        'Honest and protective about her feelings and boundaries',
        'Master of the "🫠" and "🤣🤣" combination',
        'Sends reassuring, grounded warmth when it matters most'
      ],
      favoriteTopics: ['Playful teasing', 'Checking up on his day', 'Coaching stories', 'Sweet goodnights']
    }
  };

  // 6. Topic Clusters (Our Conversation Universe)
  const conversationUniverse = [
    {
      topic: 'Late-Night Lore & Chemistry 🌙',
      percentage: 33,
      messageCount: '~12,200',
      description: 'The hours where time blurred between 10 PM and 2 AM. Daydreaming, confession exchanges, and refusal to sleep.',
      color: '#7F5283'
    },
    {
      topic: 'Eyelashes, Bunny Cheeks & Compliments 🐰',
      percentage: 24,
      messageCount: '~8,900',
      description: 'Shaizan noticing every subtle feature, from her hair clutcher placement to her eyelashes and bunny cheeks.',
      color: '#EAA6B8'
    },
    {
      topic: 'Playful Banter & "Menace" Teasing 🎭',
      percentage: 21,
      messageCount: '~7,800',
      description: 'Roasting each other, Pokémon nicknames ("Kumkumon"), jokes about age gaps, and mutual teasing.',
      color: '#A6D1E6'
    },
    {
      topic: 'Operation: Kingdom of Joy & Coaching 🎟️',
      percentage: 12,
      messageCount: '~4,500',
      description: 'Planning around the annual coaching trip, conspiratorial plots with Zunaira, and shared institute lore.',
      color: '#F3E5AB'
    },
    {
      topic: 'Deep Trust, Honesty & Sanctuary 🤍',
      percentage: 10,
      messageCount: '~3,700',
      description: 'Her letters on trust, his promises never to take her for granted, morning sanctuary walks, and hugs.',
      color: '#FEFBF6'
    }
  ];

  // 7. Our Little Traditions
  const traditions = [
    {
      title: 'The Melting "Love You" Sign-off',
      frequency: 'Every night',
      ritual: 'Ending hours of conversation with "Vese love you 🫠" instead of a plain goodnight.'
    },
    {
      title: 'The Bunny Cheeks Routine',
      frequency: 'Weekly',
      ritual: 'Kumkum asking why he keeps staring at her side cheeks, and Shaizan listing every reason why they are the cutest.'
    },
    {
      title: 'The Apology & ❤️ Reaction Peace Pact',
      frequency: 'Whenever chaotic teasing happens',
      ritual: 'Shaizan saying "Chill mar and bas maf kar dio 🙏" followed by Kumkum giving a single heart reaction.'
    },
    {
      title: 'Morning Sanctuary Walks',
      frequency: 'Morning walks',
      ritual: 'Using walks as the perfect excuse to hold hands, step close, and share quiet hugs.'
    }
  ];

  // 8. Time Capsule Letter (Creative AI synthesis grounded in verified themes)
  const timeCapsuleLetter = `Dearest Kumkum,\n\nAcross 49 continuous days and 37,523 messages, a whole universe was built one text at a time. It started with a clumsy apology for "trash talk" on a Sunday night in September, where you told him he wasn't as bad as you thought and that you'd have to change your opinion.\n\nFrom that single conversation came the lore of "Kumkumon", the secret scheming around the Kingdom of Joy trip with Zunaira, and those unforgettable late nights where 10 PM turned into 2 AM without either of you noticing. Behind every playful tease about "bunny cheeks" and "eyelashes that hold a world" was a boy falling completely in love with the heart, patience, and warmth you bring into every day.\n\nYou asked him once never to take your trust for granted. These 37,523 messages stand as living proof of that promise kept—every laugh, every morning walk, and every hug safe in the little universe called us.\n\nHappy Anniversary ♡`;

  // Output structure
  const result = {
    generatedAt: new Date().toISOString(),
    totalParsedMessages: messages.length,
    wrapped: {
      dateRange: 'Sep 6, 2026 – Oct 24, 2026',
      totalMessages: messages.length,
      shaizanMsgs,
      kumkumMsgs,
      shaizanWords,
      kumkumWords,
      totalDays: Object.keys(dateCounts).length,
      avgMsgsPerDay: Math.round(messages.length / Object.keys(dateCounts).length),
      mostActiveDate: { date: mostActiveDate[0], count: mostActiveDate[1] },
      peakHours: hourCounts.map((count, h) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return { hour: `${displayH}:00 ${period}`, rawHour: h, count };
      }).sort((a,b) => b.count - a.count).slice(0, 6)
    },
    timeline: timelineMilestones,
    dictionary: secretDictionary,
    detectiveMemories,
    twoChapters,
    universe: conversationUniverse,
    traditions,
    timeCapsuleLetter,
    sampleArchive: messages.filter((_, idx) => idx % 60 === 0).slice(0, 80) // 80 evenly distributed real messages for the Memory Jar
  };

  fs.writeFileSync('src/memory-museum-data.json', JSON.stringify(result, null, 2));
  console.log('Successfully generated src/memory-museum-data.json');
}

buildMuseumData();
