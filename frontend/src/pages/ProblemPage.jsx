import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const API_BASE_URL = "https://online-judge-backend-jj0q.onrender.com/backend";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    // No search functionality, so this effect is no longer needed
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/signout`, {
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

  return (
    <Navbar className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <div className="flex items-center flex-shrink-0">
          <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
          <span className="text-xl tracking-tight">CodeCalorie</span>
        </div>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="orange"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          Toggle Theme
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
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
            <Button gradientDuoTone="pinkToOrange" outline>
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
        <Navbar.Link active={path === "/search"} as={"div"}>
          <Link to="/search">Posts</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
