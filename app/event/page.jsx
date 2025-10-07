"use client";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axios";
import Link from "next/link";

const Card = ({ id, title, date, description, image, onDelete }) => {
  return (
    <div className="card bg-base-200 shadow-lg hover:drop-shadow-xl transition-all duration-300 rounded-lg group overflow-hidden">
      <figure className="aspect-video w-full  group-hover:scale-105 transition-transform duration-500">
        <img
          src={image && image.trim() !== "" ? image : "/eventPlaceHolder.png"}
          alt={title || "Untitled Event"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg font-bold">
          {title || "Untitled Event"}
        </h2>
        <p className="text-sm text-gray-500">
          {date ? new Date(date).toDateString() : new Date().toDateString()}
        </p>
        <p className="text-gray-700  line-clamp-3">
          {description || "No description available for this event."}
        </p>
        <div className="card-actions justify-end ">
          <Link
            href={`/event/update/${id}`}
            className="btn btn-primary hover:scale-115 transition-transform duration-300"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="btn bg-error text-error-content hover:scale-115 transition-transform duration-300"
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
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/event");
        setEvents(response.data.data || []);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/event/${id}`);
      toast.success("Event deleted successfully!");
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const description = event.description?.toLowerCase() || "";
    const date = event.date
      ? new Date(event.date).toDateString().toLowerCase()
      : "";

    return (
      title.includes(search.toLowerCase()) ||
      description.includes(search.toLowerCase()) ||
      date.includes(search.toLowerCase())
    );
  });

  if (loading) return <Loader />;

  return (
    <div className="py-4 flex flex-col h-full w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex  justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="input input-bordered w-full "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href="/event/add"
          className="btn hover:bg-primary duration-300 hover:text-primary-content"
        >
          Add <span className="hidden md:inline" >Event</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        {filteredEvents.length > 0 ? (
          <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                id={event._id}
                title={event.title}
                date={event.date}
                description={event.description}
                image={event.image?.secure_url}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 flex-1 flex items-center justify-center">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
