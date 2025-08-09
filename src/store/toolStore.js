import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";

// Helper to filter tools based on search, category, subcategory
function filterTools(tools, searchTerm, selectedCategory, selectedSubCategoriesInput) {
  const selectedSubCategories = Array.isArray(selectedSubCategoriesInput)
    ? selectedSubCategoriesInput.filter(Boolean)
    : selectedSubCategoriesInput
    ? [selectedSubCategoriesInput]
    : [];

  return tools.filter((tool) => {
    // Category match
    const categoryMatch =
      !selectedCategory ||
      (tool.categories || []).some(
        (cat) =>
          (typeof cat === "string" && cat === selectedCategory) ||
          (cat?.name && cat.name === selectedCategory)
      );

    // Subcategory match (OR across selected subcategories)
    const subCategoryMatch =
      selectedSubCategories.length === 0 ||
      (tool.categories || []).some((cat) => {
        if (!cat || typeof cat === "string") return false;
        const catSubs = Array.isArray(cat.subCategories) ? cat.subCategories : [];
        return selectedSubCategories.some((sel) => catSubs.includes(sel));
      });

    // Search match
    const search = (searchTerm || "").toLowerCase();
    const nameMatch = tool.name?.toLowerCase().includes(search);
    const catMatch = (tool.categories || []).some((cat) =>
      typeof cat === "string"
        ? cat.toLowerCase().includes(search)
        : cat?.name?.toLowerCase().includes(search)
    );
    const subCatMatch = (tool.categories || []).some((cat) =>
      (cat?.subCategories || []).some((sub) => sub.toLowerCase().includes(search))
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
  selectedSubCategories: [],
  selectedTool: null,
  showConfirmModal: false,
  showEditModal: false,
  actionType: "",
  categories: [],
  allSubCategories: [],
  allTags: [],
  // Category deletion confirmation state
  categoryToDelete: null,

  setShowEditModal: (value) => set({ showEditModal: value }),
  setShowConfirmModal: (value) => set({ showConfirmModal: value }),
  setSelectedTool: (value) => set({ selectedTool: value }),
  setActionType: (value) => set({ actionType: value }),
  setCategories: (categories) => set({ categories }),
  requestCategoryDeletion: (category) => {
    set({
      categoryToDelete: category,
      actionType: "delete-category",
      showConfirmModal: true,
    });
  },

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
          response.data
            .flatMap((tool) => (tool.categories || []).flatMap((cat) => (cat?.subCategories || [])))
            .filter(Boolean)
        ),
      ];
      const allTags = [
        ...new Set(response.data.flatMap((tool) => tool.tags || []).filter(Boolean)),
      ];
      set({ tools: response.data, allSubCategories, allTags });
      // Apply current filters after fetching
      const { searchTerm, selectedCategory, selectedSubCategories } = get();
      set({
        filteredTools: filterTools(
          response.data,
          searchTerm,
          selectedCategory,
          selectedSubCategories
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

  // Add a new category
  addCategory: async ({ name, subCategories = [] }) => {
    const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
    try {
      set({ loading: true });
      const response = await axios.post(`${baseUrl}/api/categories`, {
        name,
        subCategories,
      });
      toast.success("Category added successfully");
      // Refresh list
      await get().fetchCategories();
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors || []).join(", ") ||
        "Failed to add category";
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update category by id
  updateCategory: async (id, { name, subCategories }) => {
    const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
    try {
      set({ loading: true });
      const response = await axios.patch(`${baseUrl}/api/categories/${id}`, {
        name,
        subCategories,
      });
      toast.success("Category updated successfully");
      await get().fetchCategories();
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors || []).join(", ") ||
        "Failed to update category";
      toast.error(message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete category by id
  deleteCategory: async (id) => {
    const baseUrl = import.meta.env.VITE_API_URL_ADMIN_BACKEND;
    try {
      set({ loading: true });
      const response = await axios.delete(`${baseUrl}/api/categories/${id}`);
      toast.success("Category deleted successfully");
      await get().fetchCategories();
      return response.data;
    } catch (error) {
      const blockingTools = error?.response?.data?.blockingTools;
      let message = error?.response?.data?.message || "Failed to delete category";
      if (Array.isArray(blockingTools) && blockingTools.length > 0) {
        const toolsList = blockingTools.map((t) => t.name).join(", ");
        message = `${message}: ${toolsList}`;
      }
      toast.error(message);
      throw error;
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
        state.selectedSubCategories
      );
      return { searchTerm: term, filteredTools: filtered };
    });
  },

  setCategory: (category) => {
    set((state) => {
      // Reset subcategories when category changes
      const filtered = filterTools(
        state.tools,
        state.searchTerm,
        category,
        []
      );
      return {
        selectedCategory: category,
        selectedSubCategories: [],
        filteredTools: filtered,
      };
    });
  },

  // Backward compatible: single subcategory setter maps to array
  setSubCategory: (subCategory) => {
    set((state) => {
      const nextSubs = subCategory ? [subCategory] : [];
      const filtered = filterTools(
        state.tools,
        state.searchTerm,
        state.selectedCategory,
        nextSubs
      );
      return { selectedSubCategories: nextSubs, filteredTools: filtered };
    });
  },

  // New: multi-select subcategories setter
  setSubCategories: (subCategories) => {
    set((state) => {
      const nextSubs = Array.isArray(subCategories) ? subCategories : [];
      const filtered = filterTools(
        state.tools,
        state.searchTerm,
        state.selectedCategory,
        nextSubs
      );
      return { selectedSubCategories: nextSubs, filteredTools: filtered };
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
        const response = await axios.patch(`${apiUrl}`, selectedTool);
        set({
          tools: tools.map((tool) => (tool._id === selectedTool._id ? response.data : tool)),
          filteredTools: tools.map((tool) => (tool._id === selectedTool._id ? response.data : tool)),
        });
        toast.success("Tool updated successfully!");
      } else if (actionType === "delete") {
        const id = selectedTool._id;
        console.log("Deleting tool with id:", id);
        console.log("selectedTool", selectedTool);

        await axios.delete(`${apiUrl}`, { data: selectedTool });
        set({
          tools: tools.filter((tool) => tool._id !== selectedTool._id),
          filteredTools: tools.filter((tool) => tool._id !== selectedTool._id),
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
      const { categoryToDelete } = get();
      if (categoryToDelete) {
        // Category deletion path
        set({ showConfirmModal: false });
        await get().deleteCategory(categoryToDelete._id);
        set({ categoryToDelete: null, actionType: "" });
        return;
      }
      // Default to tools flow
      set({ showConfirmModal: false });
      await get().handleBackendUpdate();
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      toast.error(`Error in handleConfirm. Error: ${error.message}`);
    }
  },

  handleCancel: () => {
    set({ showConfirmModal: false, categoryToDelete: null });
  },
}));

export default useToolStore;