import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/access',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/:locale/access',
        destination: '/:locale',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
