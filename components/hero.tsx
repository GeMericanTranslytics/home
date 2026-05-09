import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import profileData from "@/data/profile.json"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-card/30 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="relative mb-8">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-4 ring-offset-background shadow-2xl">
              <Image
                src={profileData.profileImage}
                alt={profileData.name}
                width={192}
                height={192}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Decorative ring animation */}
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-pulse" />
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight text-balance">
            {profileData.name}
          </h1>

          {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary mb-6">
            {profileData.title}
          </h2>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl text-balance" style={{ color: 'magenta', fontFamily: '"Times New Roman", Times, serif', fontStyle: 'normal' }}>
            {profileData.tagline}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <MapPin className="w-4 h-4" />
            <span>{profileData.location}</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-12">
            <Link
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                GitHub
              </Button>
            </Link>
            <Link
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </Button>
            </Link>
            <Link href={`mailto:${profileData.email}`}>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Contact
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <Link
            href="#about"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  )
}
