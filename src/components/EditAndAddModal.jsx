// import { useState, useEffect } from "react";
// import useToolStore from "../store/toolStore";
// import { AiOutlineClose } from "react-icons/ai";

// const EditAndAddModal = () => {
//   const {
//     showEditModal,
//     selectedTool,
//     setSelectedTool,
//     setShowEditModal,
//     actionType,
//     setShowConfirmModal,
//     categories,
//     fetchCategories,
//   } = useToolStore();

//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     URL: "",
//     shortDesc: "",
//     longDesc: "",
//     categories: [{ name: "", subCategories: [""] }],
//     tags: [""],
//   });

//   const [newCategoryInput, setNewCategoryInput] = useState("");

//   useEffect(() => {
//     fetchCategories(); // Fetch categories when modal opens
//     if (selectedTool && actionType === "edit") {
//       setFormData({
//         ...selectedTool,
//         id: selectedTool._id || "",
//         categories: selectedTool.categories || [{ name: "", subCategories: [""] }],
//         tags: selectedTool.tags?.length ? selectedTool.tags : [""],
//       });
//     } else if (actionType === "add") {
//       setFormData({
//         id: "",
//         name: "",
//         URL: "",
//         shortDesc: "",
//         longDesc: "",
//         categories: [{ name: "", subCategories: [""] }],
//         tags: [""],
//       });
//     }
//   }, [selectedTool, actionType, fetchCategories]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCategoryChange = (index, value) => {
//     const newCategories = [...formData.categories];
//     newCategories[index] = { ...newCategories[index], name: value };
//     setFormData({ ...formData, categories: newCategories });
//   };

//   const handleSubCategoryChange = (catIndex, subCatIndex, value) => {
//     const newCategories = [...formData.categories];
//     newCategories[catIndex].subCategories[subCatIndex] = value;
//     setFormData({ ...formData, categories: newCategories });
//   };

//   const handleAddCategory = () => {
//     const lastCategory = formData.categories[formData.categories.length - 1];
//     if (lastCategory.name.trim() !== "") {
//       setFormData((prev) => ({
//         ...prev,
//         categories: [...prev.categories, { name: "", subCategories: [""] }],
//       }));
//     }
//   };

//   const handleAddNewCategory = () => {
//     if (newCategoryInput.trim() !== "" && !categories.some(cat => cat.name === newCategoryInput)) {
//       setFormData((prev) => ({
//         ...prev,
//         categories: [...prev.categories, { name: newCategoryInput, subCategories: [""] }],
//       }));
//       setNewCategoryInput("");
//     }
//   };

//   const handleAddSubCategory = (catIndex) => {
//     const newCategories = [...formData.categories];
//     const lastSubCategory = newCategories[catIndex].subCategories[newCategories[catIndex].subCategories.length - 1];
//     if (lastSubCategory.trim() !== "") {
//       newCategories[catIndex].subCategories.push("");
//       setFormData({ ...formData, categories: newCategories });
//     }
//   };

//   const handleRemoveCategory = (catIndex) => {
//     const newCategories = formData.categories.filter((_, i) => i !== catIndex);
//     setFormData({
//       ...formData,
//       categories: newCategories.length ? newCategories : [{ name: "", subCategories: [""] }],
//     });
//   };

//   const handleRemoveSubCategory = (catIndex, subCatIndex) => {
//     const newCategories = [...formData.categories];
//     newCategories[catIndex].subCategories = newCategories[catIndex].subCategories.filter(
//       (_, i) => i !== subCatIndex
//     );
//     if (newCategories[catIndex].subCategories.length === 0) {
//       newCategories[catIndex].subCategories = [""];
//     }
//     setFormData({ ...formData, categories: newCategories });
//   };

//   const handleAddTag = () => {
//     const lastTag = formData.tags[formData.tags.length - 1];
//     if (formData.tags.length === 0 || (lastTag && lastTag.trim() !== "")) {
//       setFormData((prev) => ({
//         ...prev,
//         tags: [...prev.tags, ""],
//       }));
//     }
//   };

//   const handleTagChange = (index, value) => {
//     const isDuplicate = formData.tags.some((tag, i) => i !== index && tag === value);
//     if (!isDuplicate) {
//       const newTags = [...formData.tags];
//       newTags[index] = value;
//       setFormData({ ...formData, tags: newTags });
//     }
//   };

