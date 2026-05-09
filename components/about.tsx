import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import profileData from "@/data/profile.json"

export function About() {
  return (
    <section id="about" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {profileData.sectionTitles?.about || "About Me"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {profileData.sectionDescriptions?.about || ""}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* About Content */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {profileData.about.summary}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-4">
                {profileData.about.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
