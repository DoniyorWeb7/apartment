import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.twcstorage.ru',
        pathname: '**',
      },
      // Добавьте другие домены при необходимости
    ],
  },
};

export default nextConfig;
