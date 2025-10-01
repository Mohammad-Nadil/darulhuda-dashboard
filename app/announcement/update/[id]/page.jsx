"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaArrowsAltH, FaArrowsAltV, FaCloudUploadAlt } from "react-icons/fa";
import api from "../../../utils/axios";
import Loader from "../../../components/Loader";
import FileInput from "../../../components/FileInput";

const Page = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [vertical, setVertical] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/announcement/${id}`);
        console.log(res.data.data);

        setTitle(res.data.data.title);
        setDate(res.data.data.date ? res.data.data.date.split("T")[0] : "");
        setTime(res.data.data.time || "");
        setDescription(res.data.data.description);
        setVertical(res.data.data.vertical);
        setPreview(res.data.data.file.secure_url);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch announcement");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("time", time);
      formData.append("vertical", vertical);
      if (file) formData.append("file", file);
      await api.put(`/api/announcement/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/announcement");
      toast.success("Announcement updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold text-primary">Update Announcement</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File Upload */}
        <div className="w-full flex justify-between ">
          <div className={`img w-2/3 h-60   flex ${vertical ? "" : ""}`}>
            <div className={` ${vertical ? "" : " h-2/3"}`}>
              <FileInput
                file={file}
                setFile={setFile}
                preview={preview}
                setPreview={setPreview}
                className={vertical ? "aspect-[7/10]" : "aspect-video"}
              />
            </div>
          </div>
          <div className="flex gap-5 w-1/3">
            <div className="flex flex-col gap-3 items-center w-2/3 py-3 justify-top ">
              <button
                type="button"
                onClick={() => setVertical(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-md hover:scale-105 hover:shadow-lg w-full justify-center ${
                  vertical
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-primary-content text-primary"
                }`}
              >
                <FaArrowsAltV className="text-lg" /> Vertical
              </button>
              <button
                type="button"
                onClick={() => setVertical(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-md hover:scale-105 hover:shadow-lg w-full justify-center ${
                  !vertical
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-primary-content text-primary "
                }`}
              >
                <FaArrowsAltH className="text-lg" /> Horizontal
              </button>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input input-bordered w-full "
          />
        </div>
        <textarea
          placeholder="Announcement Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
        <div className="flex justify-end gap-4">
          <Link
            href="/announcement"
            className="btn bg-primary text-primary-content"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-white hover:bg-gradient-to-r hover:from-primary/70 hover:to-secondary/70 transition-all duration-300"
          >
            Update Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
