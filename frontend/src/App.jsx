// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contests from "./pages/Contests";
// import SignIn from "./pages/SignIn";
// import Dashboard from "./pages/Dashboard";
// import Problems from "./pages/Problems";
// import SignUp from "./pages/SignUp";
// import Header from "./components/Header";
// import FeatureSection from "./components/FeatureSection";
// import Footer from "./components/Footer";
// import PrivateRoute from "./components/PrivateRoute";
// import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
// import CreatePost from "./pages/CreatePost";
// import CreateProblem from "./pages/CreateProblem";
// import UpdatePost from "./pages/UpdatePost";
// import UpdateProblem from "./pages/UpdateProblem";
// import PostPage from "./pages/PostPage";
// import ScrollToTop from "./components/ScrollToTop";
// import Search from "./pages/Search";
// import SearchProblem from "./pages/SearchProblem";
// import ProblemPage from "./pages/ProblemPage";
// import DashProblems from "./components/DashProblems";
// import ContactUs from "./pages/ContactUs";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <ScrollToTop />
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />

//         <Route path="/contactus" element={<ContactUs />} />
//         <Route path="/sign-in" element={<SignIn />} />
//         <Route path="/sign-up" element={<SignUp />} />
//         <Route path="/search" element={<Search />} />
//         <Route path="/problems" element={<Problems />} />
//         <Route path="/contests" element={<Contests />} />
//         <Route path="/post/:postSlug" element={<PostPage />} />
//         <Route path="/search-problems" element={<SearchProblem />} />
//         <Route path="/problem/:problemId" element={<ProblemPage />} />
//         <Route element={<PrivateRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>
//         <Route element={<OnlyAdminPrivateRoute />}>
//           <Route path="/create-post" element={<CreatePost />} />
//           <Route path="/create-problem" element={<CreateProblem />} />
//           <Route path="/update-post/:postId" element={<UpdatePost />} />
//           <Route
//             path="/update-problem/:problemId"
//             element={<UpdateProblem />}
//           />
//         </Route>
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import your AuthContext
import Home from "./pages/Home";
import About from "./pages/About";
import Contests from "./pages/Contests";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import CreateProblem from "./pages/CreateProblem";
import UpdatePost from "./pages/UpdatePost";
import UpdateProblem from "./pages/UpdateProblem";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import SearchProblem from "./pages/SearchProblem";
import ProblemPage from "./pages/ProblemPage";
import ContactUs from "./pages/ContactUs";

export default function App() {
  const { user } = useAuth(); // Check if the user is authenticated

  return (
    <BrowserRouter>
      <ScrollToTop />
      {user && <Header />} {/* Hide Header if not logged in */}
      <Routes>
        {!user ? (
          <>
            {/* Public routes before login */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            {/* Redirect all other routes to SignIn */}
            <Route path="*" element={<Navigate to="/sign-in" />} />
          </>
        ) : (
          <>
            {/* Protected routes after login */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/search" element={<Search />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/post/:postSlug" element={<PostPage />} />
            <Route path="/search-problems" element={<SearchProblem />} />
            <Route path="/problem/:problemId" element={<ProblemPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-problem" element={<CreateProblem />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
              <Route
                path="/update-problem/:problemId"
                element={<UpdateProblem />}
              />
            </Route>

            {/* Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      {user && <Footer />} {/* Hide Footer if not logged in */}
    </BrowserRouter>
  );
}
