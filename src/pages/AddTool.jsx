import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToolForm from "../utils/useToolForm";
import axios from "axios";
import useToolStore from "../store/toolStore";
import { AiOutlineClose } from "react-icons/ai";
import ConfirmModal from "../components/ConfirmModal";

const AddTool = () => {
    const navigate = useNavigate();
    const {
        formData,
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
    } = useToolForm();

    const { setSelectedTool, setActionType, setShowConfirmModal, showConfirmModal } = useToolStore();

    useEffect(() => {
        fetchCategories(); // Fetch categories on mount
    }, [fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const cleanedCategories = validateForm();
        if (!cleanedCategories) return;

        const cleanedFormData = {
            name: formData.name,
            URL: formData.URL,
            shortDesc: formData.shortDesc,
            longDesc: formData.longDesc,
            categories: cleanedCategories,
            tags: formData.tags.filter(tag => tag.trim() !== ""),
        };

        setSelectedTool(cleanedFormData);
        setActionType("add");
        setShowConfirmModal(true);

        // try {
        //     const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
        //     if (!baseUrl) {
        //         throw new Error("baseUrl is not defined");
        //     }
        //     await axios.post(`${baseUrl}/api/tools`, cleanedFormData);
        //     navigate("/tools"); // Redirect to tools list
        // } catch (err) {
        //     setError(err.response?.data?.message || "Failed to add tool");
        // }
    };

    const handleCancel = () => {
        navigate("/tools");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                        <h2 className="text-3xl font-bold text-white">Add New Tool</h2>
                    </div>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-6 rounded">
                            {error}
                        </div>
                    )}
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
                                {formData.categories.map((category, catIndex) => (
                                    <div key={catIndex} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <select
                                                value={category.name}
                                                onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            >
                                                <option value="">Select Category</option>
                                                {useToolStore.getState().categories.map((cat) => (
                                                    <option key={cat._id} value={cat.name}>
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
                                        <label className="block text-sm font-medium text-gray-700 mt-2">Subcategories</label>
                                        {category.subCategories.map((subCat, subCatIndex) => (
                                            <div key={subCatIndex} className="flex items-center space-x-3 mb-2">
                                                <input
                                                    type="text"
                                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={subCat}
                                                    onChange={(e) => handleSubCategoryChange(catIndex, subCatIndex, e.target.value)}
                                                    placeholder="Enter subcategory"
                                                />
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
                                ))}
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
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex items-center space-x-3 mb-2">
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            value={tag}
                                            onChange={(e) => handleTagChange(index, e.target.value)}
                                            placeholder="Enter tag"
                                        />
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => handleRemoveTag(index)}
                                            aria-label="Remove tag"
                                        >
                                            <AiOutlineClose size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors duration-200"
                                    onClick={handleAddTag}
                                >
                                    + Add Tag
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer"
                            >
                                Add Tool
                            </button>
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showConfirmModal && <ConfirmModal />}

        </div>
    );
};

export default AddTool;