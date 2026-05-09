"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Code,
  Building2,
  BookOpen,
  Plus,
  X,
  Edit2,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react"
import profileData from "@/data/profile.json"

interface StarAnswer {
  situation: string
  task: string
  action: string
  result: string
}

interface BehavioralQuestion {
  question: string
  starAnswer: StarAnswer
  notes: string
}

interface TechnicalQuestion {
  question: string
  keyPoints: string[]
  notes: string
}

interface CompanyNote {
  company: string
  researchNotes: string
  interviewerNotes: string
  questionsToAsk: string[]
}

interface Resource {
  title: string
  url: string
  category: string
  notes: string
}

export function InterviewPrep() {
  // State for all interview prep categories
  const [behavioralQuestions, setBehavioralQuestions] = useState<BehavioralQuestion[]>(
    profileData.interviewPrep?.behavioralQuestions || []
  )
  const [technicalQuestions, setTechnicalQuestions] = useState<TechnicalQuestion[]>(
    profileData.interviewPrep?.technicalQuestions || []
  )
  const [companyNotes, setCompanyNotes] = useState<CompanyNote[]>(
    profileData.interviewPrep?.companyNotes || []
  )
  const [resources, setResources] = useState<Resource[]>(
    profileData.interviewPrep?.resources || []
  )

  // Active tab state
  const [activeTab, setActiveTab] = useState<"behavioral" | "technical" | "companies" | "resources">("behavioral")

  // Expanded cards state
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Edit states
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states for behavioral questions
  const [newBehavioral, setNewBehavioral] = useState<BehavioralQuestion>({
    question: "",
    starAnswer: { situation: "", task: "", action: "", result: "" },
    notes: "",
  })

  // Form states for technical questions
  const [newTechnical, setNewTechnical] = useState<TechnicalQuestion>({
    question: "",
    keyPoints: [""],
    notes: "",
  })

  // Form states for company notes
  const [newCompany, setNewCompany] = useState<CompanyNote>({
    company: "",
    researchNotes: "",
    interviewerNotes: "",
    questionsToAsk: [""],
  })

  // Form states for resources
  const [newResource, setNewResource] = useState<Resource>({
    title: "",
    url: "",
    category: "",
    notes: "",
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  // Behavioral Questions handlers
  const addBehavioralQuestion = () => {
    if (newBehavioral.question.trim()) {
      setBehavioralQuestions([...behavioralQuestions, { ...newBehavioral }])
      setNewBehavioral({
        question: "",
        starAnswer: { situation: "", task: "", action: "", result: "" },
        notes: "",
      })
      setShowAddForm(false)
    }
  }

  const removeBehavioralQuestion = (index: number) => {
    setBehavioralQuestions(behavioralQuestions.filter((_, i) => i !== index))
  }

  // Technical Questions handlers
  const addTechnicalQuestion = () => {
    if (newTechnical.question.trim()) {
      setTechnicalQuestions([...technicalQuestions, { ...newTechnical, keyPoints: newTechnical.keyPoints.filter(p => p.trim()) }])
      setNewTechnical({ question: "", keyPoints: [""], notes: "" })
      setShowAddForm(false)
    }
  }

  const removeTechnicalQuestion = (index: number) => {
    setTechnicalQuestions(technicalQuestions.filter((_, i) => i !== index))
  }

  // Company Notes handlers
  const addCompanyNote = () => {
    if (newCompany.company.trim()) {
      setCompanyNotes([...companyNotes, { ...newCompany, questionsToAsk: newCompany.questionsToAsk.filter(q => q.trim()) }])
      setNewCompany({ company: "", researchNotes: "", interviewerNotes: "", questionsToAsk: [""] })
      setShowAddForm(false)
    }
  }

  const removeCompanyNote = (index: number) => {
    setCompanyNotes(companyNotes.filter((_, i) => i !== index))
  }

  // Resources handlers
  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      setResources([...resources, { ...newResource }])
      setNewResource({ title: "", url: "", category: "", notes: "" })
      setShowAddForm(false)
    }
  }

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }

  const tabs = [
    { id: "behavioral" as const, label: "Behavioral", icon: MessageSquare, count: behavioralQuestions.length },
    { id: "technical" as const, label: "Technical", icon: Code, count: technicalQuestions.length },
    { id: "companies" as const, label: "Companies", icon: Building2, count: companyNotes.length },
    { id: "resources" as const, label: "Resources", icon: BookOpen, count: resources.length },
  ]

  return (
    <section id="interview-prep" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {profileData.sectionTitles?.interviewPrep || "Interview Preparation"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {profileData.sectionDescriptions?.interviewPrep || "Questions, notes, and resources for interview success"}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="gap-2"
                onClick={() => {
                  setActiveTab(tab.id)
                  setShowAddForm(false)
                  setEditingIndex(null)
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Behavioral Questions Tab */}
          {activeTab === "behavioral" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Behavioral Questions (STAR Method)</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              {showAddForm && (
                <Card className="bg-card/50 border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <Input
                      placeholder="Question (e.g., Tell me about a time when...)"
                      value={newBehavioral.question}
                      onChange={(e) => setNewBehavioral({ ...newBehavioral, question: e.target.value })}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Situation</label>
                        <Textarea
                          placeholder="Describe the context..."
                          value={newBehavioral.starAnswer.situation}
                          onChange={(e) => setNewBehavioral({
                            ...newBehavioral,
                            starAnswer: { ...newBehavioral.starAnswer, situation: e.target.value }
                          })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Task</label>
                        <Textarea
                          placeholder="Your responsibility..."
                          value={newBehavioral.starAnswer.task}
                          onChange={(e) => setNewBehavioral({
                            ...newBehavioral,
                            starAnswer: { ...newBehavioral.starAnswer, task: e.target.value }
                          })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Action</label>
                        <Textarea
                          placeholder="Steps you took..."
                          value={newBehavioral.starAnswer.action}
                          onChange={(e) => setNewBehavioral({
                            ...newBehavioral,
                            starAnswer: { ...newBehavioral.starAnswer, action: e.target.value }
                          })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Result</label>
                        <Textarea
                          placeholder="Outcomes and learnings..."
                          value={newBehavioral.starAnswer.result}
                          onChange={(e) => setNewBehavioral({
                            ...newBehavioral,
                            starAnswer: { ...newBehavioral.starAnswer, result: e.target.value }
                          })}
                          rows={2}
                        />
                      </div>
                    </div>
                    <Input
                      placeholder="Additional notes..."
                      value={newBehavioral.notes}
                      onChange={(e) => setNewBehavioral({ ...newBehavioral, notes: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addBehavioralQuestion}>Save Question</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {behavioralQuestions.length === 0 && !showAddForm ? (
                <Card className="bg-card/30 border-border/30 border-dashed">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No behavioral questions yet. Add your first one above!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {behavioralQuestions.map((q, index) => (
                    <Card key={index} className="bg-card/50 border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => toggleExpanded(`behavioral-${index}`)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-4 h-4 text-accent" />
                              <h4 className="font-semibold text-foreground">{q.question}</h4>
                            </div>
                            {q.notes && (
                              <p className="text-sm text-muted-foreground">{q.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => toggleExpanded(`behavioral-${index}`)}
                            >
                              {expandedCards.has(`behavioral-${index}`) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeBehavioralQuestion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {expandedCards.has(`behavioral-${index}`) && (
                          <div className="mt-4 grid sm:grid-cols-2 gap-4">
                            <div className="p-3 bg-secondary/30 rounded-lg">
                              <span className="text-xs font-semibold text-primary uppercase">Situation</span>
                              <p className="text-sm text-foreground mt-1">{q.starAnswer.situation || "Not filled"}</p>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-lg">
                              <span className="text-xs font-semibold text-primary uppercase">Task</span>
                              <p className="text-sm text-foreground mt-1">{q.starAnswer.task || "Not filled"}</p>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-lg">
                              <span className="text-xs font-semibold text-primary uppercase">Action</span>
                              <p className="text-sm text-foreground mt-1">{q.starAnswer.action || "Not filled"}</p>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-lg">
                              <span className="text-xs font-semibold text-primary uppercase">Result</span>
                              <p className="text-sm text-foreground mt-1">{q.starAnswer.result || "Not filled"}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Technical Questions Tab */}
          {activeTab === "technical" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Technical Questions</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              {showAddForm && (
                <Card className="bg-card/50 border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <Input
                      placeholder="Technical question..."
                      value={newTechnical.question}
                      onChange={(e) => setNewTechnical({ ...newTechnical, question: e.target.value })}
                    />
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Key Points</label>
                      {newTechnical.keyPoints.map((point, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`Key point ${i + 1}...`}
                            value={point}
                            onChange={(e) => {
                              const updated = [...newTechnical.keyPoints]
                              updated[i] = e.target.value
                              setNewTechnical({ ...newTechnical, keyPoints: updated })
                            }}
                          />
                          {newTechnical.keyPoints.length > 1 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setNewTechnical({
                                  ...newTechnical,
                                  keyPoints: newTechnical.keyPoints.filter((_, idx) => idx !== i)
                                })
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewTechnical({ ...newTechnical, keyPoints: [...newTechnical.keyPoints, ""] })}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add Point
                      </Button>
                    </div>
                    <Input
                      placeholder="Notes..."
                      value={newTechnical.notes}
                      onChange={(e) => setNewTechnical({ ...newTechnical, notes: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addTechnicalQuestion}>Save Question</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {technicalQuestions.length === 0 && !showAddForm ? (
                <Card className="bg-card/30 border-border/30 border-dashed">
                  <CardContent className="p-8 text-center">
                    <Code className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No technical questions yet. Add your first one above!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {technicalQuestions.map((q, index) => (
                    <Card key={index} className="bg-card/50 border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-semibold text-foreground">{q.question}</h4>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeTechnicalQuestion(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-1 mb-3">
                          {q.keyPoints.map((point, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-3 h-3 text-primary" />
                              {point}
                            </div>
                          ))}
                        </div>
                        {q.notes && (
                          <p className="text-xs text-muted-foreground italic">{q.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Company Notes Tab */}
          {activeTab === "companies" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Company Research Notes</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Company
                </Button>
              </div>

              {showAddForm && (
                <Card className="bg-card/50 border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <Input
                      placeholder="Company name..."
                      value={newCompany.company}
                      onChange={(e) => setNewCompany({ ...newCompany, company: e.target.value })}
                    />
                    <Textarea
                      placeholder="Research notes (products, culture, recent news, etc.)..."
                      value={newCompany.researchNotes}
                      onChange={(e) => setNewCompany({ ...newCompany, researchNotes: e.target.value })}
                      rows={3}
                    />
                    <Textarea
                      placeholder="Interviewer notes (names, LinkedIn profiles, backgrounds)..."
                      value={newCompany.interviewerNotes}
                      onChange={(e) => setNewCompany({ ...newCompany, interviewerNotes: e.target.value })}
                      rows={2}
                    />
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Questions to Ask</label>
                      {newCompany.questionsToAsk.map((q, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <Input
                            placeholder={`Question ${i + 1}...`}
                            value={q}
                            onChange={(e) => {
                              const updated = [...newCompany.questionsToAsk]
                              updated[i] = e.target.value
                              setNewCompany({ ...newCompany, questionsToAsk: updated })
                            }}
                          />
                          {newCompany.questionsToAsk.length > 1 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setNewCompany({
                                  ...newCompany,
                                  questionsToAsk: newCompany.questionsToAsk.filter((_, idx) => idx !== i)
                                })
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewCompany({ ...newCompany, questionsToAsk: [...newCompany.questionsToAsk, ""] })}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add Question
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addCompanyNote}>Save Company</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {companyNotes.length === 0 && !showAddForm ? (
                <Card className="bg-card/30 border-border/30 border-dashed">
                  <CardContent className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No company notes yet. Add your first one above!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {companyNotes.map((c, index) => (
                    <Card key={index} className="bg-card/50 border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-foreground text-lg">{c.company}</h4>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeCompanyNote(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {c.researchNotes && (
                          <div className="mb-4">
                            <span className="text-xs font-semibold text-primary uppercase">Research Notes</span>
                            <p className="text-sm text-foreground mt-1">{c.researchNotes}</p>
                          </div>
                        )}
                        {c.interviewerNotes && (
                          <div className="mb-4">
                            <span className="text-xs font-semibold text-primary uppercase">Interviewer Notes</span>
                            <p className="text-sm text-foreground mt-1">{c.interviewerNotes}</p>
                          </div>
                        )}
                        {c.questionsToAsk.length > 0 && c.questionsToAsk[0] && (
                          <div>
                            <span className="text-xs font-semibold text-primary uppercase">Questions to Ask</span>
                            <ul className="mt-1 space-y-1">
                              {c.questionsToAsk.filter(q => q).map((q, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary">-</span> {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Interview Resources</h3>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Resource
                </Button>
              </div>

              {showAddForm && (
                <Card className="bg-card/50 border-primary/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Resource title..."
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                      <Input
                        placeholder="Category (e.g., Behavioral, Technical, Company Research)..."
                        value={newResource.category}
                        onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="URL..."
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    />
                    <Input
                      placeholder="Notes..."
                      value={newResource.notes}
                      onChange={(e) => setNewResource({ ...newResource, notes: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addResource}>Save Resource</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {resources.length === 0 && !showAddForm ? (
                <Card className="bg-card/30 border-border/30 border-dashed">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No resources yet. Add your first one above!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((r, index) => (
                    <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{r.title}</h4>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeResource(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        {r.category && (
                          <Badge variant="secondary" className="mb-2">{r.category}</Badge>
                        )}
                        {r.notes && (
                          <p className="text-sm text-muted-foreground mb-3">{r.notes}</p>
                        )}
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open Resource
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
