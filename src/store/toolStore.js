import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";

const useToolStore = create((set, get) => ({
  tools: [],
  filteredTools: [],
  searchTerm: "",
  selectedCategory: "",
  selectedSubCategory: "",
  selectedTool: "",
  showConfirmModal: false,
  showEditModal: false,
  actionType: "",

  setShowEditModal: (value) => set({ showEditModal: value }),
  setShowConfirmModal: (value) => set({ showConfirmModal: value }),
  setSelectedTool: (value) => set({ selectedTool: value }),
  setActionType: (value) => set({ actionType: value }),

  fetchTools: async () => {
    try {

      const response = await axios.get(import.meta.env.VITE_API_URL_ADMIN_BACKEND);
      set({ tools: response.data, filteredTools: response.data });
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to fetch tools. Please try again.");
    }
  },
  

  setSearchTerm: (term) => {
    set((state) => ({
      searchTerm: term,
      filteredTools: state.tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(term.toLowerCase()) ||
          tool.category.toLowerCase().includes(term.toLowerCase()) ||
          tool.subCategory.toLowerCase().includes(term.toLowerCase())
      ),
    }));
  },

  setCategory: (category) => {
    set((state) => ({
      selectedCategory: category,
      filteredTools: state.tools.filter(
        (tool) => category === "" || tool.category === category
      ),
    }));
  },

  setSubCategory: (subCategory) => {
    set((state) => ({
      selectedSubCategory: subCategory,
      filteredTools: state.tools.filter(
        (tool) =>
          (state.selectedCategory === "" || tool.category === state.selectedCategory) &&
          (subCategory === "" || tool.subCategory === subCategory)
      ),
    }));
  },

  handleBackendUpdate: async () => {
    const { selectedTool, actionType, fetchTools, tools } = get(); // ✅ Extract `tools` from store state
    try {
      if (!selectedTool) return;
  
      const apiUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
  
      if (actionType === "add") {
        await axios.post(apiUrl, selectedTool);
        toast.success("Tool added successfully!");
      } else if (actionType === "edit") {
        const response = await axios.patch(apiUrl, selectedTool);
        set({
          tools: tools.map((tool) => (tool._id === selectedTool._id ? response.data : tool)), // ✅ Replace updated tool
          filteredTools: tools.map((tool) => (tool._id === selectedTool._id ? response.data : tool)),
        });
        toast.success("Tool updated successfully!");
      } else if (actionType === "delete") {
        await axios.delete(apiUrl, { data: { _id: selectedTool._id } }); // ✅ Send `_id` in request body
        set({
          tools: tools.filter((tool) => tool._id !== selectedTool._id),
          filteredTools: tools.filter((tool) => tool._id !== selectedTool._id),
        });
        toast.success("Tool deleted successfully!");
      }
  
      fetchTools(); // ✅ Refresh tool list after update
    } catch (error) {
      console.error("Error updating tools:", error);
      toast.error(`Error while ${actionType}. Please try again.`);
    }
  },

  handleConfirm: async () => {
    try {
      set({ showConfirmModal: false, showEditModal: false }); // ✅ Correct way to update state
      await get().handleBackendUpdate(); // ✅ Call function from store
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      toast.error(`Error in handleConfirm. Error: ${error.message}`);
    }
  },

  handleCancel: () => {
    set({ showConfirmModal: false });
  },

}));

export default useToolStore;
