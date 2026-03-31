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
  Badge,
  Button,
} from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { IoMdHome } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from '../Context/AuthContext';

// أيقونة التنبيهات بتصميم متناسق
export const NotificationIcon = ({ size = 24, ...props }) => (
  <svg fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function MyNavbar() {
  const { userToken, crearUserToken } = useContext(AuthContext);
  const isUserToken = !!userToken;
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('Tkn');
    crearUserToken();
    navigate('/login');
  }

  return (
    <>
      {isUserToken && (
        <Navbar 
          isBordered 
          className="bg-[#0B2C5A] text-white shadow-lg"
          maxWidth="xl"
        >
          <NavbarBrand>
            <div className="flex items-center gap-2">
              <div className="bg-white text-[#0B2C5A] p-1.5 rounded-lg font-black text-xl">S</div>
              <p className="font-black text-xl tracking-tighter italic">SAITY</p>
            </div>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex gap-8" justify="center">
            <NavbarItem>
              <Link to="/" className="text-white/80 hover:text-white transition-all hover:scale-110 block">
                <IoMdHome size={26} />
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/Profile" className="text-white/80 hover:text-white transition-all hover:scale-110 block">
                <CgProfile size={26} />
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/Notifications">
                <Badge color="danger" content="5" shape="circle" size="sm">
                  <NotificationIcon className="text-white/80 hover:text-white transition-all" size={26} />
                </Badge>
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-2 ring-white/20"
                  color="default"
                  size="sm"
                  src="https://i.pravatar.cc/150"
                />
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Profile Actions" 
                className="bg-white text-[#0B2C5A] rounded-2xl p-2" 
                variant="flat"
              >
                <DropdownItem key="profile" className="rounded-xl">
                  <Link to='/Profile' className="w-full block font-semibold">My Profile</Link>
                </DropdownItem>
                <DropdownItem key="settings" className="rounded-xl">
                  <Link to='/ChangePasswordPage' className="w-full block font-semibold">Security Settings</Link>
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  className="text-red-500 rounded-xl hover:!bg-red-50" 
                  color="danger" 
                  onClick={handleLogout}
                >
                  <span className="font-bold">Log Out</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
      )}
    </>
  );
}