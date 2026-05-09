import { BarChart3, Languages, Shield, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import profileData from "@/data/profile.json"

const skillIcons: Record<string, React.ElementType> = {
  Analytics: BarChart3,
  Localization: Languages,
  "Quality Assurance": Shield,
  Technical: Code,
}

const skillColors: Record<string, string> = {
  Analytics: "bg-primary/10 text-primary border-primary/20",
  Localization: "bg-accent/10 text-accent border-accent/20",
  "Quality Assurance": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Technical: "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-black/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {profileData.sectionTitles?.skills || "Skills & Expertise"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {profileData.sectionDescriptions?.skills || ""}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(profileData.skills).map(([category, skills]) => {
              const Icon = skillIcons[category] || Code
              const colorClass = skillColors[category] || skillColors.Technical
              
              return (
                <Card
                  key={category}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
