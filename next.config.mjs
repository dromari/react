import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
