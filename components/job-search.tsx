"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Tag, ExternalLink, Plus, X, ArrowLeft, Building2, Trash2, Edit2, Check, Link2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import profileData from "@/data/profile.json"

// Job site configurations
const jobSites = [
  {
    name: "LinkedIn",
    icon: "/images/LinkedIn_logo_initials.png",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
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
    icon: "/images/indeed.jpeg",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
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
    icon: "/images/monster.jpeg",
    color: "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20",
    buildUrl: (keyword: string, location: string) => {
      const encodedKeyword = encodeURIComponent(keyword)
      const encodedLocation = encodeURIComponent(location === "Remote" ? "Remote" : location)
      return `https://www.monster.com/jobs/search?q=${encodedKeyword}&where=${encodedLocation}`
    },
  },
  {
    name: "ZipRecruiter",
    icon: "/images/apple-touch-icon.png",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
    buildUrl: (keyword: string, location: string) => {
      const params = new URLSearchParams({
        search: keyword,
        location: location,
      })
      return `https://www.ziprecruiter.com/jobs-search?${params.toString()}`
    },
  },
] 

interface CompanyCareerPage {
  company: string
  url: string
  logo?: string
  notes?: string
}

export function JobSearch() {
  const [customKeyword, setCustomKeyword] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  const [activeKeywords, setActiveKeywords] = useState<string[]>(profileData.jobSearch.keywords)
  const [activeLocations, setActiveLocations] = useState<string[]>(profileData.jobSearch.locations)
  const [selectedKeyword, setSelectedKeyword] = useState(profileData.jobSearch.keywords[0])
  const [selectedLocation, setSelectedLocation] = useState(profileData.jobSearch.locations[0])
  
  // Company career pages state
  const [companyPages, setCompanyPages] = useState<CompanyCareerPage[]>(
    profileData.jobSearch.companyCareerPages || []
  )
  const [newCompanyName, setNewCompanyName] = useState("")
  const [newCompanyUrl, setNewCompanyUrl] = useState("")
  const [newCompanyNotes, setNewCompanyNotes] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editCompanyName, setEditCompanyName] = useState("")
  const [editCompanyUrl, setEditCompanyUrl] = useState("")
  const [editCompanyNotes, setEditCompanyNotes] = useState("")

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !activeKeywords.includes(customKeyword.trim())) {
      const newKeyword = customKeyword.trim()
      setActiveKeywords([...activeKeywords, newKeyword])
      setSelectedKeyword(newKeyword)
      setCustomKeyword("")
    }
  }

  const addCustomLocation = () => {
    if (customLocation.trim() && !activeLocations.includes(customLocation.trim())) {
      const newLocation = customLocation.trim()
      setActiveLocations([...activeLocations, newLocation])
      setSelectedLocation(newLocation)
      setCustomLocation("")
    }
  }

  const removeKeyword = (keyword: string) => {
    if (activeKeywords.length > 1) {
      const newKeywords = activeKeywords.filter((k) => k !== keyword)
      setActiveKeywords(newKeywords)
      if (selectedKeyword === keyword) {
        setSelectedKeyword(newKeywords[0])
      }
    }
  }

  const removeLocation = (location: string) => {
    if (activeLocations.length > 1) {
      const newLocations = activeLocations.filter((l) => l !== location)
      setActiveLocations(newLocations)
      if (selectedLocation === location) {
        setSelectedLocation(newLocations[0])
      }
    }
  }

  // Company career page functions
  const addCompanyPage = () => {
    if (newCompanyName.trim() && newCompanyUrl.trim()) {
      const newPage: CompanyCareerPage = {
        company: newCompanyName.trim(),
        url: newCompanyUrl.trim(),
        notes: newCompanyNotes.trim() || undefined,
      }
      setCompanyPages([...companyPages, newPage])
      setNewCompanyName("")
      setNewCompanyUrl("")
      setNewCompanyNotes("")
    }
  }

  const removeCompanyPage = (index: number) => {
    setCompanyPages(companyPages.filter((_, i) => i !== index))
  }

  const startEditing = (index: number) => {
    const page = companyPages[index]
    setEditingIndex(index)
    setEditCompanyName(page.company)
    setEditCompanyUrl(page.url)
    setEditCompanyNotes(page.notes || "")
  }

  const saveEdit = () => {
    if (editingIndex !== null && editCompanyName.trim() && editCompanyUrl.trim()) {
      const updatedPages = [...companyPages]
      updatedPages[editingIndex] = {
        company: editCompanyName.trim(),
        url: editCompanyUrl.trim(),
        notes: editCompanyNotes.trim() || undefined,
      }
      setCompanyPages(updatedPages)
      setEditingIndex(null)
      setEditCompanyName("")
      setEditCompanyUrl("")
      setEditCompanyNotes("")
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditCompanyName("")
    setEditCompanyUrl("")
    setEditCompanyNotes("")
  }

  return (
    <div className="min-h-screen bg-black/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Job Search
            </h1>
            <p className="text-muted-foreground">
              Search across multiple job boards with custom keywords and locations
            </p>
          </div>

          {/* Search Configuration */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Keywords Card */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Keyword Selector */}
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select keyword" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeKeywords.map((keyword) => (
                      <SelectItem key={keyword} value={keyword}>
                        {keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Add Custom Keyword */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom keyword..."
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomKeyword()}
                  />
                  <Button variant="outline" size="icon" onClick={addCustomKeyword}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Active Keywords */}
                <div className="flex flex-wrap gap-2">
                  {activeKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className={`px-3 py-1.5 cursor-pointer transition-all ${
                        selectedKeyword === keyword
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                      onClick={() => setSelectedKeyword(keyword)}
                    >
                      {keyword}
                      {activeKeywords.length > 1 && (
                        <X
                          className="w-3 h-3 ml-2 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeKeyword(keyword)
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Locations Card */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Selector */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Add Custom Location */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom location..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomLocation()}
                  />
                  <Button variant="outline" size="icon" onClick={addCustomLocation}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Active Locations */}
                <div className="flex flex-wrap gap-2">
                  {activeLocations.map((location) => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className={`px-3 py-1.5 cursor-pointer transition-all ${
                        selectedLocation === location
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {location}
                      {activeLocations.length > 1 && (
                        <X
                          className="w-3 h-3 ml-2 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeLocation(location)
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Search Summary */}
          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Current Search:</span>
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                  {selectedKeyword}
                </Badge>
                <span className="text-muted-foreground">in</span>
                <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
                  {selectedLocation}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Job Sites */}
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Search on Job Boards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {jobSites.map((site) => (
              <Link
                key={site.name}
                href={site.buildUrl(selectedKeyword, selectedLocation)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className={`bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full`}>
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <span className="text-4xl">{site.icon}</span>
                    <h3 className="font-semibold text-foreground">{site.name}</h3>
                    <Button
                      variant="outline"
                      className={`w-full gap-2 border ${site.color} transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary`}
                    >
                      <Search className="w-4 h-4" />
                      Search
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Batch Search */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>Search All Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Open all job boards at once with your current search criteria
              </p>
              <Button
                variant="default"
                size="lg"
                className="gap-2"
                onClick={() => {
                  jobSites.forEach((site) => {
                    window.open(
                      site.buildUrl(selectedKeyword, selectedLocation),
                      "_blank"
                    )
                  })
                }}
              >
                <ExternalLink className="w-5 h-5" />
                Open All Job Boards
              </Button>
            </CardContent>
          </Card>

          {/* Company Career Pages Section */}
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Career Pages
          </h2>
          <p className="text-muted-foreground mb-4">
            Add direct links to career pages from companies you want to work for. These are saved to your profile for quick access.
          </p>

          {/* Add New Company Form */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Add Company Career Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Company Name
                  </label>
                  <Input
                    placeholder="e.g., eBay, Google, Microsoft..."
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Career Page URL
                  </label>
                  <Input
                    placeholder="https://careers.company.com/jobs"
                    value={newCompanyUrl}
                    onChange={(e) => setNewCompanyUrl(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Notes (optional)
                </label>
                <Input
                  placeholder="e.g., Check Utah positions, Remote roles only..."
                  value={newCompanyNotes}
                  onChange={(e) => setNewCompanyNotes(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCompanyPage()}
                />
              </div>
              <Button
                onClick={addCompanyPage}
                disabled={!newCompanyName.trim() || !newCompanyUrl.trim()}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </Button>
            </CardContent>
          </Card>

          {/* Company Career Pages List */}
          {companyPages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {companyPages.map((page, index) => (
                <Card
                  key={index}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                >
                  <CardContent className="p-5">
                    {editingIndex === index ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <Input
                          value={editCompanyName}
                          onChange={(e) => setEditCompanyName(e.target.value)}
                          placeholder="Company name"
                          className="text-sm"
                        />
                        <Input
                          value={editCompanyUrl}
                          onChange={(e) => setEditCompanyUrl(e.target.value)}
                          placeholder="Career page URL"
                          className="text-sm"
                        />
                        <Input
                          value={editCompanyNotes}
                          onChange={(e) => setEditCompanyNotes(e.target.value)}
                          placeholder="Notes (optional)"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit} className="gap-1">
                            <Check className="w-3 h-3" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">
                              {page.company}
                            </h3>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => startEditing(index)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeCompanyPage(index)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        {page.notes && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {page.notes}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1 truncate">
                          <Link2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{page.url}</span>
                        </div>
                        <Link
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="w-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Careers
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card/30 border-border/30 border-dashed mb-8">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No company career pages added yet. Add your first one above!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Open All Company Pages */}
          {companyPages.length > 0 && (
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Open All Company Career Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Open all {companyPages.length} company career {companyPages.length === 1 ? "page" : "pages"} in new tabs
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    companyPages.forEach((page) => {
                      window.open(page.url, "_blank")
                    })
                  }}
                >
                  <Building2 className="w-5 h-5" />
                  Open All Company Pages
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
