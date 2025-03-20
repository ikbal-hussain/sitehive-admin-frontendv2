import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-900 text-center">
      <h1 className="text-7xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
        Oops! The page you are looking for doesn't exist.
      </p>
      
      <Link to="/" className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
        <ArrowLeft size={20} />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
