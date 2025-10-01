/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pravatar.cc"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
