/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dy2ejy1oy/image/upload/**",
      }
    ],
  },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;