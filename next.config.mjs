/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.lh3.googleusercontent.com',
        pathname: '/images/branding/googlelogo/**',
      },
    ],
  },
};

export default nextConfig;
