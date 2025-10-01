"use client";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import api from "../utils/axios";
import toast from "react-hot-toast";

const Card = ({
  id,
  name,
  totalStudents,
  className,
  onDelete,
  onEdit,
  editingId,
  editName,
  setEditName,
  saveEdit,
  cancelEdit,
}) => {
  const isEditing = editingId === id;

  return (
    <div className={`card bg-base-100 card-lg shadow border ${className || ""}`}>
      <div className="card-body px-6 py-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input input-bordered w-full"
            />
            <div className="justify-end card-actions mt-2">
              <button
                onClick={() => saveEdit(id)}
                className="btn btn-success text-white hover:bg-success/50 duration-300"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="btn btn-warning hover:bg-warning/50 duration-300"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="card-title">{name || "No Name"}</h2>
            <p>Total number of students: {totalStudents ?? 0}</p>
            <div className="justify-end card-actions">
              <button
                onClick={() => onEdit(id, name)}
                className="btn btn-primary hover:bg-primary/50 duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(id)}
                className="btn btn-error text-white hover:bg-error/50 duration-300"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [jamat, setJamat] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchJamat = async () => {
      try {
        const res = await api.get("/api/class");
        setJamat(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJamat();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    setLoading(true);
    try {
      await api.delete(`/api/class/${id}`);
      setJamat((prev) => prev.filter((j) => j._id !== id));
      toast.success("Class deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete class.");
    } finally {
      setLoading(false);
    }
  };

  // Start edit
  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error("Class name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/api/class/${id}`, { name: editName });
      setJamat((prev) =>
        prev.map((j) => (j._id === id ? { ...j, name: res.data.data.name } : j))
      );
      toast.success("Class updated successfully.");
      setEditingId(null);
      setEditName("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update class.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.trim()) {
      toast.error("Class name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/class", { name: newClass });
      setJamat((prev) => [...prev, res.data?.data]);
      setNewClass("");
      toast.success("Class added successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add class.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col justify-center gap-y-5 overflow-y-auto py-1">
      <div className="body grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jamat.length > 0 ? (
          jamat.map((j) => (
            <Card
              key={j._id}
              id={j._id}
              name={j.name}
              totalStudents={j.students?.length || 0}
              onDelete={handleDelete}
              onEdit={handleEdit}
              editingId={editingId}
              editName={editName}
              setEditName={setEditName}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No classes found.
          </p>
        )}
      </div>

      <form
        onSubmit={handleAddClass}
        className="flex gap-3 justify-end items-center mt-3"
      >
        <input
          type="text"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          placeholder="Enter class name"
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn btn-primary">
          Add Class
        </button>
      </form>
    </div>
  );
};

export default Page;
