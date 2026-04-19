const dotenv = require("dotenv").config().parsed;
const webpack = require("webpack");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
//  transpilePackages: ['react-draft-wysiwyg'],
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      child_process: false,
      net: false,
      dns: false,
      tls: false,
      requst: false,
    };
    config.plugins.push(new webpack.EnvironmentPlugin(dotenv));
    return config;
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "storage.cloud.google.com",
      "www.storage.cloud.google.com",
    ],
  },
};

module.exports = nextConfig;
