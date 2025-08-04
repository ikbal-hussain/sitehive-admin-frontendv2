import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
// import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import NotFound from "./pages/NotFound"; // Import the NotFound component
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import BulkUpload from "./pages/BulkUpload";
import SignUpPage from "./pages/SignUpPage";
import AddTool from "./pages/AddTool";
import EditTool from "./pages/EditTool";
import Categories from "./pages/Categories";
import TagsManager from "./pages/TagsManager";

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

          {/* Protect Tools Route */}
          <Route
            path="/tools"
            element={
              <ProtectedRoute>
                <Tools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/edit/:id"
            element={
              <ProtectedRoute>
                <EditTool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/add"
            element={
              <ProtectedRoute>
                <AddTool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/bulk-upload"
            element={
              <ProtectedRoute>
                <BulkUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <TagsManager />
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
