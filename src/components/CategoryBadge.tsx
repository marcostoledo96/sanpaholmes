

interface CategoryBadgeProps {
  category: string;
}

const categoryLabels: Record<string, string> = {
  'merienda-bebidas': 'MERIENDA - Bebidas',
  'merienda-dulces': 'MERIENDA - Dulces',
  'merienda-salados': 'MERIENDA - Salados',
  'cena-bebidas': 'CENA - Bebidas',
  'cena-comidas': 'CENA - Comidas',
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <div className="inline-block bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black px-4 py-1.5 text-xs uppercase tracking-wider rounded-lg shadow-md">
      {categoryLabels[category] || category}
    </div>
  );
}