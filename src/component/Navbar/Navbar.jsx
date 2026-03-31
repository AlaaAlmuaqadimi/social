import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
// import Register from './../Register/Register';
// import Login from './../Login/Login';
import { CgProfile } from "react-icons/cg";
// import Home from './../Home/Home';
import { useContext } from "react";
import { AuthContext } from '../Context/AuthContext';
// import Notifications from "../Notifications/Notifications";
// import Profile from "../profile/Profile";
import { Badge, Button } from "@heroui/react";
// import ChangePasswordPage from "../ChangePassword/ChangePasswordPage";
// import Home from "../Home/Home";
import { IoMdHome } from "react-icons/io";


export const AcmeLogo = () => {
  return (

    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>

  );
};

export const NotificationIcon = ({ size, height, width, ...props }) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};
export default function myNavbar() {
  const { userToken, crearUserToken } = useContext(AuthContext)
  const { id } = useContext(AuthContext);
  const isUserToken = !!userToken
  const navegat = useNavigate()

  function handelLogout() {
    localStorage.removeItem('Tkn');
    crearUserToken();
    navegat('/login')

  }

  return (
    <>
      {isUserToken ? <>    <Navbar className='bg-gradient-to-r from-pink-600 to-orange-600 text-white '>

        <NavbarBrand>
          <p className="font-bold text-inheriZ">SOCIAL</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {/* <NavbarItem>
            <Link color="foreground" to='/Register'>
              Register
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" to='/'>
              Login
            </Link>
          </NavbarItem> */}
          <NavbarItem >
            <Link color="foreground" to='/'>
            <IoMdHome size={29}/>  
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to={`/Profile`}>
              <CgProfile size={29} />
            </Link>
          </NavbarItem>
          <Link color="foreground" to='/Notifications'>
            <Badge color="danger" content="99+" shape="circle">
              <Button isIconOnly aria-label="more than 99 notifications" radius="full" variant="light">
                <NotificationIcon size={29} />
              </Button>
            </Badge>
          </Link>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" className="bg-orange-500 rounded-3xl" variant="flat">
              <DropdownItem key="settings">
                <Link to='/Profile'>Profile</Link>
              </DropdownItem>
              <DropdownItem key="settings">
                <Link to='/ChangePasswordPage'>
                  Chane Password
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" className=" text-red-700" color="danger" onClick={handelLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar> </> : ``}
    </>
  );
}
