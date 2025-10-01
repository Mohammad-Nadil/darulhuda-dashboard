"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../../../utils/axios";
import Loader from "../../../components/Loader";
import Link from "next/link";
import FileInput from "../../../components/FileInput";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jamat, setJamat] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    education: "",
    joining_date: "",
    className: "",
    branch: "",
    salary: "",
  });

  //Fetch Teacher
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/teacher/${id}`);
        setForm({
          name: response.data.data.name || "",
          dob: response.data.data.dob || "",
          phone: response.data.data.phone || "",
          age: response.data.data.age || "",
          gender: response.data.data.gender || "",
          address: response.data.data.address || "",
          education: response.data.data.education || "",
          joining_date: response.data.data.joining_date || "",
          className: response.data.data.className || "",
          branch: response.data.data.branch || "",
          salary: response.data.data.salary || "",
        });
        if (response.data.data) {
          setPreview(response.data.data.image.secure_url);
        }
      } catch (error) {
        console.error("Error fetching teacher:", error);
        toast.error("Failed to fetch teacher data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchJamat = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/class");
        setJamat(response.data.data);
      } catch (error) {
        console.error("Error fetching jamat:", error);
        toast.error("Failed to fetch jamat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchJamat();
    fetchTeacher();
  }, [id]);


  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      // use form state values
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) formData.append("image", file);

      await api.put(`/api/teacher/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Teacher updated successfully!");
      router.push("/teacher");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="card w-full   ">
        {/* Header */}
        <h2 className="text-2xl font-bold text-primary  ">Update Teacher</h2>

        {/* Body */}
        <div className="card-body">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image Upload */}
            <div className="w-1/4">
              <FileInput
                file={file}
                setFile={setFile}
                preview={preview}
                setPreview={setPreview}
                className=" !aspect-[5/6] "
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="label-text font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary "
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="label-text font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="label-text font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Age */}
              <div>
                <label className="label-text font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="label-text font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="select select-bordered w-full focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select gender</option>
                  {["male", "female"].map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div className="md:col-span-2">
                <label className="label-text font-medium">Education</label>
                <input
                  type="text"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-3">
                <label className="label-text font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="label-text font-medium">Joining Date</label>
                <input
                  type="date"
                  name="joining_date"
                  value={form.joining_date}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="label-text font-medium">Branch</label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="select select-bordered w-full focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select branch</option>
                  {["male", "female"].map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="label-text font-medium">Class</label>
                <select
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  className="select select-bordered w-full focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select class</option>
                  {jamat.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="label-text font-medium">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            {/* Submit */}
            <div className="md:col-span-2 flex justify-end gap-5 ">
              <Link
                href={`/teacher/${id}`}
                className="btn bg-primary text-primary-content px-8 "
              >
                back
              </Link>{" "}
              <button
                type="submit"
                className="btn bg-gradient-to-r from-primary to-secondary text-primary-content px-8"
              >
                Update Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
