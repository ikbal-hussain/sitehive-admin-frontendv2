import { useState } from "react";
import useToolStore from "../store/toolStore";
import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function BulkUpload() {
  const { fetchTools } = useToolStore();
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
        // Read file as JSON and send as a normal object
        const parsedData = JSON.parse(filePreview);
        response = await axios.post(apiUrl, parsedData, {
          headers: { "Content-Type": "application/json" },
        });
      } else if (fileType === "csv") {
        // Keep CSV upload as FormData
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
    <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-300">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Bulk Upload</h1>
      <p className="text-sm text-gray-600 mb-4">
        Ensure your file follows the correct format:
        <ul className="list-disc list-inside text-gray-600">
          <li>Each entry must have a unique URL.</li>
          <li>Tool IDs should be unique; if omitted, they will be auto-generated.</li>
          <li>CSV files must have proper headers (e.g., tool_id, name, URL).</li>
          <li>JSON structure should match the required schema.</li>
        </ul>
      </p>
      <div className="flex justify-center mb-6">
        <select
          className="px-6 py-2 text-lg font-medium border border-gray-300 rounded-md"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </div>
      <label className="cursor-pointer border border-gray-400 p-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex flex-col items-center transition-all">
        <Upload size={32} className="mb-3 text-gray-700" />
        <span className="text-gray-700 font-medium">
          {selectedFile ? selectedFile.name : `Upload ${fileType.toUpperCase()} File`}
        </span>
        <input type="file" accept={`.${fileType}`} onChange={handleFileChange} className="hidden" />
      </label>
      {filePreview && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-auto max-h-40 text-sm text-gray-700">
          <pre>{filePreview.slice(0, 500)}{filePreview.length > 500 ? "..." : ""}</pre>
        </div>
      )}
      {selectedFile && (
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium w-full hover:bg-green-700 transition-all"
          onClick={handleBulkUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      )}
    </div>
  );
}
