import React, { useState, useEffect } from 'react';
import useToolStore from '../store/toolStore';

function Categories() {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useToolStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubCategories, setEditSubCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await addCategory({ name: newCategoryName, subCategories: [] });
      setNewCategoryName('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditCategory = async () => {
    if (currentCategory && editCategoryName.trim()) {
      await updateCategory(currentCategory._id, {
        name: editCategoryName,
        subCategories: editSubCategories,
      });
      setIsEditModalOpen(false);
      setCurrentCategory(null);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  const handleAddSubCategory = () => {
    if (newSubCategory.trim()) {
      setEditSubCategories([...editSubCategories, newSubCategory]);
      setNewSubCategory('');
    }
  };

  const handleDeleteSubCategory = (index) => {
    setEditSubCategories(editSubCategories.filter((_, i) => i !== index));
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setEditCategoryName(category.name);
    setEditSubCategories(category.subCategories || []);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add Category
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">{category.name}</h2>
                  <p className="text-sm text-gray-500">
                    {category.toolCount || 0} tools • Last updated: {new Date(category.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {category.subCategories && category.subCategories.length > 0 ? (
                <div className="ml-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Subcategories:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.subCategories.map((subCategory, index) => (
                      <li
                        key={index}
                        className="text-gray-600 text-sm bg-gray-100 p-2 rounded-md"
                      >
                        {subCategory} <span className="text-xs text-gray-400">({category.subCategoryToolCounts?.[index] || 0} tools)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-2">No subcategories available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No categories available</p>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && currentCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Subcategories</h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="New subcategory"
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={handleAddSubCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {editSubCategories.map((subCategory, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                    <span>{subCategory}</span>
                    <button
                      onClick={() => handleDeleteSubCategory(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;