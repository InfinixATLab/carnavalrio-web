import {
  BrowserRouter, 
  Routes, 
  Route,
  Outlet,
  Navigate,
  useParams,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Management from "./pages/staff/Management";
import ProtectedRoute from "./services/ProtectedRoute";
import Publish from "./pages/staff/Publish";
import Article from "./pages/Article";
import Edit from "./pages/staff/Edit";
import RoleProtectedRoute from "./services/RoleProtectedRoute";
import MyAccount from "./pages/MyAccount";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Advertise from "./pages/Advertise";

function LegacyArticleRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/${slug}`} replace />;
}

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element = {
            <Home />
          }
        />
        <Route
          path="/infinix/"
          element = {
            <Login />
          }
        />
        <Route path="/login" element={<Navigate to="/infinix/" replace />} />
        <Route
          path = "/logout"
          element = {
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path = "/me"
          element = {
            <ProtectedRoute>
              <RoleProtectedRoute><MyAccount /></RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element = {
            <ProtectedRoute><RoleProtectedRoute><Register /></RoleProtectedRoute></ProtectedRoute>
          }
        />
        <Route
          path="/management"
          element = {
            <ProtectedRoute>
              <RoleProtectedRoute>
                <Outlet />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Management />}/>
          <Route path="publish" element={<Publish />}/>
          <Route path="edit/:slug" element={<Edit />}/>
        </Route>
        <Route path="/radar/:slug" element={<LegacyArticleRedirect />} />
        <Route
          path="/:slug"
          element = {
            <Article />
          }
        />
        <Route
          path="/privacy-policy"
          element = {
            <PrivacyPolicy />
          }
        />
        <Route
          path="/terms"
          element = {
            <Terms />
          }
        />
        <Route
          path="/contact"
          element = {
            <Contact />
          }
        />
        <Route
          path="/advertise"
          element = {
            <Advertise />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
