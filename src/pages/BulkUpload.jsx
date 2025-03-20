import { useState } from "react";
import useToolStore from "../store/toolStore";
import { Upload, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function BulkUpload() {
  const { fetchTools } = useToolStore();
  const navigate = useNavigate();
  const [fileType, setFileType] = useState("json");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      let response;
      const apiUrl = `${import.meta.env.VITE_API_URL_ADMIN_BACKEND}/bulk/${fileType}`;

      if (fileType === "json") {
        const parsedData = JSON.parse(filePreview);
        response = await axios.post(apiUrl, parsedData, {
          headers: { "Content-Type": "application/json" },
        });
      } else if (fileType === "csv") {
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await axios.post(apiUrl, formData);
      }

      fetchTools();
      toast.success("Upload successful: " + response.data.message);
    } catch (error) {
      toast.error("Bulk upload error: " + (error.response?.data?.message || error.message));
      console.error("Bulk upload error:", error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFilePreview("");
    }
  };

  return (
    <div className="px-7 py-4 w-full bg-green-300 rounded-xl shadow-lg border border-gray-300 m-4 flex gap-7">
      <div className="w-1/3 flex flex-col">
        <button
          className="flex items-center my-1 px-3 py-2 bg-green-600 text-white rounded-lg font-medium w-full hover:bg-green-700 transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Bulk Upload</h1>
       
        <select
          className="px-4 py-2 text-lg font-medium border border-gray-300 rounded-md bg-white mb-4"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
        <label className="cursor-pointer border border-gray-400 p-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex flex-col items-center transition-all">
          <Upload size={32} className="mb-3 text-gray-700" />
          <span className="text-gray-700 font-medium">
            {selectedFile ? selectedFile.name : `Upload ${fileType.toUpperCase()} File`}
          </span>
          <input type="file" accept={`.${fileType}`} onChange={handleFileChange} className="hidden" />
        </label>
        {selectedFile && (
          <button
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium w-full hover:bg-green-700 transition-all"
            onClick={handleBulkUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        )}
         <p className="text-sm text-gray-600 my-4">
          Ensure your file follows the correct format:
          <ul className="list-disc list-inside text-gray-600">
            <li>Each entry must have a unique URL. Even for 1 duplicate URL entire buld addition will fail</li>
            <li>tool_id is optional.</li>
            <li>tool_id is optional.</li>
            <li>Tool IDs should be unique; if omitted, they will be auto-generated.</li>
            <li>CSV files must have proper headers (e.g., name, URL).</li>
            <li>JSON structure should match the required schema.</li>
          </ul>
        </p>
      </div>
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-296 text-sm text-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 bg-green-300 rounded-lg px-2">Preview</h2>
        {filePreview ? (
          <pre>{filePreview.slice(0, 2000)}{filePreview.length > 2000 ? "..." : ""}</pre>
        ) : (
          <p className="text-gray-500">No file selected. Upload a file to preview its contents.</p>
        )}
      </div>
    </div>
  );
}
