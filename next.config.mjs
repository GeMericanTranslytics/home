/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static export for GitHub Pages
  output: 'export',
  // Set basePath for GitHub Pages (uncomment and update for your repo)
  // basePath: '/your-repo-name',
  // Trailing slash for static hosting
  trailingSlash: true,
}

export default nextConfig
