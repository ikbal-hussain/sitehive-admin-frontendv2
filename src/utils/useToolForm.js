import { useState } from "react";
import useToolStore from "../store/toolStore";
import { toast } from "react-toastify";

const useToolForm = (initialData = {}) => {
  const { categories, fetchCategories, allSubCategories, allTags, setCategories } = useToolStore();

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    URL: initialData.URL || "",
    shortDesc: initialData.shortDesc || "",
    longDesc: initialData.longDesc || "",
    categories: initialData.categories?.length ? initialData.categories : [{ name: "", subCategories: [""] }],
    tags: initialData.tags?.length ? initialData.tags : [""],
  });
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...formData.categories];
    newCategories[index] = { ...newCategories[index], name: value };
    setFormData({ ...formData, categories: newCategories });
  };

  const handleSubCategoryChange = (catIndex, subCatIndex, value) => {
    const newCategories = [...formData.categories];
    if (Array.isArray(value)) {
      // For multi-select or bulk update
      newCategories[catIndex].subCategories = value;
    } else if (subCatIndex !== null && subCatIndex !== undefined) {
      // For dropdown change
      newCategories[catIndex].subCategories[subCatIndex] = value;
      // If "Other" is selected, add an empty string for the new subcategory input
      if (value === "__other__" && !newCategories[catIndex].subCategories[subCatIndex + 1]) {
        newCategories[catIndex].subCategories[subCatIndex + 1] = "";
      }
      // If not "Other", remove any extra input after this subcategory
      if (value !== "__other__" && newCategories[catIndex].subCategories[subCatIndex + 1] === "") {
        newCategories[catIndex].subCategories.splice(subCatIndex + 1, 1);
      }
    } else {
      // For direct array update (e.g., from input)
      newCategories[catIndex].subCategories = value;
    }
    setFormData({ ...formData, categories: newCategories });
  };

  const handleAddCategory = () => {
    const lastCategory = formData.categories[formData.categories.length - 1];
    if (lastCategory.name.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, { name: "", subCategories: [""] }],
      }));
    }
  };

  const handleAddNewCategory = () => {
    console.log("Adding new category:", newCategoryInput);
    // Check if the new category input is not empty and does not already exist
    if (newCategoryInput.trim() !== "" && !categories.some(cat => cat.name === newCategoryInput)) {

      const updatedCategories = [...categories, { name: newCategoryInput, subCategories: [] }];
      setCategories(updatedCategories)

      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, { name: newCategoryInput, subCategories: [""] }],
      }));
      setNewCategoryInput("");
    }
  };

  const handleAddSubCategory = (catIndex) => {
    const newCategories = [...formData.categories];
    const lastSubCategory = newCategories[catIndex].subCategories[newCategories[catIndex].subCategories.length - 1];
    if (lastSubCategory.trim() !== "") {
      newCategories[catIndex].subCategories.push("");
      setFormData({ ...formData, categories: newCategories });
    }
  };

  const handleRemoveCategory = (catIndex) => {
    const newCategories = formData.categories.filter((_, i) => i !== catIndex);
    setFormData({
      ...formData,
      categories: newCategories.length ? newCategories : [{ name: "", subCategories: [""] }],
    });
  };

  const handleRemoveSubCategory = (catIndex, subCatIndex) => {
    const newCategories = [...formData.categories];
    newCategories[catIndex].subCategories = newCategories[catIndex].subCategories.filter(
      (_, i) => i !== subCatIndex
    );
    if (newCategories[catIndex].subCategories.length === 0) {
      newCategories[catIndex].subCategories = [""];
    }
    setFormData({ ...formData, categories: newCategories });
  };

  const handleAddTag = () => {
    const lastTag = formData.tags[formData.tags.length - 1];
    if (formData.tags.length === 0 || (lastTag && lastTag.trim() !== "")) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, ""],
      }));
    }
  };

  const handleTagChange = (_unused, value) => {
    setFormData({ ...formData, tags: value });
  };

  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tags: newTags.length ? newTags : [""],
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.URL || !formData.shortDesc || !formData.longDesc) {
      setError("Please fill out all required fields.");
      toast.error("Please fill out all required fields.");
      return false;
    }
    const cleanedCategories = formData.categories
      .filter(cat => cat.name.trim() !== "")
      .map(cat => ({
        name: cat.name,
        subCategories: cat.subCategories.filter(sub => sub.trim() !== "" && sub !== "__other__"),
      }));
    // Ensure every category has at least one subcategory
    const missingSubCat = cleanedCategories.some(
      (cat) => !cat.subCategories || cat.subCategories.length === 0
    );
    if (cleanedCategories.length === 0) {
      setError("Please select or add at least one category.");
      toast.error("Please select or add at least one category.");
      return false;
    }
    if (missingSubCat) {
      toast.error("Each category must have at least one subcategory.");
      setError("Each category must have at least one subcategory.");
      return false;
    }
    return cleanedCategories;
  };

  return {
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
    allSubCategories,
    allTags,
  };
};

export default useToolForm;