//   const handleRemoveTag = (index) => {
//     const newTags = formData.tags.filter((_, i) => i !== index);
//     setFormData({
//       ...formData,
//       tags: newTags.length ? newTags : [""],
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.URL || !formData.shortDesc || !formData.longDesc) {
//       alert("Please fill out all required fields.");
//       return;
//     }
//     // Filter out categories with empty names and clean up subCategories
//     const cleanedCategories = formData.categories
//       .filter(cat => cat.name.trim() !== "")
//       .map(cat => ({
//         name: cat.name,
//         subCategories: cat.subCategories.filter(sub => sub.trim() !== ""),
//       }));
//     if (cleanedCategories.length === 0) {
//       alert("Please select or add at least one category.");
//       return;
//     }
//     setSelectedTool({
//       ...formData,
//       categories: cleanedCategories,
//       tags: formData.tags.filter(tag => tag.trim() !== ""),
//     });
//     setShowConfirmModal(true);
//     setShowEditModal(false);
//   };

//   const handleCancel = () => {
//     setShowEditModal(false);
//     setFormData({
//       id: "",
//       name: "",
//       URL: "",
//       shortDesc: "",
//       longDesc: "",
//       categories: [{ name: "", subCategories: [""] }],
//       tags: [""],
//     });
//     setNewCategoryInput("");
//   };

//   if (!showEditModal) return null;

//   return (
//     <div className="fixed inset-0 bg-blue-100 bg-opacity-100 flex items-center justify-center z-50">
//       <div className="bg-white px-7 py-2 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
//         <button className="bg-red-400 p-1 absolute top-4 right-4 text-gray-600" onClick={handleCancel}>
//           <AiOutlineClose size={24} />
//         </button>
//         <h2 className="text-xl font-semibold mb-4 text-center">
//           {actionType === "edit" ? "Edit Tool" : "Add New Tool"}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 gap-1">
//             <input
//               type="text"
//               name="name"
//               placeholder="Tool Name"
//               className="w-full p-2 border rounded"
//               value={formData.name || ""}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="url"
//               name="URL"
//               placeholder="Tool URL"
//               className="w-full p-2 border rounded"
//               value={formData.URL || ""}
//               onChange={handleChange}
//               required
//             />
//             <textarea
//               name="shortDesc"
//               placeholder="Short Description"
//               className="w-full p-2 border rounded"
//               value={formData.shortDesc || ""}
//               onChange={handleChange}
//               required
//             />
//             <textarea
//               name="longDesc"
//               placeholder="Long Description"
//               className="w-full p-2 border rounded"
//               value={formData.longDesc || ""}
//               onChange={handleChange}
//               required
//             />
//             <div>
//               <label className="block font-semibold">Categories</label>
//               {formData.categories.map((category, catIndex) => (
//                 <div key={catIndex} className="mb-2 p-2 border rounded">
//                   <div className="flex items-center space-x-2 mb-1">
//                     <select
//                       value={category.name || ""}
//                       onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
//                       className="w-full p-2 border rounded"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat._id} value={cat.name}>
//                           {cat.name}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       type="button"
//                       className="bg-red-500 text-white px-2 py-1 rounded"
//                       onClick={() => handleRemoveCategory(catIndex)}
//                       aria-label="Remove category"
//                     >
//                       X
//                     </button>
//                   </div>
//                   <label className="block font-semibold mt-2">Subcategories</label>
//                   {category.subCategories.map((subCat, subCatIndex) => (
//                     <div key={subCatIndex} className="flex items-center space-x-2 mb-1">
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded"
//                         value={subCat || ""}
//                         onChange={(e) => handleSubCategoryChange(catIndex, subCatIndex, e.target.value)}
//                         placeholder="Subcategory"
//                       />
//                       <button
//                         type="button"
//                         className="bg-red-500 text-white px-2 py-1 rounded"
//                         onClick={() => handleRemoveSubCategory(catIndex, subCatIndex)}
//                         aria-label="Remove subcategory"
//                       >
//                         X
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded mt-2"
//                     onClick={() => handleAddSubCategory(catIndex)}
//                   >
//                     + Add Subcategory
//                   </button>
//                 </div>
//               ))}
//               <div className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={newCategoryInput}
//                   onChange={(e) => setNewCategoryInput(e.target.value)}
//                   placeholder="New Category"
//                   className="w-full p-2 border rounded"
//                 />
//                 <button
//                   type="button"
//                   className="bg-green-500 text-white px-3 py-1 rounded"
//                   onClick={handleAddNewCategory}
//                 >
//                   + Add New Category
//                 </button>
//               </div>
//               <button
//                 type="button"
//                 className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded mt-2"
//                 onClick={handleAddCategory}
//               >
//                 + Add Category
//               </button>
//             </div>
//             <div>
//               <label className="block font-semibold">Tags</label>
//               {formData.tags?.map((tag, index) => (
//                 <div key={index} className="flex items-center space-x-2 mb-1">
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded"
//                     value={tag || ""}
//                     onChange={(e) => handleTagChange(index, e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                     onClick={() => handleRemoveTag(index)}
//                     aria-label="Remove tag"
//                   >
//                     X
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded mt-2"
//                 onClick={handleAddTag}
//               >
//                 + Add Tag
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               {actionType === "edit" ? "Update" : "Add"}
//             </button>
//             <button
//               type="button"
//               className="ml-2 text-gray-600"
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditAndAddModal;