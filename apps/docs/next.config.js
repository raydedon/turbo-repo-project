/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for microfrontend zone routing — all /docs/* paths proxied here
  basePath: "/docs",
};

export default nextConfig;
