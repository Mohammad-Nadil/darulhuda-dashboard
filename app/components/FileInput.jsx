"use client";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function FileInput({
  file,
  setFile,
  className,
  preview,
  setPreview,
}) {
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };
  return (
    <div
      className={`w-full h-full border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center relative overflow-hidden ${className}`}
    >
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 cursor-pointer bg-transparent text-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="object-contain h-full w-full rounded-lg shadow-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center  gap-2 w-11/12 h-11/12  ">
            <div className="flex flex-col items-center justify-center ">
              <FaCloudUploadAlt className="text-5xl text-primary" />
              <p className="text-gray-700 text-center text-sm md:text-base">
                Drag & Drop your file here
              </p>
              <span className=" btn-primary mt-1"> Browse File </span>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
