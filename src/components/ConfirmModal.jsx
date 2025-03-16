import useToolStore from "../store/toolStore";

const ConfirmModal = () => {
  const {
    showConfirmModal,
    actionType,
    handleConfirm,
    handleCancel,
  } = useToolStore();

  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Warning</h2>
        <p>Are you sure you want to {actionType === "add" ? "Add a New Tool" : actionType === "delete" ? "Delete this Tool" : "Update this Tool"}?</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-4"
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <button
          type="button"
          className="ml-2 text-gray-600"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
