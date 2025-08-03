import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
// import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import NotFound from "./pages/NotFound"; // Import the NotFound component
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import BulkUpload from "./pages/BulkUpload";
import SignUpPage from "./pages/SignUpPage";

function App() {
  // useAxiosInterceptor();
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <main className="mt-17">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Protect Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulk-upload"
            element={
              <ProtectedRoute>
                <BulkUpload />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
