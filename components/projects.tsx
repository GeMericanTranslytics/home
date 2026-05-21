"use client"

import { useState, useLayoutEffect, useRef } from "react"
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
 * - Centers the viz
 * - Scales the viz to fit width
 * - Prevents cutoff
 */
function TableauEmbed({
  url,
  naturalWidth = 1800,
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
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const computeScale = () => {
      const containerWidth = containerRef.current!.clientWidth
      const newScale = Math.min(containerWidth / naturalWidth, 1)
      setScale(newScale)
    }

    computeScale()

    const ro = new ResizeObserver(() => computeScale())
    ro.observe(containerRef.current)

    window.addEventListener("resize", computeScale)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", computeScale)
    }
  }, [naturalWidth])

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(15,15,20,0.9)",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: naturalHeight * scale,
          overflow: "visible",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <iframe
          src={vizUrl}
          style={{
            width: naturalWidth,
            height: naturalHeight,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            display: "block",
          }}
          allowFullScreen
          title="Tableau Visualization"
        />
      </div>
    </div>
  )
}

export function Projects() {
  const myProjects: TableauProject[] = [
    {
      title: "Songs That Strike A Chord",
      description: "A Tableau visualization exploring musical patterns and emotional resonance.",
      embedUrl:
        "https://public.tableau.com/views/SongsThatStrikeAChord/SongsThatStrikeAChord",
      sourceUrl:
        "https://public.tableau.com/app/profile/jeff.plattner4532/viz/SongsThatStrikeAChord/SongsThatStrikeAChord",
    },
    {
      title: "XYZ HR Engagement Scorecard",
      description: "An HR engagement scorecard dashboard with KPIs and workforce insights.",
      embedUrl:
        "https://public.tableau.com/views/XYZHREngagementScorecard/XYZHREngagementScorecard",
      sourceUrl:
        "https://public.tableau.com/app/profile/ervin.vinzon/viz/XYZHREngagementScorecard/XYZHREngagementScorecard",
    },
    {
      title: "OKRs Overview",
      description: "A Tableau dashboard visualizing OKRs and performance tracking.",
      embedUrl:
        "https://public.tableau.com/views/OKRs_17336477924050/OKRsOverview",
      sourceUrl:
        "https://public.tableau.com/app/profile/nir.smilga/viz/OKRs_17336477924050/OKRsOverview",
    },
    {
      title: "KPI Collection — Color Encoding",
      description: "A KPI dashboard demonstrating color‑encoded KPI cards.",
      embedUrl:
        "https://public.tableau.com/views/MasteringTableau2_KPIcollection1-ColorencodingforKPIcards/Dashboard",
      sourceUrl:
        "https://public.tableau.com/app/profile/rub.nm/viz/MasteringTableau2_KPIcollection1-ColorencodingforKPIcards/Dashboard",
    },
    {
      title: "Sales 3D Map",
      description: "A 3D geographic sales visualization.",
      embedUrl:
        "https://public.tableau.com/views/Sales3DMap/Sales_3D",
      sourceUrl:
        "https://public.tableau.com/app/profile/adrian.zinovei/viz/Sales3DMap/Sales_3D",
    },
  ]

  const curatedProjects: TableauProject[] = []
  const pythonProjects: PythonProject[] = []

  const hasMyProjects = myProjects.length > 0

  const [currentIndex, setCurrentIndex] = useState(0)
  const next = () => setCurrentIndex((prev) => (prev + 1) % myProjects.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + myProjects.length) % myProjects.length)

  const currentProject = myProjects[currentIndex]

  return (
    <section id="projects" className="py-24">
      <div className="w-full mx-auto px-4">

        {/* CAROUSEL */}
        {hasMyProjects && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Tableau Projects
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Interactive data visualizations
              </p>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <div className="relative w-full mx-auto">
              <button
                onClick={prev}
                aria-label="Previous visualization"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm w-full overflow-visible">
                <CardContent className="p-0">
                  <TableauEmbed url={currentProject.embedUrl} />

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
      </div>
    </section>
  )
}
