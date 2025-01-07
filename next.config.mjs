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
  sassOptions: {
    implementation: 'sass',
  },
};

export default nextConfig;
