import { Suspense, useEffect } from "react";
import useToolStore from "../store/toolStore";
import SearchFilter from "../components/SearchFilter";
import EditAndAddModal from "../components/EditAndAddModal";
import ConfirmModal from "../components/ConfirmModal";
import ToolCard from "../components/ToolCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const {
    loading,
    fetchTools,
    filteredTools,
    showEditModal,
    setShowEditModal,
    setActionType,
    showConfirmModal,
  } = useToolStore();

  function handleAddTool() {
    setActionType("add");
    setShowEditModal(true);
  }

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return (
    <div className="container mx-auto bg-grey-800">
      <div id="tools-section" className="p-6 min-h-screen">
        <button
          className="cursor-pointer bg-green-600 text-white font-bold py-2 px-4 m-2 w-52 rounded-lg border border-green-600 
             hover:bg-green-700 transition duration-200 ease-in-out 
             focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          onClick={handleAddTool}
        >
          Add Tool
        </button>
        <Link
          to="/bulk-upload"
          className="cursor-pointer bg-green-600 text-white font-bold py-2 px-4 m-2 w-52 rounded-lg border border-green-600 
             hover:bg-green-700 transition duration-200 ease-in-out 
             focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Bulk Upload
        </Link>

        <SearchFilter />

        {loading ? (
          // **Loading Spinner**
          <div className="flex justify-center items-center h-32">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 mt-2 p-2">
            <Suspense fallback={<div>Loading...</div>}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.tool_id} tool={tool} />
              ))}
            </Suspense>
          </div>
        ) : (
          <div className="flex items-center justify-center text-center text-gray-700 mt-6 h-full">
            <p>
              No tools found. Please select a category and subcategory or try
              searching for something different.
            </p>
          </div>
        )}
      </div>

      {showEditModal && <EditAndAddModal />}
      {showConfirmModal && <ConfirmModal />}
    </div>
  );
};

export default Dashboard;
