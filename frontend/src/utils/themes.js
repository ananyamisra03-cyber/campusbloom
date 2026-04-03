export const STORE_ITEMS = [
  { id:1,  name:"Cherry Blossom", emoji:"🌸", cost:100, rarity:"Common",    light:"linear-gradient(135deg,#ffb7c5,#ff8fab,#ffc8d7)",      dark:"linear-gradient(135deg,#3d0010,#6b0020,#2d000a)" },
  { id:2,  name:"Ocean Breeze",   emoji:"🌊", cost:120, rarity:"Common",    light:"linear-gradient(135deg,#e0f7ff,#b3ecff,#cceeff)",      dark:"linear-gradient(135deg,#001520,#002a3d,#001a2c)" },
  { id:3,  name:"Forest Dawn",    emoji:"🌿", cost:130, rarity:"Common",    light:"linear-gradient(135deg,#d4edda,#b8dfc5,#a8d5b5)",      dark:"linear-gradient(135deg,#05160a,#0a2414,#071a0e)" },
  { id:4,  name:"Lemon Sky",      emoji:"🍋", cost:110, rarity:"Common",    light:"linear-gradient(135deg,#fffde7,#fff9c4,#f9f3a8)",      dark:"linear-gradient(135deg,#161300,#252000,#1a1800)" },
  { id:5,  name:"Coffee House",   emoji:"☕", cost:175, rarity:"Uncommon",  light:"linear-gradient(135deg,#f5ece4,#e8d5c4,#d4b8a0)",      dark:"linear-gradient(135deg,#160b03,#261508,#1a0f04)" },
  { id:6,  name:"Breeze",         emoji:"💨", cost:180, rarity:"Uncommon",  light:"linear-gradient(135deg,#e8f5e9,#e3f2fd,#f3e5f5)",      dark:"linear-gradient(135deg,#080f14,#0a1520,#0d0a16)" },
  { id:7,  name:"Sunset Vibe",    emoji:"🌅", cost:200, rarity:"Uncommon",  light:"linear-gradient(135deg,#ffe0d0,#ffccb8,#ffd6a0)",      dark:"linear-gradient(135deg,#2d0800,#4a1000,#3d0c00)" },
  { id:8,  name:"Arctic Frost",   emoji:"❄️",  cost:190, rarity:"Uncommon",  light:"linear-gradient(135deg,#e8f4fd,#d6eeff,#cdeaff)",      dark:"linear-gradient(135deg,#010a12,#011220,#020e18)" },
  { id:9,  name:"Mountain High",  emoji:"🏔️",  cost:210, rarity:"Uncommon",  light:"linear-gradient(135deg,#eceff1,#dde3ea,#cfd8dc)",      dark:"linear-gradient(135deg,#0a0d10,#10151a,#0c1015)" },
  { id:10, name:"Art Studio",     emoji:"🎨", cost:220, rarity:"Uncommon",  light:"linear-gradient(135deg,#fce4ec,#f8bbd9,#e8d5f5)",      dark:"linear-gradient(135deg,#150010,#220018,#180012)" },
  { id:11, name:"Cyberpunk",      emoji:"🔮", cost:320, rarity:"Rare",      light:"linear-gradient(135deg,#e0ffe0,#c8ffff,#e8d0ff)",      dark:"linear-gradient(135deg,#00080f,#000f1e,#040010)" },
  { id:12, name:"Galaxy Theme",   emoji:"🌌", cost:300, rarity:"Rare",      light:"linear-gradient(135deg,#e8d5ff,#d0c0ff,#c8b4ff)",      dark:"linear-gradient(135deg,#030012,#08001e,#060018)" },
  { id:13, name:"Ember Storm",    emoji:"🔥", cost:350, rarity:"Rare",      light:"linear-gradient(135deg,#ffe0c8,#ffd0b0,#ffbfa0)",      dark:"linear-gradient(135deg,#150000,#250300,#1c0000)" },
  { id:14, name:"Deep Sea",       emoji:"🐋", cost:280, rarity:"Rare",      light:"linear-gradient(135deg,#e0f5ff,#c8ecff,#b8e8ff)",      dark:"linear-gradient(135deg,#000a14,#001020,#00091a)" },
  { id:15, name:"Aurora Borealis",emoji:"🌈", cost:500, rarity:"Legendary", light:"linear-gradient(135deg,#e0fff0,#d0f8ff,#e8f0ff,#fff0e0)", dark:"linear-gradient(135deg,#000a08,#00100e,#000820,#080002)" },
  { id:16, name:"Cosmic Candy",   emoji:"🍬", cost:550, rarity:"Legendary", light:"linear-gradient(135deg,#ffe0f0,#e8d0ff,#d0e8ff,#d0ffe8)", dark:"linear-gradient(135deg,#14000c,#0a0018,#000d1e,#001510)" },
  { id:17, name:"Golden Hour",    emoji:"✨", cost:480, rarity:"Legendary", light:"linear-gradient(135deg,#fff9e6,#fff3c8,#ffe8a0,#fff0c8)", dark:"linear-gradient(135deg,#140e00,#221700,#2e1e00,#1c1200)" },
  { id:18, name:"Neon Nights",    emoji:"💜", cost:400, rarity:"Legendary", light:"linear-gradient(135deg,#f0e0ff,#e0ccff,#d8c8ff)",        dark:"linear-gradient(135deg,#09001a,#120030,#0c0022)" },
];

