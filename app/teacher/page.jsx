"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import Loader from "../components/Loader";
import { Image } from "antd";
import { Toaster } from "react-hot-toast";

const TeacherPage = () => {
  const router = useRouter();
  const [classList, setClassList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const res = await api.get("/api/teacher"); 
        setClassList(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassList();
  }, []);

  // 🔎 Filter by flattened teacher fields
  const filterTeachers = (teachers) => {
    if (!search) return teachers;
    const lowerSearch = search.toLowerCase();

    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(lowerSearch) ||
        t.phone?.toString().includes(lowerSearch) ||
        t.gender?.toLowerCase().includes(lowerSearch) ||
        t.education?.toLowerCase().includes(lowerSearch) ||
        t.branch?.toLowerCase().includes(lowerSearch)
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-5 h-full w-full">
      <Toaster position="top-center" reverseOrder={false} />
      {/* 🔍 Search Bar */}
      <div className="flex justify-between gap-3">
        <input
          type="search"
          placeholder="Search teacher by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-2/3 shadow-sm"
        />
        <Link
          href="/teacher/add"
          className="btn hover:bg-primary duration-300 hover:text-primary-content"
        >
          Add Teacher
        </Link>
      </div>

      <div className="overflow-auto flex flex-col gap-y-10 font-semibold">
        {classList.map((cls) => {
          const filtered = filterTeachers(cls.teachersOfClass);
          if (filtered.length === 0) return null;

          return (
            <div key={cls._id} className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">{cls.name}</h1>
              <table className="table table-zebra w-full shadow-lg">
                <thead className="bg-primary text-white">
                  <tr className="text-center" >
                    <th>Image</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th className="hidden sm:table-cell ">Education</th>
                    <th className="hidden sm:table-cell ">Branch</th>
                  </tr>
                </thead>
                <tbody className="" >
                  {filtered.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className=" cursor-pointer hover:bg-primary/15 duration-300"
                      onClick={() => router.push(`/teacher/${teacher._id}`)}
                    >
                      <td className="py-1" >
                        <div className="avatar">
                          <div className="w-12 h-16">
                            <Image
                              preview={false}
                              src={
                                teacher?.image?.secure_url?.trim()
                                  ? teacher.image.secure_url
                                  : "/studentPlaceholder.jpg"
                              }
                              alt={teacher?.name || "Teacher"}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{teacher.name}</td>
                      <td>{teacher.phone}</td>
                      <td className="hidden sm:table-cell px-1">{teacher.education}</td>
                      <td className="hidden sm:table-cell ">{teacher.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPage;
