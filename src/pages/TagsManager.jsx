import React, { useState, useEffect } from 'react';
import useToolStore from '../store/toolStore';

function TagsManager() {
  const { tools, fetchTools } = useToolStore();
  const [allTags, setAllTags] = useState([]);

  // Fetch tools and aggregate unique tags
  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    const tags = [...new Set(tools.flatMap((tool) => tool.tags || []))].sort();
    setAllTags(tags);
  }, [tools]);

  return (
    <div className="max-w-5xl mx-auto p-12 bg-gray-100 min-h-screen mt-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Tags</h1>
      <div className="flex flex-wrap gap-3">
        {allTags.length > 0 ? (
          allTags.map((tag) => (
            <div
              key={tag}
              className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors duration-200"
            >
              {tag} <span className="ml-1 text-xs">({tools.filter((tool) => tool.tags.includes(tag)).length})</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No tags available</p>
        )}
      </div>
    </div>
  );
}

export default TagsManager;