import MenuIcon from "@/assets/icons/MenuIcon";
import TextButton from "@/components/shared/atoms/buttons/TextButton";
import React from "react";

interface IProps {}

const AdminNavbar: React.FC<IProps> = () => {
  return (
    <nav className="h-[70px] w-[100%] navbar navbar-base">
      <div className="navbar-start">
        <div className="dropdown">
          <TextButton icon={<MenuIcon />} />
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-end">{/** */}</div>
    </nav>
  );
};

export default AdminNavbar;
