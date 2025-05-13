const zenQuotes = [
  "🏄 All hooks are clean. Glide on, maestro.",
  "🍃 Nothing to fix, nothing to fear.",
  "🧘‍♂️ Your code breathes easy today.",
  "☕ Consider taking a break. You've earned it.",
  "🌤️ Not a cloud in your React sky.",
  "🧽 100% clean. Shine on.",
  "🎯 Focused, pure, effective. Just like your hooks.",
];

export function printEasterEgg() {
  const message = zenQuotes[Math.floor(Math.random() * zenQuotes.length)];
  console.log(`\n${message}`);
}
