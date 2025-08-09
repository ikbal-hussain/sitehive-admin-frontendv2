import useToolStore from "../store/toolStore";

const ConfirmModal = () => {
  const {
    showConfirmModal,
    actionType,
    handleConfirm,
    handleCancel,
    selectedTool,
    categoryToDelete,
  } = useToolStore();

  if (!showConfirmModal) return null;

  const isCategoryDelete = actionType === "delete-category" && categoryToDelete;
  const title = isCategoryDelete
    ? "Delete Category"
    : actionType === "delete"
    ? "Delete Tool"
    : actionType === "add"
    ? "Add Tool"
    : "Update Tool";

  const subject = isCategoryDelete
    ? `category "${categoryToDelete?.name}"`
    : selectedTool?.name
    ? `tool "${selectedTool.name}"`
    : "this item";

  const description = isCategoryDelete
    ? "This will remove the category from all tools (if possible) and delete it permanently."
    : actionType === "delete"
    ? "This action cannot be undone. The tool will be removed permanently."
    : actionType === "add"
    ? "This will add a new tool to the catalog."
    : "This will update the current tool details.";

  const confirmLabel = isCategoryDelete
    ? "Delete Category"
    : actionType === "delete"
    ? "Delete Tool"
    : actionType === "add"
    ? "Add Tool"
    : "Update Tool";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to proceed with {subject}?<br />
          {description}
        </p>
        {isCategoryDelete && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm p-3">
            If some tools only have this category, deletion will be blocked and you will see an error listing those tools.
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 ${
              isCategoryDelete || actionType === "delete"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 focus:ring-rose-300"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:ring-green-300"
            }`}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
