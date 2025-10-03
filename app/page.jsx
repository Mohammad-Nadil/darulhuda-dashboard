"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "./utils/axios";
import Loader from "./components/Loader";
import { Image } from "antd";
import { Toaster } from "react-hot-toast";

const StudentPage = () => {
  const router = useRouter();
  const [classList, setClassList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const res = await api.get("/api/class");
        setClassList(res.data.data);
        // toast.success("Class list fetched successfully!");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassList();
  }, []);

  // 🔎 Filter by flattened fields
  const filterStudents = (students) => {
    if (!search) return students;
    const lowerSearch = search.toLowerCase();

    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(lowerSearch) ||
        s.rollNumber?.toString().includes(lowerSearch) ||
        s.age?.toString().includes(lowerSearch) ||
        s.city?.toLowerCase().includes(lowerSearch) ||
        s.fatherName?.toLowerCase().includes(lowerSearch) ||
        s.motherName?.toLowerCase().includes(lowerSearch) ||
        s.totalFee?.toString().includes(lowerSearch)
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-5 pt-5 h-full w-full">
      <Toaster position="top-center" reverseOrder={false} />
      {/* 🔍 Search Bar */}
      <div className="flex justify-between gap-3">
        <input
          type="search"
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered sm:w-2/3 shadow-sm"
        />
        <Link
          href="/student/add"
          className="btn hover:bg-primary duration-300 hover:text-primary-content "
        >
          Add <span className="hidden sm:inline" >Student</span>
        </Link>
      </div>

      <div className="overflow-auto flex flex-col gap-y-10 font-semibold">
        {classList.map((cls) => {
          const filtered = filterStudents(cls.studentsOfClass);
          if (filtered.length === 0) return null;

          return (
            <div key={cls._id} className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">{cls.name}</h1>
              <table className="table table-zebra w-full shadow-lg">
                <thead className="bg-primary text-white">
                  <tr className="text-center">
                    <th className="">Image</th>
                    <th>Name</th>
                    <th>Roll</th>
                    <th className="hidden sm:table-cell">Age</th>
                    <th className="hidden sm:table-cell">Father</th>
                    <th className="hidden sm:table-cell">Mother</th>
                    <th className="hidden sm:table-cell">City</th>
                    <th className="hidden sm:table-cell">Total Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr
                      key={student._id}
                      className="cursor-pointer hover:bg-primary/15 duration-300 text-center "
                      onClick={() => router.push(`/student/${student._id}`)}
                    >
                      <td className="" >
                        <div className="avatar">
                          <div className="w-12 h-16 ">
                            <Image
                              preview={false}
                              src={
                                student?.image?.secure_url &&
                                student.image.secure_url.trim() !== ""
                                  ? student.image.secure_url
                                  : "studentPlaceholder.jpg"
                              }
                              alt={student?.name || "Student"}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td className="hidden sm:table-cell">{student.age}</td>
                      <td className="hidden sm:table-cell">
                        {student.fatherName} <br />
                        {student.fatherOccupation} <br />
                        {student.fatherMobile}
                      </td>
                      <td className="hidden sm:table-cell">
                        {student.motherName} <br />
                        {student.motherOccupation} <br />
                        {student.motherMobile}
                      </td>
                      <td className="hidden sm:table-cell">{student.city}</td>
                      <td className="hidden sm:table-cell">
                        {student.totalFee}
                      </td>
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

export default StudentPage;
