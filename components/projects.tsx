"use client"

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
  const match = url.match(/\/viz\/([^/]+)\/([^/?]+)/)
  const vizUrl = match
    ? `https://public.tableau.com/views/${match[1]}/${match[2]}?:embed=y&:showVizHome=no&:toolbar=yes&:tabs=no&:apiID=host0`
    : `${url}?:embed=y&:showVizHome=no&:toolbar=yes`

  return (
    // This container forces the aspect ratio and centers the iframe
    <div className="w-full aspect-video overflow-hidden bg-background">
      <iframe
        src={vizUrl}
        className="w-full h-full border-none"
        allowFullScreen
        title="Tableau Visualization"
      />
    </div>
  )
}

export function Projects() {
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

  const TableauCard = ({ project, isCurated = false }: { project: TableauProject; isCurated?: boolean }) => {
    const valid = isValidEmbedUrl(project.embedUrl)

    return (
      <div className="w-full flex justify-center">
        <Card className="w-full max-w-5xl bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            {isCurated && (
              <div className="flex justify-end p-3">
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Curated
                </Badge>
              </div>
            )}

            {valid ? (
              <TableauEmbed url={project.embedUrl} />
            ) : (
              <div className="flex items-center justify-center bg-secondary/30 h-[600px]">
                <p className="text-xs text-muted-foreground">Add Tableau URL in profile.json</p>
              </div>
            )}

            <div className="p-6 border-t border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
              {isCurated && project.author && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <User className="w-3 h-3" />
                  <span>By {project.author}</span>
                </div>
              )}
              {valid && project.sourceUrl && (
                <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2 hover:bg-primary transition-all">
                    <ExternalLink className="w-4 h-4" />
                    Open in Tableau
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
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
                <Badge key={i} variant="outline" className="text-xs bg-background/50">{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full gap-2 text-sm">
              <Github className="w-3.5 h-3.5" /> View on GitHub
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
        <p className="text-sm text-muted-foreground">Add your first {type}</p>
      </CardContent>
    </Card>
  )

  return (
    <section id="projects" className="py-24">
      <div className="w-full mx-auto px-4">
        {hasMyProjects && (
          <div className="mb-20">
            <div className="flex flex-col gap-8">
              {myProjects.map((project, index) => <TableauCard key={index} project={project} />)}
            </div>
          </div>
        )}
        {hasCuratedProjects && (
          <div className="mb-20">
            <div className="flex flex-col gap-8">
              {curatedProjects.map((project, index) => <TableauCard key={index} project={project} isCurated />)}
            </div>
          </div>
        )}
        {hasPythonProjects && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pythonProjects.map((project, index) => <PythonCard key={index} project={project} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
