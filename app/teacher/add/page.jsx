"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import api from "../../utils/axios";
import Loader from "../../components/Loader";
import FileInput from "../../components/FileInput";
import Link from "next/link";

const Page = () => {
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

  // Fetch Jamat
  useEffect(() => {
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
  }, []);

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

      if (file) {
        formData.append("image", file); // file field backend e 'image'
      }

      if (form.className === "" || form.name === "") {
        toast.error("Please fill all required fields");
        return;
      }

      await api.post("/api/teacher", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Teacher added successfully!");

      router.push("/teacher");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center ">
      <Toaster position="top-center" />
      <div className="card w-full   ">
        {/* Header */}
        <h2 className="text-2xl font-bold text-primary  ">Add New Teacher</h2>

        {/* Body */}
        <div className="py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image Upload */}
            <div className=" w-1/2 md:w-1/4">
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
            <div className="md:col-span-2 flex justify-end gap-x-5 ">
              <Link
                href="/teacher"
                className=" btn
               btn-primary
                px-8 hover:scale-110 duration-300 transition-all"
              >
                back
              </Link>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-primary to-secondary text-white px-8 hover:scale-110 duration-300 transition-all"
              >
                Add Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
