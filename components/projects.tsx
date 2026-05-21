"use client"

import Link from "next/link"
import { ExternalLink, Code2, Github, Star, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import profileData from "@/data/profile.json"

interface TableauProject {
  title: string
  description: string
  embedUrl: string
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
  // CRITICAL: Tableau URLs often contain junk. We extract the base path.
  // We force add only the necessary parameters for embedding.
  const baseUrl = url.split('?')[0];
  const vizUrl = `${baseUrl}?:embed=y&:showVizHome=no&:toolbar=yes&:fit=yes&:display_count=n`;

  return (
    <div className="w-full h-[700px] relative overflow-hidden bg-background">
      <iframe
        src={vizUrl}
        className="w-full h-full border-0 absolute top-0 left-0"
        allowFullScreen
        title="Tableau Visualization"
      />
    </div>
  )
}

export function Projects() {
  const isValidEmbedUrl = (url: string) => url && !url.includes("YOUR_TABLEAU");

  const myProjects: TableauProject[] = profileData.myTableauProjects || []
  const curatedProjects: TableauProject[] = profileData.curatedTableauProjects || []
  const pythonProjects: PythonProject[] = profileData.pythonProjects || []

  const TableauCard = ({ project, isCurated = false }: { project: TableauProject; isCurated?: boolean }) => {
    const valid = isValidEmbedUrl(project.embedUrl)
    return (
      <div className="w-full max-w-[1450px] mx-auto px-4 mb-12">
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0 w-full flex flex-col">
            {isCurated && (
              <div className="flex justify-end w-full p-3 bg-card">
                <Badge><Star className="w-3 h-3 mr-1" />Curated</Badge>
              </div>
            )}
            {valid ? (
              <TableauEmbed url={project.embedUrl} />
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-secondary w-full">
                <p className="text-muted-foreground">Invalid Tableau URL</p>
              </div>
            )}
            <div className="p-6 border-t w-full bg-card">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
              {project.sourceUrl && (
                <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
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
    <Card className="h-full flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="relative aspect-[2/1] bg-secondary flex items-center justify-center">
          <Code2 className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-semibold mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
            <Button variant="outline" className="w-full gap-2 text-sm"><Github className="w-3.5 h-3.5" />View on GitHub</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section id="projects" className="py-24 w-full">
      <div className="container mx-auto px-4">
        {myProjects.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">Tableau Projects</h2>
            {myProjects.map((p, i) => <TableauCard key={i} project={p} />)}
          </div>
        )}
        {curatedProjects.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">Curated</h2>
            {curatedProjects.map((p, i) => <TableauCard key={i} project={p} isCurated />)}
          </div>
        )}
        {pythonProjects.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-10">Python</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pythonProjects.map((p, i) => <PythonCard key={i} project={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
