/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }, // admin product-image uploads
    ],
  },
};

export default nextConfig;
