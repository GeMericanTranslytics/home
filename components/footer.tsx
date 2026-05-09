import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import profileData from "@/data/profile.json"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="text-primary">Ge</span>Merican
              <span className="text-primary">Trans</span>lytics
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {profileData.title}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href={`mailto:${profileData.email}`}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {profileData.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
