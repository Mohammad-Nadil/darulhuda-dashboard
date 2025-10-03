"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBullhorn,
  FaSchool,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Students", link: "/", icon: <FaUserGraduate /> },
    { name: "Teachers", link: "/teacher", icon: <FaChalkboardTeacher /> },
    { name: "Classes", link: "/class", icon: <FaSchool /> },
    { name: "Announcements", link: "/announcement", icon: <FaBullhorn /> },
    { name: "Events", link: "/event", icon: <FaCalendarAlt /> },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden w-full bg-white shadow-md flex items-center justify-between px-4 py-3 fixed top-0 z-50">
        <a href="/" className="text-xl font-bold">
          Logo
        </a>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar / Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-300
          w-52 p-6 flex flex-col gap-5 pt-20 lg:pt-14
          transform lg:translate-x-0 transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 z-40
        `}
      >
        <div className="logo text-xl font-bold hidden lg:block">Logo</div>
        <ul className="flex flex-col gap-4">
          {menu.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <li key={index}>
                <a
                  href={item.link}
                  className={`flex items-center gap-3 p-2 rounded-md duration-300 ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-primary/70 hover:text-white"
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

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 lg:hidden z-30"
        />
      )}
    </>
  );
};

export default Navbar;
