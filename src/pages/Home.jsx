import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import useToolStore from "../store/toolStore";

const Home = () => {

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 space-y-6">
      <Link
        to="/dashboard"
        className="px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold rounded-3xl flex items-center gap-4 shadow-lg transition-transform transform hover:scale-105"
      >
        <LayoutDashboard size={40} />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;