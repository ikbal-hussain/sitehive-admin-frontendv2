import { useState, useEffect } from "react";
import useToolStore from "../store/toolStore";
import { AiOutlineClose } from "react-icons/ai";

const EditAndAddModal = () => {
  const {
    showEditModal,
    selectedTool,
    setSelectedTool,
    setShowEditModal,
    actionType,
    setShowConfirmModal,
  } = useToolStore();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    URL: "",
    shortDesc: "",
    longDesc: "",
    category: "",
    subCategory: "",
    tags: [],
  });

  useEffect(() => {
    if (selectedTool && actionType === "edit") {
      setFormData({ ...selectedTool });
    } else if (actionType === "add") {
      setFormData({
        id: "",
        name: "",
        URL: "",
        shortDesc: "",
        longDesc: "",
        category: "",
        subCategory: "",
        tags: [""],
      });
    }
  }, [selectedTool, actionType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    const lastTag = formData.tags[formData.tags.length - 1];
    if (formData.tags.length == 0 || (lastTag && lastTag.trim() !== "")) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, ""],
      }));
    }
  };

  const handleTagChange = (index, value) => {
    const isDuplicate = formData.tags.some((tag, i) => i !== index && tag === value);
    if (!isDuplicate) {
      const newTags = [...formData.tags];
      newTags[index] = value;
      setFormData({ ...formData, tags: newTags });
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.URL || !formData.shortDesc || !formData.longDesc) {
      alert("Please fill out all required fields.");
      return;
    }
    setSelectedTool(formData);
    setShowConfirmModal(true);
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setFormData({
      id: "",
      name: "",
      URL: "",
      shortDesc: "",
      longDesc: "",
      category: "",
      subCategory: "",
      tags: [""],
    });
  };

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-7 py-2 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button className="bg-red-400 p-1 absolute top-4 right-4 text-gray-600" onClick={handleCancel}>
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          {actionType === "edit" ? "Edit Tool" : "Add New Tool"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-1">
            <input
              type="text"
              name="name"
              placeholder="Tool Name"
              className="w-full p-2 border rounded"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="URL"
              placeholder="Tool URL"
              className="w-full p-2 border rounded"
              value={formData.URL || ""}
              onChange={handleChange}
              required
            />
            <textarea
              name="shortDesc"
              placeholder="Short Description"
              className="w-full p-2 border rounded"
              value={formData.shortDesc || ""}
              onChange={handleChange}
              required
            />
            <textarea
              name="longDesc"
              placeholder="Long Description"
              className="w-full p-2 border rounded"
              value={formData.longDesc || ""}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full p-2 border rounded"
                value={formData.category || ""}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subCategory"
                placeholder="Subcategory"
                className="w-full p-2 border rounded"
                value={formData.subCategory || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Tags</label>
              {formData.tags?.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={tag || ""}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemoveTag(index)}
                    aria-label="Remove tag"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded mt-2"
                onClick={handleAddTag}
              >
                + Add Tag
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {actionType === "edit" ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="ml-2 text-gray-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAndAddModal;