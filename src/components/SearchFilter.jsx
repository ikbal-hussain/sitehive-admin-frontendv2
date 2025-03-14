import useToolStore from "../store/toolStore";

const SearchFilter = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setCategory,
    selectedSubCategory,
    setSubCategory,
  } = useToolStore();

  const categories = {
    Productivity: [
      "Note-Taking",
      "Automation",
      "Data Management",
      "AI Tools",
      "Email Management",
      "Workspaces",
      "Knowledge Management",
      "Task Management"
    ],
    Development: [
      "API Testing",
      "Coding Tools",
      "Networking",
      "Project Management",
      "No-Code",
      "Internal Tools",
      "Hosting"
    ],
    Marketing: ["SEO"],
    Communication: [
      "Video Messaging",
      "Team Collaboration"
    ],
    Writing: ["Grammar Checkers"],
    Design: [
      "Prototyping",
      "Website Builders",
      "Collaboration",
      "Wireframing",
      "UI/UX",
      "Graphic Design"
    ],
    Others: ["Mixed", "AI", "Other"],
    Fun: ["Meme Generators", "Jokes"]
  };
  

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setSubCategory("");
  };

  return (
    <div className="flex flex-col gap-8 p-4 bg-pink-100 rounded-lg shadow-lg">
      <div className="flex items-center border border-red-500 rounded-lg overflow-hidden shadow-sm">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-w\ flex-grow p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">All Categories</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={!selectedCategory}
        >
          <option value="">All Subcategories</option>
          {selectedCategory &&
            categories[selectedCategory].map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
        </select>
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
