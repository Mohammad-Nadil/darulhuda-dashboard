export default function Loader() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="loader absolute top-1/2 left-1/2 z-10 bg-[#1e3f57]" />
      <div className="loader2 absolute top-1/2 left-1/2 z-20 bg-[#3c517d]" />
      <div className="loader3 absolute top-1/2 left-1/2 z-30 bg-[#6bb2cd]" />
    </div>
  );
}
