/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  compiler: {
    styledComponents: true,
  },
  // Vercel 部署配置
  experimental: {
    instrumentationHook: true,
  },
  // 图片优化配置
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // Docker 部署配置 - 启用 standalone 输出
  output: 'standalone',
  
  // 添加基础路径配置，解决Docker环境中路由问题
  basePath: '',
  assetPrefix: '',
};

module.exports = nextConfig; 