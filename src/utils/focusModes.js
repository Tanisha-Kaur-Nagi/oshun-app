export const FOCUS_MODES = [
  {
    id: "study",
    name: "Study",
    icon: "📚",
    duration: 60,
    color: "#4CAF50",
    description: "Deep focus for studying",
  },
  {
    id: "reading",
    name: "Reading",
    icon: "📖",
    duration: 30,
    color: "#2196F3",
    description: "Focused reading time",
  },
  {
    id: "exercise",
    name: "Exercise",
    icon: "💪",
    duration: 20,
    color: "#FF9800",
    description: "Workout session",
  },
  {
    id: "content",
    name: "Content Creation",
    icon: "✍️",
    duration: 45,
    color: "#9C27B0",
    description: "Creative work time",
  },
  {
    id: "meditation",
    name: "Meditation",
    icon: "🧘",
    duration: 15,
    color: "#00BCD4",
    description: "Mindfulness practice",
  },
  {
    id: "custom",
    name: "Custom",
    icon: "⚙️",
    duration: 25,
    color: "#607D8B",
    description: "Set your own duration",
  },
];

// Calculate reward level based on completion percentage
export const calculateRewardLevel = (completionPercentage) => {
  if (completionPercentage >= 90) {
    return { level: "full", emoji: "🌺", name: "Full Coral Reef" };
  } else if (completionPercentage >= 50) {
    return { level: "medium", emoji: "🪸", name: "Medium Coral" };
  } else if (completionPercentage >= 30) {
    return { level: "small", emoji: "🌱", name: "Small Coral" };
  } else {
    return { level: "none", emoji: "❌", name: "No Reward" };
  }
};
