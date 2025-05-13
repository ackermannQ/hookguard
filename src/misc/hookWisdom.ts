export const hookWisdoms = [
  "💡 A silent useEffect is a sleeping bug. Always explain your side effects.",
  "🧠 useMemo isn't a performance boost - it's a trade. Spend it wisely.",
  "🌊 Let dependencies flow. Don't resist the linter - understand it.",
  "🕸️ A hook that mutates the world should wear a warning label.",
  "🔄 If your hook re-renders too much, maybe it's trying to tell you something.",
  "🌿 Context is shared soil. Don't poison it with hidden side effects.",
  "🚫 Not every problem is a useEffect problem. Step back, breathe.",
  "🎯 useCallback is a scalpel. Don't swing it like a sword.",
  "🧼 A clean hook needs no explanation. But document it anyway.",
  "📦 Group related logic in hooks - the brain loves coherence.",
  "🧘‍♀️ Calm code reads like a story, not like a spell.",
  "🪞 Side effects reflect the soul of your component. Keep them pure.",
  "🔍 Custom hooks should reveal, not hide, what they're doing.",
  "🕊️ Don't fear duplication. Fear magic that no one understands.",
  "📡 Fetch responsibly: always abort, and never assume the network cares.",
  "⚖️ The fewer dependencies, the fewer regrets.",
  "🌀 If it looks stable but isn't, you need useRef - not state.",
  "🔐 State that escapes the component may never come back.",
  "🧭 useEffect is about direction, not repetition.",
  "🎁 Your hook is a gift to Future You. Wrap it clearly.",
];

export function printHeader(version: string) {
  console.log(`
██   ██  ██████   ██████  ██   ██  ██████  ██    ██  █████  ██████  ██████  
██   ██ ██    ██ ██    ██ ██  ██  ██       ██    ██ ██   ██ ██   ██ ██   ██ 
███████ ██    ██ ██    ██ █████   ██   ███ ██    ██ ███████ ██████  ██   ██ 
██   ██ ██    ██ ██    ██ ██  ██  ██    ██ ██    ██ ██   ██ ██   ██ ██   ██ 
██   ██  ██████   ██████  ██   ██  ██████   ██████  ██   ██ ██   ██ ██████     v${version}

     🧠 Stay mindful. ♻️ Stay clean. 🔥 Hunt complexity.
`);
  console.log(
    "Hook Wisdom: " +
      hookWisdoms[Math.floor(Math.random() * hookWisdoms.length)] +
      "\n\n"
  );
}
