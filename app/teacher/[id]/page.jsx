"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { Image } from "antd";
import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";

// helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [teacherClass, setTeacherClass] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await api.get(`/api/teacher/${id}`);
        const data = res.data.data;

        const teacherData = {
          name: data.name || "-",
          dob: data.dob || "-",
          age: data.age || "-",
          phone: data.phone || "-",
          gender: data.gender || "-",
          address: data.address || "-",
          imageUrl: data.image?.secure_url || "",
          education: data.education || "-",
          joining_date: data.joining_date || "-",
          className: data.className || null,
          branch: data.branch || "-",
          salary: data.salary || 0,
        };

        setTeacher(teacherData);

        if (teacherData.className) {
          const resClass = await api.get(`/api/class/${teacherData.className}`);
          setTeacherClass(resClass.data.data || null);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/teacher/${id}`);
      toast.success("Teacher deleted successfully!");
      router.push("/teacher");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!teacher) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 font-semibold">Teacher not found!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full card flex flex-col gap-3 py-5 bg-base-100">
        {/* Header */}
        <div className="items-center text-center">
          <div className="avatar w-full">
            <div className="w-32 h-40 rounded-xl shadow-md overflow-hidden">
              <Image
                src={teacher.imageUrl || "/studentPlaceholder.jpg"}
                alt={teacher.name}
                className="object-cover"
              />
            </div>
          </div>
          <h2 className="card-title mt-3 text-2xl font-bold text-primary">
            {teacher.name}
          </h2>
        </div>

        {/* Details */}
        <div className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Age:</span> {teacher.age}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Joining Date:</span>{" "}
              {formatDate(teacher.joining_date)}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Phone:</span> {teacher.phone}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Classes:</span>{" "}
              {teacherClass?.name || "-"}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Branch:</span> {teacher.branch}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Education:</span> {teacher.education}
            </div>
            <div className="p-3 rounded-lg bg-base-200 md:col-span-2">
              <span className="font-semibold">Address:</span> {teacher.address}
            </div>
            <div className="p-3 rounded-lg bg-base-200">
              <span className="font-semibold">Salary:</span> ৳{teacher.salary}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions flex justify-end sm:justify-between pb-6">
          <div className="flex gap-3">
            <Link
              href={`/teacher/update/${id}`}
              className="btn btn-primary gap-2 hover:bg-indigo-600 hover:text-white hover:scale-105 transition transform duration-300"
            >
              <FiEdit className="text-lg" />
              Edit Teacher
            </Link>
            <button
              className="btn btn-error gap-2 hover:bg-red-600 hover:text-white hover:scale-105 transition transform duration-300"
              onClick={handleDelete}
            >
              <FiTrash2 className="text-lg" />
              Delete Teacher
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/teacher")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
