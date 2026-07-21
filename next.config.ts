import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Emit a self-contained `.next/standalone` server bundle (Next.js output tracing).
  // This is what lets the Dockerfile copy ONLY the files the app actually needs
  // into the final image, instead of the entire `node_modules` tree. Without this
  // flag, `.next/standalone` is never produced and the runner stage would fail.
  // Major image-size win: the final image no longer ships devDeps or unused deps.
  output: 'standalone',

  // Make sure the Prisma generated client (produced by `prisma generate` at build
  // time) is pulled into the standalone trace. Without this, the standalone bundle
  // would reference @prisma/client but the generated runtime artifacts
  // (query engine, schema binary) would be missing at runtime.
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Add GitHub avatars here
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      // github.com/<user>.png fallback avatars used by the leaderboard
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
