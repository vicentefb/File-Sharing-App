/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  env: {
    API_BASE_ENDPOINT_CLIENT: process.env.API_BASE_ENDPOINT_CLIENT,
  },
  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },
};
