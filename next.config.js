// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const nextConfig = {
  poweredByHeader: false,
  publicRuntimeConfig: {
    APP_ENVIRONMENT: process.env.APP_ENVIRONMENT,
    APP_NAME: process.env.APP_NAME,
    API_URL: process.env.API_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // swcMinify: true,
  output: 'standalone',
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
module.exports = nextConfig;
