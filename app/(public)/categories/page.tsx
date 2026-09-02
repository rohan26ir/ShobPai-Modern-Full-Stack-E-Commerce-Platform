import { categories } from "@/data/categories";
import CategoryCard from "@/components/usable/CategoryCard";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our wide selection of categories to find exactly what you're looking for.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
