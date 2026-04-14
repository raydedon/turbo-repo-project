/** @type {import('next').NextConfig} */

const nextConfig = {
  // Required for microfrontend zone routing — all /users/* paths proxied here
  basePath: "/",
};

export default nextConfig;
