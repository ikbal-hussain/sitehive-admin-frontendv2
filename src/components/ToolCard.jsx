import React from "react";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import useToolStore from "../store/toolStore"; 
import { toast } from "react-toastify";

const ToolCard = ({ tool }) => {
  const { setShowEditModal, setSelectedTool, setActionType, setShowConfirmModal } = useToolStore();

  const handleEdit = () => {
    setSelectedTool(tool);
    setActionType("edit");
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setSelectedTool(tool);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 shadow-xl rounded-2xl p-3 border border-blue-700/50 backdrop-blur-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-blue-500/30 to-blue-400/30 opacity-75 rounded-2xl group-hover:opacity-50 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-0">
          <h2 className="text-[16px] text-white font-bold tracking-wide drop-shadow-lg">
            {tool.name}
          </h2>
          <div className="flex gap-4">
            <a
              href={tool.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white group-hover:text-blue-300 transition-colors cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              <ExternalLink />
            </a>
            <button
              className="text-white group-hover:text-blue-300 transition-colors cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={handleEdit}
            >
              <Edit />
            </button>
            <button
              className="text-red-400 hover:text-red-500 transition-colors cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={handleDelete}
            >
              <Trash2 />
            </button>
          </div>
        </div>

        <p className="text-white text-sm mb-4 leading-relaxed">{tool.shortDesc}</p>
        
        <div className="flex flex-wrap gap-1">
          {tool.tags.map((tag, index) => (
            <span key={index} className="text-xs px-2 py-[2px] rounded-md border border-blue-400/40 text-blue-600 bg-violet-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
