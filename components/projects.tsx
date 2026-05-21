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
  // Extract base URL to avoid double question marks
  const baseUrl = url.split('?')[0]
  const vizUrl = `${baseUrl}?:embed=y&:showVizHome=no&:toolbar=yes&:fit=yes&:display_count=n`

  return (
    <div className="w-full h-full relative overflow-hidden">
      <iframe
        src={vizUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
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
      <div className="w-full max-w-[1450px] mx-auto px-4 mb-12">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 w-full overflow-hidden">
          <CardContent className="p-0 w-full flex flex-col">
            {isCurated && (
              <div className="flex justify-end w-full p-3">
                <Badge className="bg-accent text-accent-foreground"><Star className="w-3 h-3 mr-1" />Curated</Badge>
              </div>
            )}
            {valid ? (
              <div className="w-full h-[700px] relative">
                <TableauEmbed url={project.embedUrl} />
              </div>
            ) : (
              <div className="flex items-center justify-center bg-secondary/30 w-full aspect-video">
                <p className="text-xs text-muted-foreground">Add Tableau URL in profile.json</p>
              </div>
            )}
            <div className="p-6 border-t border-border/30 w-full bg-card">
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
                  <Button variant="outline" className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                    <ExternalLink className="w-4 h-4" />Open in Tableau
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
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative aspect-[2/1] bg-secondary/30 flex items-center justify-center">
          <Code2 className="w-12 h-12 text-primary/50" />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
            <Button variant="outline" className="w-full gap-2 text-sm">
              <Github className="w-3.5 h-3.5" />View on GitHub
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section id="projects" className="py-24 w-full">
      <div className="container mx-auto px-4">
        {hasMyProjects && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">{profileData.sectionTitles?.myTableauProjects || "Tableau Projects"}</h2>
            {myProjects.map((p, i) => <TableauCard key={i} project={p} />)}
          </div>
        )}
        {hasCuratedProjects && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">{profileData.sectionTitles?.curatedTableauProjects || "Curated"}</h2>
            {curatedProjects.map((p, i) => <TableauCard key={i} project={p} isCurated />)}
          </div>
        )}
        {hasPythonProjects && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-10">{profileData.sectionTitles?.pythonProjects || "Python"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pythonProjects.map((p, i) => <PythonCard key={i} project={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
