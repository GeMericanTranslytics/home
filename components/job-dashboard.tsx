"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Search, MapPin, Tag, ArrowRight, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import profileData from "@/data/profile.json"

// Job site configurations with URL patterns
const jobSites = [
  {
    name: "LinkedIn",
    icon: "🔗",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    buildUrl: (keyword: string, location: string) => {
      const params = new URLSearchParams({
        keywords: keyword,
        location: location === "Remote" ? "" : location,
        f_WT: location === "Remote" ? "2" : "",
      })
      return `https://www.linkedin.com/jobs/search/?${params.toString()}`
    },
  },
  {
    name: "Indeed",
    icon: "📋",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    buildUrl: (keyword: string, location: string) => {
      const params = new URLSearchParams({
        q: keyword,
        l: location === "Remote" ? "" : location,
        remotejob: location === "Remote" ? "032b3046-06a3-4876-8dfd-474eb5e7ed11" : "",
      })
      return `https://www.indeed.com/jobs?${params.toString()}`
    },
  },
  {
    name: "Monster",
    icon: "👹",
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    buildUrl: (keyword: string, location: string) => {
      const encodedKeyword = encodeURIComponent(keyword)
      const encodedLocation = encodeURIComponent(location === "Remote" ? "Remote" : location)
      return `https://www.monster.com/jobs/search?q=${encodedKeyword}&where=${encodedLocation}`
    },
  },
  {
    name: "ZipRecruiter",
    icon: "⚡",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    buildUrl: (keyword: string, location: string) => {
      const params = new URLSearchParams({
        search: keyword,
        location: location,
      })
      return `https://www.ziprecruiter.com/jobs-search?${params.toString()}`
    },
  },
]

export function JobDashboard() {
  const [selectedKeyword, setSelectedKeyword] = useState(profileData.jobSearch.keywords[0])
  const [selectedLocation, setSelectedLocation] = useState(profileData.jobSearch.locations[0])

  return (
    <section id="jobs" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {profileData.sectionTitles?.jobSearch || "Job Search Dashboard"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {profileData.sectionDescriptions?.jobSearch || "Quick access to job searches across major platforms with your keywords pre-configured"}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Filters */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Keyword Selector */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Keyword
                  </label>
                  <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select keyword" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileData.jobSearch.keywords.map((keyword) => (
                        <SelectItem key={keyword} value={keyword}>
                          {keyword}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Selector */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileData.jobSearch.locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Current Search Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Searching for:</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {selectedKeyword}
                </Badge>
                <span className="text-muted-foreground">in</span>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {selectedLocation}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Job Sites Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {jobSites.map((site) => (
              <Card
                key={site.name}
                className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{site.icon}</span>
                    {site.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={site.buildUrl(selectedKeyword, selectedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className={`w-full gap-2 border ${site.color} hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all`}
                    >
                      <Search className="w-4 h-4" />
                      Search Jobs
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Keywords Quick Search */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg">All Configured Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.jobSearch.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className={`px-3 py-2 cursor-pointer transition-all ${
                      selectedKeyword === keyword
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-secondary/50"
                    }`}
                    onClick={() => setSelectedKeyword(keyword)}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Edit keywords in{" "}
                <code className="px-1.5 py-0.5 bg-secondary/50 rounded text-primary">
                  data/profile.json
                </code>
              </p>
            </CardContent>
          </Card>

          {/* Company Career Pages Preview */}
          {profileData.jobSearch.companyCareerPages && profileData.jobSearch.companyCareerPages.length > 0 && (
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Target Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.jobSearch.companyCareerPages.map((company, index) => (
                    <Link
                      key={index}
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge
                        variant="outline"
                        className="px-3 py-2 cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      >
                        {company.company}
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Badge>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Manage company career pages in the full Job Search page
                </p>
              </CardContent>
            </Card>
          )}

          {/* Link to full job search page */}
          <div className="text-center mt-8">
            <Link href="/jobs">
              <Button variant="default" size="lg" className="gap-2">
                <Search className="w-5 h-5" />
                Open Full Job Search Page
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
