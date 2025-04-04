import { Menu, X } from "lucide-react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { navItems } from "../constants";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/backend/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Codecalorie
        </span>
      </Link>

      {/* Desktop Search Bar */}
      <form onSubmit={handleSubmit} className="hidden lg:inline">
        <TextInput
          type="text"
          placeholder="Search a post..."
          rightIcon={AiOutlineSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* Mobile Search Button - Now Wrapped in a Form */}
      <form onSubmit={handleSubmit} className="lg:hidden">
        <Button className="w-12 h-10" color="gray" pill type="submit">
          <AiOutlineSearch />
        </Button>
      </form>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          // <Dropdown
          //   arrowIcon={false}
          //   inline
          //   label={
          //     <Avatar alt="user" img={currentUser.profilePicture} rounded />
          //   }
          // >
          //   <Dropdown.Header>
          //     <span className="block text-sm">@{currentUser.username}</span>
          //     <span className="block text-sm font-medium truncate">
          //       {currentUser.email}
          //     </span>
          //   </Dropdown.Header>
          //   <Link to={"/dashboard?tab=profile"}>
          //     <Dropdown.Item>Profile</Dropdown.Item>
          //   </Link>
          //   <Dropdown.Divider />
          //   <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          // </Dropdown>
          <Dropdown arrowIcon={false} inline label={<FaUserCircle size={32} />}>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/contests"} as={"div"}>
          <Link to="/contests">Contests</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/search-problems"} as={"div"}>
          <Link to="/search-problems">Problems</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
