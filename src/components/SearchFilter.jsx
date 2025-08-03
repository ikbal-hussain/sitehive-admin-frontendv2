import useToolStore from "../store/toolStore";
import { useEffect } from "react";

const SearchFilter = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setCategory,
    selectedSubCategory,
    setSubCategory,
    categories,
    fetchCategories,
  } = useToolStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Get subcategories for the selected category
  const subCategories =
    categories.find((cat) => cat.name === selectedCategory)?.subCategories || [];

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setSubCategory("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-lg shadow-lg items-center">
      <input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 flex-grow border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
      />
      {/* Category & Subcategory Dropdowns */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Subcategory Dropdown */}
        <select
          value={selectedSubCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={!selectedCategory}
        >
          <option value="">All Subcategories</option>
          {subCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="p-3 bg-red-500 text-white rounded-lg border border-gray-300 hover:bg-red-600 transition duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