export const getThemeBg = (item, isDark) => {
  if (!item) return null;
  return isDark ? item.dark : item.light;
};

export const RARITY_COLORS = {
  Common: "#6b7280", Uncommon: "#10b981", Rare: "#3b82f6", Legendary: "#f59e0b",
};

export const TH = {
  light: {
    bg: "linear-gradient(135deg,#fdf6ff 0%,#e8f4fd 50%,#fef9f0 100%)",
    card: "rgba(255,255,255,0.88)", cardBorder: "rgba(200,170,255,0.3)",
    text: "#2d1b69", textSub: "#7c6faa", accent: "#a855f7", accent2: "#ec4899",
    navBg: "rgba(255,255,255,0.82)", input: "rgba(255,255,255,0.96)",
    inputBorder: "rgba(168,85,247,0.3)", shadow: "0 4px 20px rgba(168,85,247,0.12)",
    btnGrad: "linear-gradient(135deg,#a855f7,#ec4899)", tag: "rgba(168,85,247,0.08)",
    overlay: "rgba(255,255,255,0.6)",
  },
  dark: {
    bg: "linear-gradient(135deg,#0f0a1e 0%,#1a0f2e 50%,#0d1a2d 100%)",
    card: "rgba(26,16,52,0.92)", cardBorder: "rgba(168,85,247,0.18)",
    text: "#e8d5ff", textSub: "#a78bca", accent: "#c084fc", accent2: "#f472b6",
    navBg: "rgba(10,6,22,0.92)", input: "rgba(16,10,32,0.94)",
    inputBorder: "rgba(192,132,252,0.28)", shadow: "0 4px 20px rgba(0,0,0,0.36)",
    btnGrad: "linear-gradient(135deg,#7c3aed,#db2777)", tag: "rgba(192,132,252,0.12)",
    overlay: "rgba(0,0,0,0.5)",
  },
};

export const NAV = [
  { id:"dashboard",     icon:"🏠", label:"Home" },
  { id:"expenses",      icon:"💰", label:"Expenses" },
  { id:"marks",         icon:"📊", label:"Marks" },
  { id:"calendar",      icon:"📅", label:"Calendar" },
  { id:"studies",       icon:"📚", label:"Studies" },
  { id:"timer",         icon:"⏱️",  label:"Timer" },
  { id:"habits",        icon:"🌱", label:"Habits" },
  { id:"exam_planner",  icon:"📝", label:"Exam Planner" },
  { id:"internships",   icon:"💼", label:"Internships" },
  { id:"extracurriculars", icon:"🎭", label:"Extracurriculars" },
  { id:"materials",     icon:"📁", label:"Materials" },
  { id:"notes",         icon:"✍️",  label:"Notes" },
  { id:"todo",          icon:"✅", label:"To-Do" },
  { id:"store",         icon:"🛍️", label:"Store" },
];

export const QUOTES = [
  { text:"The secret of getting ahead is getting started.", author:"Mark Twain", emoji:"🚀" },
  { text:"It always seems impossible until it's done.", author:"Nelson Mandela", emoji:"💪" },
  { text:"The expert in anything was once a beginner.", author:"Helen Hayes", emoji:"🌱" },
  { text:"Believe you can and you're halfway there.", author:"Theodore Roosevelt", emoji:"✨" },
  { text:"Success is the sum of small efforts, repeated day in and day out.", author:"Robert Collier", emoji:"🏆" },
  { text:"Push yourself — no one else is going to do it for you.", author:"Unknown", emoji:"🔥" },
  { text:"An investment in knowledge pays the best interest.", author:"Benjamin Franklin", emoji:"💡" },
  { text:"Do something today your future self will thank you for.", author:"Unknown", emoji:"🌸" },
  { text:"Strive for progress, not perfection.", author:"Unknown", emoji:"📈" },
  { text:"Consistency transforms average into excellence.", author:"Unknown", emoji:"⭐" },
  { text:"Learning never exhausts the mind.", author:"Leonardo da Vinci", emoji:"🎨" },
  { text:"You've got this. One page, one problem, one day at a time.", author:"CampusBloom", emoji:"🎓" },
  { text:"Mistakes are proof that you are trying.", author:"Unknown", emoji:"🧩" },
  { text:"Every day is a new beginning.", author:"Unknown", emoji:"🌅" },
];

export const WORK_CATS = [
  "📖 Study","💼 Work","🧠 Learning","🎨 Creative",
  "🏋️ Practice","🔬 Research","📝 Writing","⚡ Other",
];

export const STATUS_STYLES = {
  applied:   { label:"Applied",    color:"#3b82f6", emoji:"📤" },
  screening: { label:"Screening",  color:"#f59e0b", emoji:"🔍" },
  interview: { label:"Interview",  color:"#a855f7", emoji:"🗣️" },
  selected:  { label:"Selected",   color:"#10b981", emoji:"🎉" },
  rejected:  { label:"Rejected",   color:"#ef4444", emoji:"❌" },
  ghosted:   { label:"No Response",color:"#6b7280", emoji:"👻" },
};
