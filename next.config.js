const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: false, // Enable PWA even in development mode
	// disable: process.env.NODE_ENV === 'development', // Disable PWA in development
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/, // Sanity CDN
			handler: 'CacheFirst',
			options: {
				cacheName: 'sanity-assets',
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
				},
			},
		},
		{
			urlPattern: /^https:\/\/api\.example\.com\/.*/, // Example API
			handler: 'NetworkFirst',
			options: {
				cacheName: 'api-cache',
				networkTimeoutSeconds: 10, // Network timeout for 10s
				expiration: {
					maxEntries: 100,
					maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
				},
			},
		},
		{
			urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/, // Images
			handler: 'CacheFirst',
			options: {
				cacheName: 'image-cache',
				expiration: {
					maxEntries: 200,
					maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
				},
			},
		},
		{
			urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/, // Google Fonts
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'google-fonts',
				expiration: {
					maxEntries: 30,
					maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
				},
			},
		},
	],
});

const createNextIntlPlugin = require('next-intl/plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		domains: ["localhost"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
				port: "",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",  // Add this
				port: "",
			},
			{
				protocol: 'https',
				hostname: 'unzkbvyeaefcpooqeenz.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/**'
			},
		],
	},
};

module.exports = createNextIntlPlugin()(withPWA(nextConfig));