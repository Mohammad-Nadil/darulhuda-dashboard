"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBullhorn,
  FaSchool,
} from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();

  const menu = [
    // { name: "Home", link: "/", icon: <FaHome /> },
    { name: "Students", link: "/", icon: <FaUserGraduate /> },
    { name: "Teachers", link: "/teacher", icon: <FaChalkboardTeacher /> },
    { name: "Classes", link: "/class", icon: <FaSchool /> },
    { name: "Announcements", link: "/announcement", icon: <FaBullhorn /> },
    { name: "Events", link: "/event", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="w-1/6 h-full border-r border-gray-300 flex flex-col items-center py-14 gap-5">
      <div className="logo text-xl font-bold">Logo</div>
      <div className="menu px-4">
        <ul className="flex flex-col gap-4">
          {menu.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <li className="" key={index}>
                <a
                  href={item.link}
                  className={`flex items-center gap-3 p-2 rounded-md duration-300 ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-primary/15 hover:bg-primary/70 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="capitalize">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
