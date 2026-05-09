import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'German Localization & Speech Quality Analyst | Portfolio',
  description: 'Professional portfolio showcasing expertise in Speech Analytics, Text Analytics, German Localization, Translation, and Quality Assurance.',
  keywords: ['German Localization', 'Speech Analytics', 'Text Analytics', 'Translation', 'Quality Assurance', 'Tableau'],
  authors: [{ name: 'GeMericanTranslytics' }],
  openGraph: {
    title: 'German Localization & Speech Quality Analyst',
    description: 'Professional portfolio showcasing expertise in Speech Analytics, Text Analytics, German Localization, and Quality Assurance.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
