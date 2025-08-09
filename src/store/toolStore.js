import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";

// Helper to filter tools based on search, category, subcategory
function filterTools(tools, searchTerm, selectedCategory, selectedSubCategory) {
  return tools.filter((tool) => {
    // Category match
    const categoryMatch =
      !selectedCategory ||
      (tool.categories || []).some(
        (cat) =>
          (typeof cat === "string" && cat === selectedCategory) ||
          (cat.name && cat.name === selectedCategory)
      );

    // Subcategory match
    const subCategoryMatch =
      !selectedSubCategory ||
      (tool.categories || []).some(
        (cat) =>
          cat.subCategories &&
          Array.isArray(cat.subCategories) &&
          cat.subCategories.includes(selectedSubCategory)
      );

    // Search match
    const search = searchTerm.toLowerCase();
    const nameMatch = tool.name?.toLowerCase().includes(search);
    const catMatch = (tool.categories || []).some((cat) =>
      typeof cat === "string"
        ? cat.toLowerCase().includes(search)
        : cat.name?.toLowerCase().includes(search)
    );
    const subCatMatch = (tool.categories || []).some((cat) =>
      (cat.subCategories || []).some((sub) =>
        sub.toLowerCase().includes(search)
      )
    );

    return categoryMatch && subCategoryMatch && (search === "" || nameMatch || catMatch || subCatMatch);
  });
}

const useToolStore = create((set, get) => ({
  loading: false,
  tools: [],
  filteredTools: [],
  searchTerm: "",
  selectedCategory: "",
  selectedSubCategory: "",
  selectedTool: null,
  showConfirmModal: false,
  showEditModal: false,
  actionType: "",
  categories: [],
  allSubCategories: [],
  allTags: [],

  setShowEditModal: (value) => set({ showEditModal: value }),
  setShowConfirmModal: (value) => set({ showConfirmModal: value }),
  setSelectedTool: (value) => set({ selectedTool: value }),
  setActionType: (value) => set({ actionType: value }),
  setCategories: (categories) => set({ categories }),

  fetchTools: async () => {
    set({ loading: true });
    try {
      const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
      if (!baseUrl) {
        throw new Error("baseUrl is not defined");
      }
      const response = await axios.get(`${baseUrl}/api/tools`);
      // Extract all unique subcategories and tags
      const allSubCategories = [
        ...new Set(
          response.data.flatMap(tool =>
            (tool.categories || []).flatMap(cat =>
              (cat.subCategories || [])
            )
          ).filter(Boolean)
        ),
      ];
      const allTags = [
        ...new Set(
          response.data.flatMap(tool => tool.tags || []).filter(Boolean)
        ),
      ];
      set({ 
        tools: response.data,
        allSubCategories,
        allTags,
      });
      // Apply current filters after fetching
      const { searchTerm, selectedCategory, selectedSubCategory } = get();
      set({
        filteredTools: filterTools(
          response.data,
          searchTerm,
          selectedCategory,
          selectedSubCategory
        ),
      });
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to fetch tools. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  fetchToolById: async (id) => {
    const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
    if (!baseUrl) {
      throw new Error("baseUrl is not defined");
    }
    try {
      const response = await axios.get(`${baseUrl}/api/tools/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching tool");
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
      
      const response = await axios.get(`${baseUrl}/api/categories`);
      set({ categories: response.data });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    } finally {
      set({ loading: false });
    }
  },

  setSearchTerm: (term) => {
    set((state) => {
      const filtered = filterTools(
        state.tools,
        term,
        state.selectedCategory,
        state.selectedSubCategory
      );
      return { searchTerm: term, filteredTools: filtered };
    });
  },

  setCategory: (category) => {
    set((state) => {
      // Reset subcategory when category changes
      const filtered = filterTools(
        state.tools,
        state.searchTerm,
        category,
        ""
      );
      return {
        selectedCategory: category,
        selectedSubCategory: "",
        filteredTools: filtered,
      };
    });
  },

  setSubCategory: (subCategory) => {
    set((state) => {
      const filtered = filterTools(
        state.tools,
        state.searchTerm,
        state.selectedCategory,
        subCategory
      );
      return { selectedSubCategory: subCategory, filteredTools: filtered };
    });
  },

  handleBackendUpdate: async () => {
    const { selectedTool, actionType, fetchTools, tools } = get();
    try {
      if (!selectedTool) return;

      const apiUrl = `${import.meta.env.VITE_API_URL_ADMIN_BACKEND}/api/tools`;

      if (actionType === "add") {
        await axios.post(apiUrl, selectedTool);
        toast.success("Tool added successfully!");
      } else if (actionType === "edit") {
        const response = await axios.patch(
          `${apiUrl}`,
          selectedTool
        );
        set({
          tools: tools.map((tool) =>
            tool._id === selectedTool._id ? response.data : tool
          ),
          filteredTools: tools.map((tool) =>
            tool._id === selectedTool._id ? response.data : tool
          ),
        });
        toast.success("Tool updated successfully!");
      } else if (actionType === "delete") {
        const id = selectedTool._id;
        console.log("Deleting tool with id:", id);
        console.log("selectedTool", selectedTool);

        
        await axios.delete(`${apiUrl}`, { data: selectedTool });
        set({
          tools: tools.filter((tool) => tool._id !== selectedTool._id),
          filteredTools: tools.filter(
            (tool) => tool._id !== selectedTool._id
          ),
        });
        toast.success("Tool deleted successfully!");
      }

      fetchTools();
    } catch (error) {
      console.error("Error updating tools:", error);
      toast.error(`Error while ${actionType}ing tool. Please try again.`);
    }
  },

  handleConfirm: async () => {
    try {
      set({ showConfirmModal: false});
      await get().handleBackendUpdate();
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