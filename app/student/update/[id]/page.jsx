"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../utils/axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import Link from "next/link";
import FileInput from "../../../components/FileInput";

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [jamat, setJamat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    bloodGroup: "",
    dob: "",
    age: "",
    gender: "",
    className: "",
    branch: "",
    grade: "",
    rollNumber: "",
    fatherName: "",
    fatherOccupation: "",
    fatherMobile: "",
    motherName: "",
    motherOccupation: "",
    motherMobile: "",
    guardianName: "",
    guardianOccupation: "",
    guardianMobile: "",
    guardianRelation: "",
    previousSchool: "",
    previousClass: "",
    running: true,
    newStudent: true,
    presentAddress: "",
    permanentAddress: "",
    city: "",
    admissionFee: 0,
    monthlyFee: 0,
    foodFee: 0,
    othersFee: 0,
    totalFee: 0,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/api/student/${id}`);
        const response = res.data.data;
        setStudent({
          ...response,
          dob:
            response.dob && response.dob !== "null"
              ? new Date(response.dob).toISOString().split("T")[0]
              : "",
        });

        if (response) {
          setPreview(response.image.secure_url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
    const fetchJamat = async () => {
      try {
        const res = await api.get("/api/class");
        setJamat(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJamat();
  }, [id]);

  useEffect(() => {
    setStudent((prev) => ({
      ...prev,
      totalFee:
        Number(prev.admissionFee || 0) +
        Number(prev.monthlyFee || 0) +
        Number(prev.foodFee || 0) +
        Number(prev.othersFee || 0),
    }));
  }, [
    student.admissionFee,
    student.monthlyFee,
    student.foodFee,
    student.othersFee,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setStudent((prev) => ({ ...prev, [name]: checked }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(student).forEach((key) => {
        formData.append(key, student[key]);
      });
      if (file) {
        formData.append("image", file);
      }

      const response = await api.put(`/api/student/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/");
      toast.success("Student updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className=" mx-auto  pb-5">
      <Toaster position="top-center" />
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6">
        Add Student
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/6 flex ">
            <div className="aspect-[3/4] lg:aspect-square w-1/2 lg:w-full">
              <FileInput
                file={file}
                setFile={setFile}
                preview={preview}
                setPreview={setPreview}
              />
            </div>
          </div>
          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={student.name}
              onChange={handleChange}
              className="input input-bordered w-full md:col-span-2"
            />
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              value={student.rollNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <select
              name="className"
              value={student.className}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Class</option>
              {jamat.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <select
              name="branch"
              value={student.branch}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Branch</option>
              {["male", "female"].map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={student.age}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <select
              name="gender"
              value={student.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              name="bloodGroup"
              value={student.bloodGroup}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="dob"
              value={student.dob}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Parents Info */}
        <div className="space-y-6 ">
          <h2 className="text-xl font-bold text-indigo-600 border-b-2 border-indigo-100 pb-2 mb-4">
            Parents Info
          </h2>

          {/* Father Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-y-0 gap-x-4">
            <label className=" md:mb-2 text-gray-600 font-medium md:col-span-3">
              Father Details
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                name="fatherName"
                placeholder="Father Name"
                value={student.fatherName}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-lg transition"
              />
            </div>
            <input
              type="text"
              name="fatherOccupation"
              placeholder="Occupation"
              value={student.fatherOccupation}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-lg transition"
            />
            <input
              type="text"
              name="fatherMobile"
              placeholder="Mobile"
              value={student.fatherMobile}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-lg transition"
            />
          </div>

          {/* Mother Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-y-0 gap-x-4">
            <label className=" md:mb-2 text-gray-600 font-medium md:col-span-3">
              Mother Details
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                name="motherName"
                placeholder="Mother Name"
                value={student.motherName}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-pink-500 focus:ring focus:ring-pink-200 rounded-lg transition"
              />
            </div>
            <input
              type="text"
              name="motherOccupation"
              placeholder="Occupation"
              value={student.motherOccupation}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-pink-500 focus:ring focus:ring-pink-200 rounded-lg transition"
            />
            <input
              type="text"
              name="motherMobile"
              placeholder="Mobile"
              value={student.motherMobile}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-pink-500 focus:ring focus:ring-pink-200 rounded-lg transition"
            />
          </div>

          {/* Guardian Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-3 md:gap-y-0 gap-x-4">
          <label className=" md:mb-2 text-gray-600 font-medium md:col-span-4">
                Guardian Details
              </label>  <div className="flex flex-col">
              
              <input
                type="text"
                name="guardianName"
                placeholder="Guardian Name"
                value={student.guardianName}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg transition"
              />
            </div>
            <input
              type="text"
              name="guardianRelation"
              placeholder="Relation"
              value={student.guardianRelation}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg transition"
            />
            <input
              type="text"
              name="guardianOccupation"
              placeholder="Occupation"
              value={student.guardianOccupation}
              onChange={handleChange}
              className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg transition"
            />
            <div className="flex flex-col">
              <input
                type="text"
                name="guardianMobile"
                placeholder="Mobile"
                value={student.guardianMobile}
                onChange={handleChange}
                className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-200 rounded-lg transition"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="font-bold text-indigo-600">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              name="presentAddress"
              placeholder="Present Address"
              value={student.presentAddress}
              onChange={handleChange}
              className="input input-bordered w-full md:col-span-3"
            />
            <input
              type="text"
              name="permanentAddress"
              placeholder="Permanent Address"
              value={student.permanentAddress}
              onChange={handleChange}
              className="input input-bordered w-full md:col-span-2"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={student.city}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Fees */}
        <div>
          <h2 className="font-bold text-indigo-600 text-lg">Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              "admissionFee",
              "monthlyFee",
              "foodFee",
              "othersFee",
              "totalFee",
            ].map((field, i) => (
              <div key={i} className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700 capitalize">
                  {field.replace("Fee", " Fee")}
                </label>
                <input
                  type="number"
                  name={field}
                  value={student[field]}
                  onChange={handleChange}
                  readOnly={field === "totalFee"}
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={"/"} className="btn btn-outline">
            Back
          </Link>
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-white"
          >
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
