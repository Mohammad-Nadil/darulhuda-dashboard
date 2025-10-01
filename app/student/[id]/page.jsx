"use client";
import { useParams, useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import placeholderImage from "../../../public/studentPlaceholder.jpg";
import toast from "react-hot-toast";
import { Image as AntdImage } from "antd";
import Loader from "../../components/Loader";

const InfoCard = ({
  title,
  value,
  num,
  color = "text-black",
  border = "border-gray-300",
}) => {
  return (
    <div
      className={`card bg-gradient-to-r from-primary/5 to-secondary/5 shadow-xl p-3 border-l-4 ${border}`}
    >
      <h2 className={`font-bold text-lg mb-3 border-b pb-2 ${color}`}>
        {title}
      </h2>
      <p className="font-medium">{value}</p>
      <p className="font-medium">{num}</p>
    </div>
  );
};

export default function StudentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentClass, setStudentClass] = useState({});
  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    className: "",
    branch: "",
    age: "",
    gender: "",
    bloodGroup: "",
    imageUrl: "",
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
        const data = res.data.data;
        setStudent({
          name: data.name || "",
          rollNumber: data.rollNumber || "",
          className: data.className || "",
          branch: data.branch || "",
          age: data.age || "",
          gender: data.gender || "",
          bloodGroup: data.bloodGroup || "",
          imageUrl: data.image?.secure_url || "",
          fatherName: data.fatherName || "",
          fatherOccupation: data.fatherOccupation || "",
          fatherMobile: data.fatherMobile || "",
          motherName: data.motherName || "",
          motherOccupation: data.motherOccupation || "",
          motherMobile: data.motherMobile || "",
          guardianName: data.guardianName || "",
          guardianOccupation: data.guardianOccupation || "",
          guardianMobile: data.guardianMobile || "",
          guardianRelation: data.guardianRelation || "",
          presentAddress: data.presentAddress || "",
          permanentAddress: data.permanentAddress || "",
          city: data.city || "",
          admissionFee: data.admissionFee || 0,
          monthlyFee: data.monthlyFee || 0,
          foodFee: data.foodFee || 0,
          othersFee: data.othersFee || 0,
          totalFee: data.totalFee || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchClass = async () => {
      if (!student.className) return;
      try {
        const res = await api.get(`/api/class/${student.className}`);
        setStudentClass(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudent();
    fetchClass();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      setLoading(true);
      await api.delete(`/api/student/${id}`);
      toast.success("Student deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!student)
    return <p className="text-red-500 font-bold">Student not found!</p>;

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-3xl shadow-lg border-l-4 border-indigo-300">
        <div className="flex-shrink-0 w-1/6">
          <AntdImage
            src={student.imageUrl || "/studentPlaceholder.jpg"}
            alt={student.name || "Student"}
            className="rounded-2xl object-contain aspect-[5/6]"
            preview
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-2">
            {student.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-lg text-gray-700 mb-2">
            <p>
              Roll:{" "}
              <span className="font-semibold text-indigo-600">
                {student.rollNumber}
              </span>
            </p>
            <p>
              Class:{" "}
              <span className="font-semibold text-indigo-600">
                {studentClass.name}
              </span>
            </p>
            <p>
              Branch:{" "}
              <span className="font-semibold text-indigo-600">
                {student.branch}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-gray-700 text-lg">
            <p>
              Age: <span className="font-semibold">{student.age}</span>
            </p>
            <p>
              Gender:{" "}
              <span className="font-semibold capitalize">{student.gender}</span>
            </p>
            <p>
              Blood Group:{" "}
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow">
                {student.bloodGroup}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/student/update/${id}`}
            className="btn btn-primary gap-2 hover:bg-indigo-600 hover:text-white hover:scale-105 transition transform duration-300"
          >
            <FiEdit className="text-lg" />
            Edit Student
          </Link>
          <button
            className="btn btn-error gap-2 hover:bg-red-600 hover:text-white hover:scale-105 transition transform duration-300"
            onClick={handleDelete}
          >
            <FiTrash2 className="text-lg" />
            Delete Student
          </button>{" "}
          <Link
            href={"/"}
            className="btn bg-secondary hover:bg-secondary/70 text-secondary-content"
          >
            back
          </Link>
        </div>
      </div>

      {/* Parents & Guardian */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          title="Father"
          value={`${student.fatherName} - ${student.fatherOccupation}`}
          num={student.fatherMobile}
          color="text-primary"
          border="border-primary"
        />
        <InfoCard
          title="Mother"
          value={`${student.motherName} - ${student.motherOccupation}`}
          num={student.motherMobile}
          color="text-pink-600"
          border="border-pink-600"
        />
        <InfoCard
          title={`Guardian (${student.guardianRelation})`}
          value={`${student.guardianName} - ${student.guardianOccupation} `}
          num={student.guardianMobile}
          color="text-indigo-600"
          border="border-indigo-600"
        />
      </div>

      {/* Address */}
      <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 shadow-xl p-3 rounded-xl border-l-4 border-indigo-300">
        <h2 className="font-bold text-lg mb-3 text-secondary">Address</h2>
        <p>
          <span className="font-semibold">Present:</span>{" "}
          {student.presentAddress}
        </p>
        <p>
          <span className="font-semibold">Permanent:</span>{" "}
          {student.permanentAddress}
        </p>
        <p>
          <span className="font-semibold">City:</span> {student.city}
        </p>
      </div>

      {/* Fees */}
      <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 shadow-xl p-3 rounded-xl border-l-4 border-primary">
        <h2 className="font-bold text-lg mb-3 text-indigo-700">Fees</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <p>
            Admission:{" "}
            <span className="font-semibold text-indigo-600">
              {student.admissionFee} Tk
            </span>
          </p>
          <p>
            Monthly:{" "}
            <span className="font-semibold text-indigo-600">
              {student.monthlyFee} Tk
            </span>
          </p>
          <p>
            Food:{" "}
            <span className="font-semibold text-indigo-600">
              {student.foodFee} Tk
            </span>
          </p>
          <p>
            Others:{" "}
            <span className="font-semibold text-indigo-600">
              {student.othersFee} Tk
            </span>
          </p>
        </div>
        <p className="font-extrabold mt-4 text-right text-xl text-indigo-800">
          Total: {student.totalFee} Tk
        </p>
      </div>
    </div>
  );
}
