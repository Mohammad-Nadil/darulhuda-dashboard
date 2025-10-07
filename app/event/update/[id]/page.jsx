"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import api from "../../../utils/axios";
import Loader from "../../../components/Loader";
import FileInput from "../../../components/FileInput";

const Page = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/event/${id}`);
        setTitle(res.data.data.title || "");
        setDate(
          res.data.data.date
            ? new Date(res.data.data.date).toISOString().split("T")[0]
            : ""
        );
        setDescription(res.data.data.description || "");
        setPreview(res.data.data.image.secure_url || null);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
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
      if (file) formData.append("image", file);

      await api.put(`/api/event/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated successfully!");
      router.push("/event");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="flex flex-col gap-6 md:p-6">
      <h2 className="text-2xl font-bold text-primary">Update Event</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="w-full">
          <div className="img md:w-1/3 aspect-video">
            <FileInput
              file={file}
              setFile={setFile}
              preview={preview}
              setPreview={setPreview}
            />
          </div>
          <div className="buttons"> </div>
        </div>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered w-full"
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
        <div className="flex justify-end gap-4">
          <Link href="/event" className="btn bg-primary text-primary-content">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn bg-gradient-to-r from-primary to-secondary text-white hover:bg-gradient-to-r hover:from-primary/70 hover:to-secondary/70 transition-all duration-300"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};
export default Page;
