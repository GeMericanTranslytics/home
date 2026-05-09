"use client"

import { useState } from "react"
import { Building2, MapPin, Calendar, CheckCircle, Plus, Trash2, Edit2, Check, X, GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import profileData from "@/data/profile.json"

interface ExperienceItem {
  role: string
  company: string
  location: string
  period: string
  description: string
  achievements: string[]
}

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(profileData.experience || [])
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  
  // Form states
  const [formRole, setFormRole] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formLocation, setFormLocation] = useState("")
  const [formPeriod, setFormPeriod] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formAchievements, setFormAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")

  const resetForm = () => {
    setFormRole("")
    setFormCompany("")
    setFormLocation("")
    setFormPeriod("")
    setFormDescription("")
    setFormAchievements([])
    setNewAchievement("")
  }

  const startAdding = () => {
    resetForm()
    setIsAdding(true)
    setEditingIndex(null)
  }

  const startEditing = (index: number) => {
    const exp = experiences[index]
    setFormRole(exp.role)
    setFormCompany(exp.company)
    setFormLocation(exp.location)
    setFormPeriod(exp.period)
    setFormDescription(exp.description)
    setFormAchievements([...exp.achievements])
    setEditingIndex(index)
    setIsAdding(false)
  }

  const cancelForm = () => {
    resetForm()
    setIsAdding(false)
    setEditingIndex(null)
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormAchievements([...formAchievements, newAchievement.trim()])
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormAchievements(formAchievements.filter((_, i) => i !== index))
  }

  const saveExperience = () => {
    if (!formRole.trim() || !formCompany.trim()) return

    const newExp: ExperienceItem = {
      role: formRole.trim(),
      company: formCompany.trim(),
      location: formLocation.trim(),
      period: formPeriod.trim(),
      description: formDescription.trim(),
      achievements: formAchievements,
    }

    if (editingIndex !== null) {
      const updated = [...experiences]
      updated[editingIndex] = newExp
      setExperiences(updated)
    } else {
      setExperiences([newExp, ...experiences])
    }

    cancelForm()
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const moveExperience = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === experiences.length - 1)
    ) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...experiences]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setExperiences(updated)
  }

  return (
    <section id="experience" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {profileData.sectionTitles?.experience || "Professional Experience"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {profileData.sectionDescriptions?.experience || ""}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Add Experience Button */}
          {!isAdding && editingIndex === null && (
            <div className="flex justify-center mb-8">
              <Button onClick={startAdding} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            </div>
          )}

          {/* Add/Edit Form */}
          {(isAdding || editingIndex !== null) && (
            <Card className="bg-card/50 border-primary/30 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Role / Title *
                    </label>
                    <Input
                      placeholder="e.g., Senior Quality Analyst"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Company *
                    </label>
                    <Input
                      placeholder="e.g., Tech Company Inc."
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Location
                    </label>
                    <Input
                      placeholder="e.g., Salt Lake City, UT"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Period
                    </label>
                    <Input
                      placeholder="e.g., 2020 - Present"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Brief description of your role and responsibilities..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Key Achievements
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add an achievement..."
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                    />
                    <Button type="button" variant="outline" onClick={addAchievement}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formAchievements.length > 0 && (
                    <div className="space-y-2">
                      {formAchievements.map((ach, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary/30 rounded-md px-3 py-2">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="flex-1 text-sm">{ach}</span>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeAchievement(i)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={saveExperience} disabled={!formRole.trim() || !formCompany.trim()} className="gap-2">
                    <Check className="w-4 h-4" />
                    {editingIndex !== null ? "Save Changes" : "Add Experience"}
                  </Button>
                  <Button variant="outline" onClick={cancelForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {experiences.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

              {experiences.map((job, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background -translate-x-1.5 md:-translate-x-2 z-10" />

                  {/* Content */}
                  <div className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                      <CardContent className="p-6">
                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => moveExperience(index, "up")}
                            disabled={index === 0}
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </Button>
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
                            onClick={() => removeExperience(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {job.role}
                          </h3>
                          <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {job.period && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {job.period}
                              </div>
                            )}
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {job.description && (
                          <p className="text-muted-foreground mb-4">
                            {job.description}
                          </p>
                        )}

                        {/* Achievements */}
                        {job.achievements && job.achievements.length > 0 && (
                          <ul className="space-y-2">
                            {job.achievements.map((achievement, achIndex) => (
                              <li
                                key={achIndex}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-card/30 border-border/30 border-dashed">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  No experience added yet. Add your first position above!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Edit hint */}
          {experiences.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-8">
              Hover over any experience card to edit or remove it. Default values can be set in{" "}
              <code className="px-1.5 py-0.5 bg-secondary/50 rounded text-primary">
                data/profile.json
              </code>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
