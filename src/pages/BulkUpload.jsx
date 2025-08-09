import { useState } from "react";
import useToolStore from "../store/toolStore";
import { Upload, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function BulkUpload() {
  const { fetchTools } = useToolStore();
  const navigate = useNavigate();

  // Main textarea state
  const [bulkInput, setBulkInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [uploading, setUploading] = useState(false);

  // File upload (secondary)
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [fileType, setFileType] = useState("json");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  // Handle textarea upload
  const handleBulkInputUpload = async () => {
    setInputError("");
    let parsedData;
    try {
      parsedData = JSON.parse(bulkInput);
      if (!Array.isArray(parsedData)) {
        setInputError("Input must be a JSON array of tools.");
        return;
      }
    } catch (err) {
      setInputError("Invalid JSON format.");
      return;
    }
    setUploading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL_ADMIN_BACKEND}/api/tools/bulk/json`;
      const response = await axios.post(apiUrl, parsedData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchTools();
      toast.success("Upload successful: " + response.data.message);
      setBulkInput("");
    } catch (error) {
      toast.error("Bulk upload error: " + (error.response?.data?.message || error.message));
      setInputError(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  // File upload handlers (secondary)
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

  const handleBulkFileUpload = async () => {
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
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setFilePreview("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col gap-8">
      <div className="flex items-center mb-4">
        <button
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-semibold ml-6 text-gray-800">Bulk Upload Tools</h1>
      </div>

      {/* Main textarea input */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-gray-700 mb-1">
          Paste JSON Array of Tools
        </label>
        <textarea
          className="w-full min-h-[220px] max-h-[400px] p-4 border-2 border-green-400 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-base bg-green-50 resize-y"
          placeholder={`[\n  {\n    "name": "Tool 1",\n    "URL": "https://...",\n    "shortDesc": "...",\n    "longDesc": "...",\n    "categories": [...],\n    "tags": [...]\n  },\n  ...\n]`}
          value={bulkInput}
          onChange={e => setBulkInput(e.target.value)}
          spellCheck={false}
        />
        <div className="flex items-center gap-4 mt-2">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow"
            onClick={handleBulkInputUpload}
            disabled={uploading}
            type="button"
          >
            {uploading ? "Uploading..." : "Validate & Upload"}
          </button>
          {inputError && (
            <span className="text-red-600 font-medium">{inputError}</span>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          <ul className="list-disc list-inside">
            <li>Paste a valid JSON array of tool objects.</li>
            <li>Each entry must have a unique URL. Duplicate URLs will cause the upload to fail.</li>
            <li><code>tool_id</code> is optional and will be auto-generated if omitted.</li>
            <li>Categories and tags should match existing or intended values.</li>
          </ul>
        </div>
      </div>

      {/* Collapsible file upload section */}
      <div className="mt-6">
        <button
          className="flex items-center text-green-700 font-semibold hover:underline focus:outline-none"
          type="button"
          onClick={() => setShowFileUpload(v => !v)}
        >
          <span className="mr-2">{showFileUpload ? "Hide" : "Show"} File Upload Options</span>
          {showFileUpload ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showFileUpload && (
          <div className="mt-4 p-6 bg-green-50 border border-green-200 rounded-xl flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <label className="font-medium text-gray-700">File Type:</label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md bg-white"
                value={fileType}
                onChange={e => setFileType(e.target.value)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
              <label className="cursor-pointer border border-gray-400 p-3 rounded-lg bg-white hover:bg-gray-100 flex items-center transition-all ml-4">
                <Upload size={22} className="mr-2 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  {selectedFile ? selectedFile.name : `Upload ${fileType.toUpperCase()} File`}
                </span>
                <input
                  type="file"
                  accept={fileType === "json" ? ".json" : ".csv"}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <button
                  className="ml-4 px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                  onClick={handleBulkFileUpload}
                  disabled={uploading}
                  type="button"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              )}
            </div>
            {filePreview && (
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 overflow-auto max-h-48 text-xs text-gray-700 mt-2">
                <div className="font-semibold mb-1 text-green-700">File Preview</div>
                <pre>{filePreview.slice(0, 2000)}{filePreview.length > 2000 ? "..." : ""}</pre>
              </div>
            )}
            <div className="text-xs text-gray-600 mt-2">
              <ul className="list-disc list-inside">
                <li>JSON: Must be an array of tool objects.</li>
                <li>CSV: Must have proper headers (e.g., name, URL, etc.).</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
