import { useState, useEffect } from "react";
import useToolStore from "../store/toolStore";

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
      setFormData(selectedTool);
    } else if (actionType === "add") {
      setFormData({
        name: "",
        URL: "",
        shortDesc: "",
        longDesc: "",
        category: "",
        subCategory: "",
        tags: [],
      });
    }
  }, [selectedTool, actionType]);

  if (!showEditModal) return null;

  const handleSubmit = (e) => {
    setSelectedTool(formData);
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {actionType === "edit" ? "Edit Tool" : "Add New Tool"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tool Name"
            className="w-full mb-2 p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Tool URL"
            className="w-full mb-2 p-2 border rounded"
            value={formData.URL}
            onChange={(e) => setFormData({ ...formData, URL: e.target.value })}
            required
          />
          <textarea
            placeholder="Short Description"
            className="w-full mb-2 p-2 border rounded"
            value={formData.shortDesc}
            onChange={(e) =>
              setFormData({ ...formData, shortDesc: e.target.value })
            }
            required
          ></textarea>
          <textarea
            placeholder="Long Description"
            className="w-full mb-2 p-2 border rounded"
            value={formData.longDesc || ""}
            onChange={(e) =>
              setFormData({ ...formData, longDesc: e.target.value })
            }
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {actionType === "edit" ? "Update" : "Add"}
          </button>
          <button
            type="button"
            className="ml-2 text-gray-600"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAndAddModal;
