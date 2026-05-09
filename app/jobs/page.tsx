import { JobSearch } from "@/components/job-search"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Job Search | German Localization & Speech Quality Analyst",
  description: "Search for Speech Analytics, Text Analytics, German Localization, and Translation jobs across LinkedIn, Indeed, Monster, and ZipRecruiter.",
}

export default function JobsPage() {
  return <JobSearch />
}
