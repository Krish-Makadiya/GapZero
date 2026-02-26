"use client"

import {
    BookOpen,
    Bot,
    FileText,
    Frame,
    GalleryVerticalEnd,
    GraduationCap,
    History,
    Map,
    Phone,
    PieChart,
    Settings2,
    SquareTerminal,
    Send
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "Krish Makadiya",
        email: "krishmakadiya2005@gmail.com",
        avatar: "/avatars/krishmakadiya2005.jpg",
    },
    teams: [
        {
            name: "SoHired",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        }
    ],
    navMain: [
        {
            title: "Career",
            url: "#",
            icon: GraduationCap,
            items: [
                {
                    title: "Course Suggestions",
                    url: "/dashboard/course-suggestions",
                },
                {
                    title: "Roadmaps",
                    url: "/dashboard/roadmaps",
                },
            ],
        },
        {
            title: "Resume AI",
            url: "#",
            icon: FileText,
            items: [
                {
                    title: "ATS Scanner",
                    url: "/dashboard/ats-scanner",
                },
                {
                    title: "Resume Builder",
                    url: "/dashboard/resume-builder",
                },
                // {
                //     title: "Cover Letter Gen",
                //     url: "/dashboard/cover-letters",
                // },
                {
                    title: "Version History",
                    url: "/dashboard/resume-versions",
                }
            ],
        },
        {
            title: "Cold Outreach",
            url: "#",
            icon: Send,
            items: [
                {
                    title: "Your Outreachs",
                    url: "/dashboard/cold-outreach/your-outreachs",
                },
                {
                    title: "Cold Emails Template",
                    url: "/dashboard/cold-outreach/templates",
                },
            ],
        },
        {
            title: "History",
            url: "#",
            icon: History,
            items: [
                {
                    title: "Accepted Jobs",
                    url: "/dashboard/accepted-jobs",
                },
                {
                    title: "Rejected Jobs",
                    url: "/dashboard/rejected-jobs",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "My Account",
                    url: "/dashboard/my-account",
                },
                {
                    title: "My Profile",
                    url: "/dashboard/my-profile",
                },
                {
                    title: "Job Preferences",
                    url: "/dashboard/job-preferences",
                },
            ],
        },
        {
            title: "Resources",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Roadmaps",
                    url: "/dashboard/resources/cheatsheets",
                },
                {
                    title: "Company Specific DSA",
                    url: "/dashboard/resources/company-dsa",
                },
                {
                    title: "Career Guidance Call",
                    url: "/dashboard/resources/career-call",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({
    ...props
}) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
