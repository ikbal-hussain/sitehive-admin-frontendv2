import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToolForm from "../utils/useToolForm";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import useToolStore from "../store/toolStore";
import ConfirmModal from "../components/ConfirmModal";
import Select from "react-select"; // <-- Add this import

const EditTool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    newCategoryInput,
    error,
    setError,
    setNewCategoryInput,
    handleChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAddCategory,
    handleAddNewCategory,
    handleAddSubCategory,
    handleRemoveCategory,
    handleRemoveSubCategory,
    handleAddTag,
    handleTagChange,
    handleRemoveTag,
    validateForm,
    fetchCategories,
    allTags,
  } = useToolForm();
  const { fetchToolById, setSelectedTool, setActionType, setShowConfirmModal, showConfirmModal } = useToolStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    const loadTool = async () => {
      try {
        setLoading(true);
        const tool = await fetchToolById(id);
        console.log({ tool });

        setFormData({
          _id: tool._id,
          tool_id: tool.tool_id,
          name: tool.name,
          URL: tool.URL,
          shortDesc: tool.shortDesc,
          longDesc: tool.longDesc,
          categories: tool.categories?.length ? tool.categories : [{ name: "", subCategories: [""] }],
          tags: tool.tags?.length ? tool.tags : [""],
        });
      } catch (err) {
        setError("Failed to load tool data");
      } finally {
        setLoading(false);
      }
    };
    loadTool();
  }, [id, fetchCategories, fetchToolById, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate: every category must have at least one subcategory (not empty)
    const missingSubCat = formData.categories.some(
      (cat) =>
        !cat.name.trim() ||
        !Array.isArray(cat.subCategories) ||
        cat.subCategories.filter((sub) => sub && sub.trim() !== "" && sub !== "__other__").length === 0
    );
    if (missingSubCat) {
      setError("Each category must have at least one subcategory.");
      return;
    }

    const cleanedCategories = validateForm();
    if (!cleanedCategories) return;

    const cleanedFormData = {
      _id: formData._id,
      tool_id: formData.tool_id,
      name: formData.name,
      URL: formData.URL,
      shortDesc: formData.shortDesc,
      longDesc: formData.longDesc,
      categories: cleanedCategories,
      tags: (Array.isArray(formData.tags) ? formData.tags : []).filter(tag => tag.trim() !== ""),
    };
    setSelectedTool(cleanedFormData);
    setActionType("edit");
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    navigate("/tools");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  // Helper for tag options
  const tagOptions = allTags.map(tag => ({ value: tag, label: tag }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Edit Tool</h2>
            <button
              onClick={handleCancel}
              className="text-white hover:text-gray-200 transition-colors duration-200"
              aria-label="Close"
            >
              <AiOutlineClose size={28} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tool Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter tool name"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tool URL</label>
                <input
                  type="url"
                  name="URL"
                  placeholder="Enter tool URL"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.URL}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <textarea
                  name="shortDesc"
                  placeholder="Enter a brief description"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Long Description</label>
                <textarea
                  name="longDesc"
                  placeholder="Enter a detailed description"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y"
                  value={formData.longDesc}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                {formData.categories.map((category, catIndex) => {
                  // Find the selected category object
                  const selectedCatObj = useToolStore.getState().categories.find(
                    (cat) => cat.name === category.name
                  );
                  const subCategoryOptions = selectedCatObj?.subCategories || [];
                  return (
                    <div key={catIndex} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <select
                          value={category.name}
                          onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">Select Category</option>
                          {useToolStore.getState().categories.map((cat, idx) => (
                            <option key={idx} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                          onClick={() => handleRemoveCategory(catIndex)}
                          aria-label="Remove category"
                        >
                          <AiOutlineClose size={16} />
                        </button>
                      </div>
                      {/* Subcategories dropdowns */}
                      <label className="block text-sm font-medium text-gray-700 mt-2">Subcategories</label>
                      {category.subCategories.map((subCat, subCatIndex) => (
                        <div key={subCatIndex} className="flex items-center space-x-3 mb-2">
                          <select
                            value={subCat}
                            onChange={(e) => handleSubCategoryChange(catIndex, subCatIndex, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="">Select Subcategory</option>
                            {subCategoryOptions.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                            <option value="__other__">Other</option>
                          </select>
                          {/* If "Other" is selected, show input */}
                          {subCat === "__other__" && (
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter new subcategory"
                              value={category.subCategories[subCatIndex + 1] || ""}
                              onChange={(e) => {
                                // Insert the new subcategory value right after the "__other__" entry
                                const newSubCategories = [...category.subCategories];
                                newSubCategories[subCatIndex + 1] = e.target.value;
                                handleSubCategoryChange(catIndex, null, newSubCategories);
                              }}
                            />
                          )}
                          <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                            onClick={() => handleRemoveSubCategory(catIndex, subCatIndex)}
                            aria-label="Remove subcategory"
                          >
                            <AiOutlineClose size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-200"
                        onClick={() => handleAddSubCategory(catIndex)}
                      >
                        + Add Subcategory
                      </button>
                    </div>
                  );
                })}
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Enter new category"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    onClick={handleAddNewCategory}
                  >
                    + Add New Category
                  </button>
                </div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  onClick={handleAddCategory}
                >
                  + Add Category
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <Select
                  isMulti
                  isSearchable
                  options={tagOptions}
                  value={
                    (Array.isArray(formData.tags) ? formData.tags : [])
                      .filter(Boolean)
                      .map(tag => ({ value: tag, label: tag }))
                  }
                  onChange={selectedOptions => {
                    handleTagChange(
                      null,
                      selectedOptions ? selectedOptions.map(opt => opt.value) : []
                    );
                  }}
                  className="mb-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer"
              >
                Update Tool
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6 rounded">
              {error}
            </div>
          )}
          </form>
        </div>
      </div>
      {showConfirmModal && <ConfirmModal />}
    </div>
  );
};

export default EditTool;