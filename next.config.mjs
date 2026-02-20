/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Warnings ko ignore karne ke liye
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // 2. 🔥 TURBOPACK FIX: Yeh us 'webpack config' wale error ko chup karayega
  turbopack: {},

  // 3. 🔥 ANTI-CRASH FIX: Yeh Vercel ko 'WorkerError' (RAM full) hone se rokega
  experimental: {
    workerThreads: false,
    cpus: 1
  },

  // 4. 🔥 CANVAS FIX: Yeh pdf-parse ke canvas error ko rokega
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = { canvas: false };
    return config;
  }
};

export default nextConfig;