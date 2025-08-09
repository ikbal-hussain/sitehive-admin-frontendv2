import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit3, Trash2, FolderOpenDot, Layers3 } from 'lucide-react';
import useToolStore from '../store/toolStore';
import ConfirmModal from '../components/ConfirmModal';

function Categories() {
  const {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    requestCategoryDeletion,
    tools,
    fetchTools
  } = useToolStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubCategories, setEditSubCategories] = useState([]);

  // New state for Add modal subcategories
  const [addSubCategoryName, setAddSubCategoryName] = useState('');
  const [addSubCategories, setAddSubCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTools();
  }, [fetchCategories, fetchTools]);
console.log(categories)
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalSubCategories = categories.reduce(
      (sum, c) => sum + (Array.isArray(c.subCategories) ? c.subCategories.length : 0),
      0
    );
    const totalTools = tools.length;
    return { totalCategories, totalSubCategories, totalTools };
  }, [categories, tools]);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await addCategory({ name: newCategoryName, subCategories: addSubCategories });
        setNewCategoryName('');
        setAddSubCategories([]);
        setAddSubCategoryName('');
        setIsAddModalOpen(false);
      } catch {
        // handled in store
      }
    }
  };

  const handleEditCategory = async () => {
    if (currentCategory && editCategoryName.trim()) {
      try {
        await updateCategory(currentCategory._id, {
          name: editCategoryName,
          subCategories: editSubCategories,
        });
        setIsEditModalOpen(false);
        setCurrentCategory(null);
      } catch {
        // handled in store
      }
    }
  };

  const handleDeleteCategory = (category) => {
    requestCategoryDeletion(category);
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

  const handleAddModalAddSub = () => {
    if (addSubCategoryName.trim()) {
      setAddSubCategories([...addSubCategories, addSubCategoryName.trim()]);
      setAddSubCategoryName('');
    }
  };

  const handleAddModalRemoveSub = (index) => {
    setAddSubCategories(addSubCategories.filter((_, i) => i !== index));
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setEditCategoryName(category.name);
    setEditSubCategories(category.subCategories || []);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              <FolderOpenDot className="h-8 w-8 text-green-600" aria-hidden="true" />
              Categories
            </h1>
            <p className="mt-1 text-gray-600">Organize tools into clear groups and subcategories.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:from-green-500 hover:to-emerald-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Add new category"
            disabled={loading}
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-green-100 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <FolderOpenDot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subcategories</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSubCategories}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-green-100 bg-white/80 backdrop-blur p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16 4h6v6"/><path d="M16 10 21 4"/><rect width="8" height="8" x="2" y="4" rx="2"/></svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tools in Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{Number.isFinite(stats.totalTools) ? stats.totalTools : "Not available"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* List / Loader / Empty */}
        {loading ? (
          <div className="flex justify-center items-center h-48" role="status" aria-label="Loading categories">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200`}
              >
                <div className="absolute inset-x-0 -top-6 h-16 bg-gradient-to-r from-white/0 via-white/60 to-white/0" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Icon removed as requested */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {category.updatedAt ? `Updated ${new Date(category.updatedAt).toLocaleDateString()}` : null}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className={`cursor-pointer inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                        aria-label={`Edit category ${category.name}`}
                        disabled={loading}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className={`cursor-pointer inline-flex items-center gap-1.5 text-sm text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label={`Delete category ${category.name}`}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {category.subCategories && category.subCategories.length > 0 ? (
                    <div className="mt-5">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Subcategories</h3>
                      <ul className="flex flex-wrap gap-2">
                        {category.subCategories.map((subCategory, index) => (
                          <li key={index} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100`}>
                            <span>{subCategory}</span>
                            {/* <span className="text-[11px] text-gray-500 bg-white/70 px-1.5 py-0.5 rounded">
                              {(category.subCategoryToolCounts?.[index] || 0)}
                            </span> */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mt-4">No subcategories yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="mx-auto max-w-md px-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <FolderOpenDot className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
              <p className="mt-1 text-gray-600">Create your first category to start organizing tools effectively.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:from-green-500 hover:to-emerald-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5" />
                Add Category
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-category-title">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100">
            <h2 id="add-category-title" className="text-xl font-semibold mb-1">Add New Category</h2>
            <p className="text-sm text-gray-500 mb-4">Create a category and optionally add subcategories.</p>

            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-category-name">Category name</label>
            <input
              id="new-category-name"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Design, Marketing, Data Science"
              className="w-full p-2.5 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 border-gray-200"
              aria-label="Category name"
            />

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subcategories</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={addSubCategoryName}
                  onChange={(e) => setAddSubCategoryName(e.target.value)}
                  placeholder="Add a subcategory"
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border-gray-200"
                  aria-label="New subcategory name"
                />
                <button
                  onClick={handleAddModalAddSub}
                  className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!addSubCategoryName.trim()}
                  aria-disabled={!addSubCategoryName.trim()}
                >
                  Add
                </button>
              </div>
              {addSubCategories.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-auto pr-1">
                  {addSubCategories.map((sub, index) => (
                    <li key={`${sub}-${index}`} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded-lg">
                      <span className="text-sm text-gray-700">{sub}</span>
                      <button
                        onClick={() => handleAddModalRemoveSub(index)}
                        className="cursor-pointer inline-flex items-center gap-1 text-sm text-white px-2.5 py-1.5 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        aria-label={`Remove subcategory ${sub}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No subcategories added yet.</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsAddModalOpen(false); setAddSubCategories([]); setAddSubCategoryName(''); }}
                className="cursor-pointer px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newCategoryName.trim() || loading}
                aria-disabled={!newCategoryName.trim() || loading}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && currentCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-category-title">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100">
            <h2 id="edit-category-title" className="text-xl font-semibold mb-1">Edit Category</h2>
            <p className="text-sm text-gray-500 mb-4">Update the category name and manage its subcategories.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-category-name">Category name</label>
            <input
              id="edit-category-name"
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full p-2.5 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 border-gray-200"
              aria-label="Edit category name"
            />
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Subcategories</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="Add a subcategory"
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border-gray-200"
                  aria-label="New subcategory name"
                />
                <button
                  onClick={handleAddSubCategory}
                  className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newSubCategory.trim()}
                  aria-disabled={!newSubCategory.trim()}
                >
                  Add
                </button>
              </div>
              {editSubCategories.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-auto pr-1">
                  {editSubCategories.map((subCategory, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-2 rounded-lg">
                      <span className="text-sm text-gray-700">{subCategory}</span>
                      <button
                        onClick={() => handleDeleteSubCategory(index)}
                        className="cursor-pointer inline-flex items-center gap-1 text-sm text-white px-2.5 py-1.5 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-rose-300"
                        aria-label={`Delete subcategory ${subCategory}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No subcategories added yet.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editCategoryName.trim()}
                aria-disabled={!editCategoryName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal />
    </div>
  );
}

export default Categories;