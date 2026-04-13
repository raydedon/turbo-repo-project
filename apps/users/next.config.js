/** @type {import('next').NextConfig} */

const nextConfig = {
  // Required for microfrontend zone routing — all /users/* paths proxied here
  basePath: "/users",
};

export default nextConfig;
