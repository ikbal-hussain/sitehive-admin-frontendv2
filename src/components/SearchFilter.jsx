import useToolStore from "../store/toolStore";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

const SearchFilter = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setCategory,
    selectedSubCategories,
    setSubCategory,
    setSubCategories,
    categories,
    allSubCategories,
    fetchCategories,
  } = useToolStore();

  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Subcategories options based on selected category (if chosen), else all
  const subCategoryOptions = useMemo(() => {
    const scoped = selectedCategory
      ? categories.find((cat) => cat.name === selectedCategory)?.subCategories || []
      : allSubCategories;
    return Array.from(new Set(scoped)).map((s) => ({ value: s, label: s }));
  }, [selectedCategory, categories, allSubCategories]);

  const handleMultiChange = (vals) => {
    const selected = (vals || []).map((v) => v.value);
    setSubCategories(selected);
  };

  const selectedValues = (selectedSubCategories || []).map((s) => ({ value: s, label: s }));

  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`p-2 ${isCompact ? "text-sm" : ""} border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200`}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          className={`p-2 ${isCompact ? "text-sm" : ""} border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200`}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <div>
          <Select
            isMulti
            placeholder="Subcategories"
            classNamePrefix="react-select"
            options={subCategoryOptions}
            value={selectedValues}
            onChange={handleMultiChange}
            isDisabled={!subCategoryOptions.length}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 40,
                borderColor: "#e5e7eb",
                boxShadow: "none",
                "&:hover": { borderColor: "#10b981" },
              }),
              multiValue: (base) => ({ ...base, backgroundColor: "#ecfdf5" }),
              multiValueLabel: (base) => ({ ...base, color: "#065f46" }),
              multiValueRemove: (base) => ({ ...base, color: "#047857", ":hover": { backgroundColor: "#d1fae5", color: "#065f46" } }),
            }}
          />
          {/* Keep single select behavior for backward compatibility (hidden) */}
          <select
            value={selectedSubCategories[0] || ""}
            onChange={(e) => setSubCategory(e.target.value)}
            className="hidden"
          >
            <option value="">All Subcategories</option>
            {subCategoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {selectedCategory ? `Category: ${selectedCategory}` : "All categories"}
          {selectedSubCategories?.length ? ` • Sub: ${selectedSubCategories.join(", ")}` : ""}
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setCategory("");
            setSubCategories([]);
          }}
          className="p-2 bg-red-500 text-white rounded-lg border border-red-500 hover:bg-red-600 transition duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
