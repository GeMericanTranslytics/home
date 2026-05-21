"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ExternalLink, Code2, Github, Star, User, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import profileData from "@/data/profile.json"

interface TableauProject {
  title: string
  description: string
  embedUrl: string
  thumbnail?: string
  author?: string
  sourceUrl?: string
}

interface PythonProject {
  title: string
  description: string
  repoUrl: string
  technologies: string[]
  features: string[]
}

function TableauEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const match = url.match(/\/viz\/([^/]+)\/([^/?]+)/)
  const vizUrl = match
    ? `https://public.tableau.com/views/${match[1]}/${match[2]}`
    : url

  return (
    <div ref={ref} style={{ width: "100%", height: "700px", overflow: "hidden" }}>
      <tableau-viz
        src={vizUrl}
        width="100%"
        height="700"
        hide-tabs
        toolbar="bottom"
      />
    </div>
  )
}

export function Projects() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
    script.type = "module"
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const isValidEmbedUrl = (url: string) => {
    return url && !url.includes("YOUR_TABLEAU") && !url.includes("YOUR_CURATED")
  }

  const myProjects: TableauProject[] = profileData.myTableauProjects || []
  const curatedProjects: TableauProject[] = profileData.curatedTableauProjects || []
  const pythonProjects: PythonProject[] = profileData.pythonProjects || []

  const hasMyProjects = myProjects.length > 0
  const hasCuratedProjects = curatedProjects.length > 0
  const hasPythonProjects = pythonProjects.length > 0
  const hasAnyProjects = hasMyProjects || hasCuratedProjects || hasPythonProjects

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-5xl mx-auto"
    if (count === 2) return "grid-cols-1 md:grid-cols-2"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  const TableauCard = ({ project, isCurated = false }: { project: TableauProject; isCurated?: boolean }) => {
    const valid = isValidEmbedUrl(project.embedUrl)

    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full bg-secondary/10" style={{ height: "700px" }}>
            {isCurated && (
              <Badge className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground">
                <Star className="w-3 h-3 mr-1" />
                Curated
              </Badge>
            )}
            {valid ? (
              <TableauEmbed url={project.embedUrl} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                <p className="text-xs text-muted-foreground">Add Tableau URL in profile.json</p>
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {project.description}
            </p>

            {isCurated && project.author && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <User className="w-3 h-3" />
                <span>By {project.author}</span>
              </div>
            )}

            {valid && project.sourceUrl && (
              <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Tableau
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const PythonCard = ({ project }: { project: PythonProject }) => (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-[2/1] bg-secondary/30 flex items-center justify-center">
          <div className="text-center p-6">
            <Code2 className="w-12 h-12 text-primary/50 mx-auto mb-2" />
            <div className="flex flex-wrap gap-1.5 justify-center">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-background/50">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {project.description}
          </p>

          {project.features.length > 0 && (
            <ul className="text-xs text-muted-foreground mb-4 space-y-1">
              {project.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-sm"
            >
              <Github className="w-3.5 h-3.5" />
              View on GitHub
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyAddCard = ({ type }: { type: string }) => (
    <Card className="bg-card/30 border-border/30 border-dashed hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-8 text-center">
        <Plus className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-2">Add your first {type}</p>
        <p className="text-xs text-muted-foreground">
          Edit <code className="px-1.5 py-0.5 bg-secondary/50 rounded text-primary">data/profile.json</code>
        </p>
      </CardContent>
    </Card>
  )

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {hasMyProjects && (
            <div className="mb-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {profileData.sectionTitles?.myTableauProjects || "My Tableau Projects"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                  {profileData.sectionDescriptions?.myTableauProjects || "Interactive data visualizations I created"}
                </p>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
              </div>
              <div className={`grid ${getGridCols(myProjects.length)} gap-6`}>
                {myProjects.map((project, index) => (
                  <TableauCard key={index} project={project} />
                ))}
              </div>
            </div>
          )}

          {hasCuratedProjects && (
            <div className="mb-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {profileData.sectionTitles?.curatedTableauProjects || "Curated Tableau Visualizations"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                  {profileData.sectionDescriptions?.curatedTableauProjects || "Outstanding visualizations I found inspiring"}
                </p>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
              </div>
              <div className={`grid ${getGridCols(curatedProjects.length)} gap-6`}>
                {curatedProjects.map((project, index) => (
                  <TableauCard key={index} project={project} isCurated />
                ))}
              </div>
            </div>
          )}

          {hasPythonProjects && (
            <div className="mb-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {profileData.sectionTitles?.pythonProjects || "Python Projects"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                  {profileData.sectionDescriptions?.pythonProjects || "Python applications and scripts"}
                </p>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
              </div>
              <div className={`grid ${getGridCols(pythonProjects.length)} gap-6`}>
                {pythonProjects.map((project, index) => (
                  <PythonCard key={index} project={project} />
                ))}
              </div>
            </div>
          )}

          {!hasAnyProjects && (
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Add your Tableau visualizations and Python projects to showcase your work
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <EmptyAddCard type="Tableau project" />
                <EmptyAddCard type="curated visualization" />
                <EmptyAddCard type="Python project" />
              </div>
            </div>
          )}

          {hasAnyProjects && (
            <p className="text-center text-sm text-muted-foreground mt-12">
              Add or remove projects by editing{" "}
              <code className="px-2 py-1 bg-secondary/50 rounded text-primary">data/profile.json</code>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
