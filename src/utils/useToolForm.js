import { useState } from "react";
import useToolStore from "../store/toolStore";

const useToolForm = (initialData = {}) => {
  const { categories, fetchCategories } = useToolStore();

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
    newCategories[catIndex].subCategories[subCatIndex] = value;
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
    if (newCategoryInput.trim() !== "" && !categories.some(cat => cat.name === newCategoryInput)) {
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
    setFormData({
      ...formData,
      tags: newTags.length ? newTags : [""],
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.URL || !formData.shortDesc || !formData.longDesc) {
      setError("Please fill out all required fields.");
      return false;
    }
    const cleanedCategories = formData.categories
      .filter(cat => cat.name.trim() !== "")
      .map(cat => ({
        name: cat.name,
        subCategories: cat.subCategories.filter(sub => sub.trim() !== ""),
      }));
    if (cleanedCategories.length === 0) {
      setError("Please select or add at least one category.");
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
  };
};

export default useToolForm;