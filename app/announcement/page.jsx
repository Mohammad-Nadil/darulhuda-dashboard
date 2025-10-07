"use client";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axios";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa";

const Card = ({ id, title, date, description, image, onDelete, time }) => {
  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg group overflow-hidden">
      <figure className="aspect-video w-full group-hover:scale-105 transition-transform duration-500">
        <img
          src={image && image.trim() !== "" ? image : "/eventPlaceHolder.png"}
          alt={title || "Untitled Announcement"}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title text-lg font-bold">
          {title || "Untitled Announcement"}
        </h2>
        <div className="flex">
          <p className="text-sm text-gray-500">
            {date ? new Date(date).toDateString() : new Date().toDateString()}
          </p>
          <p>{time}</p>
        </div>
        <p className="text-gray-700  line-clamp-3">
          {description || "No description available for this announcement."}
        </p>
        <div className="card-actions justify-end ">
          <Link
            href={`/announcement/update/${id}`}
            className="btn btn-primary hover:scale-115 duration-300 transition-all"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="btn bg-error text-error-content hover:scale-115 duration-300 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/api/announcement");
        setAnnouncements(response.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/announcement/${id}`);
      toast.success("Announcement deleted successfully!");
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    const title = ann.title?.toLowerCase() || "";
    const description = ann.description?.toLowerCase() || "";
    const date = ann.date
      ? new Date(ann.date).toDateString().toLowerCase()
      : "";

    return (
      title.includes(search.toLowerCase()) ||
      description.includes(search.toLowerCase()) ||
      date.includes(search.toLowerCase())
    );
  });

  if (loading) return <Loader />;

  return (
    <div className=" flex flex-col h-full w-full py-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search announcements..."
          className="input input-bordered lg:w-full lg:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href="/announcement/add"
          className="btn hover:bg-primary duration-300 hover:text-primary-content"
        >
          Add <span className="hidden sm:inline">Announcement</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        {filteredAnnouncements.length > 0 ? (
          <div className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((ann) => (
              <Card
                key={ann._id}
                id={ann._id}
                title={ann.title}
                date={ann.date}
                description={ann.description}
                image={ann.file?.secure_url}
                time={ann.time}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 flex-1 flex items-center justify-center">
            No announcements found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
