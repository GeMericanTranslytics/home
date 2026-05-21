"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  Code2,
  Github,
  Star,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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

/**
 * TableauEmbed
 *
 * Renders a Tableau iframe and **scales it** so the entire dashboard content
 * is visible and centered inside the card. This uses a measured container size
 * and scales the iframe proportionally (CSS transform) so nothing is cropped.
 *
 * If your dashboard natural size differs, pass naturalWidth/naturalHeight props.
 */
function TableauEmbed({
  url,
  naturalWidth = 1400,
  naturalHeight = 1100,
}: {
  url: string
  naturalWidth?: number
  naturalHeight?: number
}) {
  const match = url.match(/\/viz\/([^/]+)\/([^/?]+)/)
  const vizUrl = match
    ? `https://public.tableau.com/views/${match[1]}/${match[2]}?:embed=y&:showVizHome=no&:toolbar=yes&:tabs=no`
    : `${url}?:embed=y&:showVizHome=no&:toolbar=yes`

  const containerRef = useRef<HTMLDivElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [scale, setScale] = useState(1)

  // Recalculate scale to fit the container while preserving aspect ratio
  useLayoutEffect(() => {
    if (!containerRef.current) return

    const compute = () => {
      const container = containerRef.current!
      const cw = container.clientWidth
      const ch = container.clientHeight

      // If container has zero height (rare), use viewport height fallback
      const containerHeight = ch || Math.max(window.innerHeight - 200, 600)

      const scaleX = cw / naturalWidth
      const scaleY = containerHeight / naturalHeight
      const newScale = Math.min(scaleX, scaleY, 1) // don't upscale beyond 1

      setScale(newScale)
    }

    compute()

    // Resize observer for container and window resize fallback
    const ro = new ResizeObserver(() => compute())
    ro.observe(containerRef.current)

    const onResize = () => compute()
    window.addEventListener("resize", onResize)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [naturalWidth, naturalHeight])

  // Wrapper styles:
  // - outer wrapper centers content and provides dark background
  // - inner viewport has fixed height equal to naturalHeight * scale so the page layout reserves space
  // - iframe is rendered at its natural size and scaled via transform so the entire viz is visible
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(15,15,20,0.9)",
        padding: "20px",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: `${naturalWidth}px`,
          // Reserve vertical space so the scaled iframe doesn't overflow the card.
          // This height will be naturalHeight * scale (updated via state).
          height: `${Math.ceil(naturalHeight * scale)}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <iframe
          ref={iframeRef}
          src={vizUrl}
          title="Tableau Visualization"
          style={{
            width: `${naturalWidth}px`,
            height: `${naturalHeight}px`,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Prevent pointer events issues when scaled
            willChange: "transform",
            display: "block",
          }}
          allowFullScreen
        />
      </div>
    </div>
  )
}

export function Projects() {
  // Merge profileData.myTableauProjects with the two requested vizzes
  const myProjects: TableauProject[] = [
    ...(profileData.myTableauProjects || []),

    // Added vizzes
    {
      title: "Citizen Service Requests",
      description: "A Tableau dashboard analyzing citizen service request patterns.",
      embedUrl: "https://public.tableau.com/views/citizeenservicerequests/main",
      sourceUrl:
        "https://public.tableau.com/app/profile/nur.adhyaksa.hamid/viz/citizeenservicerequests/main",
    },
    {
      title: "Exploratory Dashboard",
      description: "A Tableau exploratory dashboard by Ed Myers.",
      embedUrl:
        "https://public.tableau.com/views/ExploratoryDashboard_16183795969740/Dashboard2",
      sourceUrl:
        "https://public.tableau.com/app/profile/ed.myers/viz/ExploratoryDashboard_16183795969740/Dashboard2",
    },
  ]

  const curatedProjects: TableauProject[] = profileData.curatedTableauProjects || []
  const pythonProjects: PythonProject[] = profileData.pythonProjects || []

  const hasMyProjects = myProjects.length > 0
  const hasCuratedProjects = curatedProjects.length > 0
  const hasPythonProjects = pythonProjects.length > 0
  const hasAnyProjects = hasMyProjects || hasCuratedProjects || hasPythonProjects

  const [currentIndex, setCurrentIndex] = useState(0)
  const next = () => setCurrentIndex((prev) => (prev + 1) % myProjects.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + myProjects.length) % myProjects.length)

  const currentProject = myProjects[currentIndex]

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
      <div className="w-full mx-auto px-4">
        {/* MY PROJECTS CAROUSEL */}
        {hasMyProjects && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {profileData.sectionTitles?.myTableauProjects || "My Tableau Projects"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                {profileData.sectionDescriptions?.myTableauProjects ||
                  "Interactive data visualizations I created"}
              </p>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <div className="relative w-full max-w-[1400px] mx-auto">
              {/* LEFT ARROW */}
              <button
                onClick={prev}
                aria-label="Previous visualization"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* CURRENT VIZ CARD */}
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full overflow-visible">
                <CardContent className="p-0">
                  {/* Use TableauEmbed with natural size that matches typical Tableau dashboards.
                      If a specific dashboard is known to be taller/wider, you can pass props
                      naturalWidth/naturalHeight to TableauEmbed when rendering. */}
                  <TableauEmbed
                    url={currentProject.embedUrl}
                    // If you know a specific dashboard natural size, pass it here:
                    // naturalWidth={1400} naturalHeight={1200}
                  />

                  <div className="p-6 border-t border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {currentProject.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {currentProject.description}
                    </p>

                    {currentProject.sourceUrl && (
                      <Link href={currentProject.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in Tableau
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* RIGHT ARROW */}
              <button
                onClick={next}
                aria-label="Next visualization"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* CURATED PROJECTS */}
        {hasCuratedProjects && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {profileData.sectionTitles?.curatedTableauProjects || "Curated Tableau Visualizations"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                {profileData.sectionDescriptions?.curatedTableauProjects ||
                  "Outstanding visualizations I found inspiring"}
              </p>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
            </div>

            <div className="flex flex-col gap-8">
              {curatedProjects.map((project, index) => (
                <Card
                  key={index}
                  className="bg-card/50 border-border/50 backdrop-blur-sm w-full overflow-visible max-w-[1400px] mx-auto"
                >
                  <CardContent className="p-0">
                    <div className="flex justify-end p-3">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Curated
                      </Badge>
                    </div>

                    <TableauEmbed url={project.embedUrl} />

                    <div className="p-6 border-t border-border/30">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {project.description}
                      </p>

                      {project.author && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <User className="w-3 h-3" />
                          <span>By {project.author}</span>
                        </div>
                      )}

                      {project.sourceUrl && (
                        <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open in Tableau
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PYTHON PROJECTS */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pythonProjects.map((project, index) => (
                <PythonCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
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
    </section>
  )
}
