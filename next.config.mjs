/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // 📸 Receipt scanner uploads images up to 4MB as FormData
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
