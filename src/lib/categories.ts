export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Saúde • Diário": { bg: "bg-fuchsia-500/10", text: "text-fuchsia-500" },
  "Trabalho • Foco": { bg: "bg-purple-600/10", text: "text-purple-600" },
  "Fitness": { bg: "bg-[#FF6B6B]/10", text: "text-[#FF6B6B]" },
  "Desenvolvimento": { bg: "bg-[#EAB308]/10", text: "text-[#EAB308]" },
  "Lazer": { bg: "bg-indigo-500/10", text: "text-indigo-500" },
  "default": { bg: "bg-[#27272A]", text: "text-[#A1A1AA]" }
};

export const getCategoryColor = (category?: string) => {
  if (!category) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}
