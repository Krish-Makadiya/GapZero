import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Mail,
    Briefcase,
    Send,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    User,
    Building2,
    Calendar,
    X,
    Check,
    Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// --- Swipeable Card Component ---
const SwipeableCompanyCard = ({ company, onSwipe, style }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Background color based on swipe direction overlay
    const overlayRightOpacity = useTransform(x, [0, 150], [0, 1]);
    const overlayLeftOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = (event, info) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe("right");
        } else if (info.offset.x < -threshold) {
            onSwipe("left");
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity, ...style }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 w-full h-full cursor-grab active:cursor-grabbing perspective-1000 flex items-center justify-center p-4"
        >
            <Card className="w-full max-w-sm h-96 relative overflow-hidden shadow-lg bg-card border-2">
                {/* Swipe Indicators */}
                <motion.div style={{ opacity: overlayLeftOpacity }} className="absolute inset-0 bg-red-500/80 z-20 pointer-events-none flex items-center justify-center">
                    <XCircle className="w-24 h-24 text-white" />
                </motion.div>
                <motion.div style={{ opacity: overlayRightOpacity }} className="absolute inset-0 bg-green-500/80 z-20 pointer-events-none flex items-center justify-center">
                    <CheckCircle2 className="w-24 h-24 text-white" />
                </motion.div>

                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="nav-icon w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="px-2 py-0.5">{company.industry}</Badge>
                    </div>

                    <h3 className="text-2xl font-bold mb-1">{company.company}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{company.description}</p>

                    <div className="flex-1 overflow-auto space-y-3 mb-4 pr-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Suggested Contacts</p>
                        {company.contacts.map((contact, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-md bg-muted/50 text-sm">
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-xs font-bold border">
                                    {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{contact.name}</p>
                                    <p className="text-muted-foreground text-xs truncate">{contact.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-center text-muted-foreground opacity-70 mt-auto">
                        Swipe Right to Add • Left to Skip
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};


const YourOutreachs = () => {
    const [activeTab, setActiveTab] = useState("Google");
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

    // Mock Data
    const user = {
        name: "Krish Makadiya",
        email: "krishmakadiya2005@gmail.com",
        role: "Full Stack Developer",
        status: "Open to Work",
        avatar: "https://github.com/shadcn.png",
        totalOutreach: 124,
        responseRate: "18%",
    };

    // Replace generic roles with specific companies
    const [jobRoles, setJobRoles] = useState([
        {
            role: "Google",
            stats: { sent: 45, replied: 8, pending: 37 },
            emails: [
                { id: 1, company: "Google", contact: "recruiting@google.com", status: "Replied", date: "2024-02-15", subject: "Frontend Role Application" },
                { id: 2, company: "Google", contact: "larry@google.com", status: "Sent", date: "2024-02-10", subject: "Introduction - Frontend Dev" },
                { id: 3, company: "Google", contact: "sundar@google.com", status: "Sent", date: "2024-02-01", subject: "Software Engineer Inquiry" },
                { id: 4, company: "Google", contact: "jobs@google.com", status: "Pending", date: "2024-02-18", subject: "Developer Advocate Role" },
            ],
        },
        {
            role: "Meta",
            stats: { sent: 32, replied: 5, pending: 27 },
            emails: [
                { id: 5, company: "Meta", contact: "zuck@meta.com", status: "Sent", date: "2024-02-18", subject: "Backend SDE I Application" },
                { id: 6, company: "Meta", contact: "careers@meta.com", status: "Replied", date: "2024-02-12", subject: "Backend Engineering Role" },
                { id: 7, company: "Meta", contact: "hiring@meta.com", status: "Pending", date: "2024-02-20", subject: "Product Designer Application" },
            ],
        },
    ]);

    // Extended list of companies for swiping
    const [potentialRoles, setPotentialRoles] = useState([
        {
            id: "airbnb", company: "Airbnb", industry: "Hospitality", description: "Online marketplace for lodging and tourism.",
            contacts: [
                { name: "Brian Chesky", email: "brian@airbnb.com", role: "CEO" },
                { name: "Recruiting", email: "careers@airbnb.com", role: "HR" },
                { name: "Nathan Blecharczyk", email: "nathan@airbnb.com", role: "CSO" },
                { name: "Joe Gebbia", email: "joe@airbnb.com", role: "Chairman" }
            ]
        },
        {
            id: "dropbox", company: "Dropbox", industry: "Cloud Storage", description: "File hosting service that offers cloud storage.",
            contacts: [
                { name: "Drew Houston", email: "drew@dropbox.com", role: "CEO" },
                { name: "Arash Ferdowsi", email: "arash@dropbox.com", role: "Co-Founder" },
                { name: "Timothy Young", email: "timothy@dropbox.com", role: "President" },
                { name: "Recruiting Team", email: "hiring@dropbox.com", role: "Recruitment" }
            ]
        },
        {
            id: "pinterest", company: "Pinterest", industry: "Social Media", description: "Image sharing and social media service.",
            contacts: [
                { name: "Ben Silbermann", email: "ben@pinterest.com", role: "Exec Chairman" },
                { name: "Bill Ready", email: "bill@pinterest.com", role: "CEO" },
                { name: "Jeremy King", email: "jeremy@pinterest.com", role: "CTO" },
                { name: "Navin Wieser", email: "navin@pinterest.com", role: "CFO" }
            ]
        },
        {
            id: "reddit", company: "Reddit", industry: "Social Media", description: "Network of communities where people can dive into their interests.",
            contacts: [
                { name: "Steve Huffman", email: "steve@reddit.com", role: "CEO" },
                { name: "Jen Wong", email: "jen@reddit.com", role: "COO" },
                { name: "Christopher Slowe", email: "chris@reddit.com", role: "CTO" },
                { name: "Recruiting", email: "jobs@reddit.com", role: "Talent Acquisition" }
            ]
        },
        {
            id: "twilio", company: "Twilio", industry: "Cloud Comms", description: "Cloud communications platform as a service company.",
            contacts: [
                { name: "Khozema Shipchandler", email: "khozema@twilio.com", role: "CEO" },
                { name: "Jeff Lawson", email: "jeff@twilio.com", role: "Founder" },
                { name: "Elena Donio", email: "elena@twilio.com", role: "President" },
                { name: "Talent Team", email: "careers@twilio.com", role: "HR" }
            ]
        },
        {
            id: "hubspot", company: "HubSpot", industry: "SaaS", description: "Developer and marketer of software products for inbound marketing.",
            contacts: [
                { name: "Yamini Rangan", email: "yamini@hubspot.com", role: "CEO" },
                { name: "Dharmesh Shah", email: "dharmesh@hubspot.com", role: "CTO" },
                { name: "Brian Halligan", email: "brian@hubspot.com", role: "Exec Chairman" },
                { name: "Recruiting", email: "careers@hubspot.com", role: "Hiring" }
            ]
        },
        {
            id: "notion", company: "Notion", industry: "Productivity", description: "All-in-one workspace for notes, tasks, wikis, and databases.",
            contacts: [
                { name: "Ivan Zhao", email: "ivan@makenotion.com", role: "CEO" },
                { name: "Simon Last", email: "simon@makenotion.com", role: "Co-Founder" },
                { name: "Akshay Kothari", email: "akshay@makenotion.com", role: "COO" },
                { name: "Recruiting", email: "joinus@makenotion.com", role: "Talent" }
            ]
        },
        {
            id: "zapier", company: "Zapier", industry: "Automation", description: "Product that allows end users to integrate the web applications they use.",
            contacts: [
                { name: "Wade Foster", email: "wade@zapier.com", role: "CEO" },
                { name: "Mike Knoop", email: "mike@zapier.com", role: "President" },
                { name: "Bryan Helmig", email: "bryan@zapier.com", role: "CTO" },
                { name: "Recruiting", email: "jobs@zapier.com", role: "HR" }
            ]
        },
        {
            id: "asana", company: "Asana", industry: "Project Mgmt", description: "Web and mobile application designed to help teams organize, track, and manage their work.",
            contacts: [
                { name: "Dustin Moskovitz", email: "dustin@asana.com", role: "CEO" },
                { name: "Rosenstein Justin", email: "justin@asana.com", role: "Co-Founder" },
                { name: "Eleanor Lacey", email: "eleanor@asana.com", role: "General Counsel" },
                { name: "Talent Team", email: "hiring@asana.com", role: "Recruiting" }
            ]
        },
        {
            id: "lyft", company: "Lyft", industry: "Transportation", description: "Rideshare company offering services, vehicles for hire, motorized scooters.",
            contacts: [
                { name: "David Risher", email: "david@lyft.com", role: "CEO" },
                { name: "John Zimmer", email: "john@lyft.com", role: "President" },
                { name: "Logan Green", email: "logan@lyft.com", role: "Co-Founder" },
                { name: "Recruiting", email: "drive@lyft.com", role: "Talent" }
            ]
        },
        {
            id: "figma", company: "Figma", industry: "Design", description: "Collaborative interface design tool.",
            contacts: [
                { name: "Dylan Field", email: "dylan@figma.com", role: "CEO" },
                { name: "Evan Wallace", email: "evan@figma.com", role: "CTO" },
                { name: "Yuhki Yamashita", email: "yuhki@figma.com", role: "CPO" },
                { name: "Recruiting", email: "jobs@figma.com", role: "HR" }
            ]
        },
        {
            id: "cloudflare", company: "Cloudflare", industry: "Security", description: "Web infrastructure and website security company.",
            contacts: [
                { name: "Matthew Prince", email: "matthew@cloudflare.com", role: "CEO" },
                { name: "Michelle Zatlyn", email: "michelle@cloudflare.com", role: "COO" },
                { name: "John Graham-Cumming", email: "john@cloudflare.com", role: "CTO" },
                { name: "Recruiting", email: "careers@cloudflare.com", role: "Talent" }
            ]
        },
        {
            id: "postman", company: "Postman", industry: "Dev Tools", description: "API platform for building and using APIs.",
            contacts: [
                { name: "Abhinav Asthana", email: "abhinav@postman.com", role: "CEO" },
                { name: "Ankit Sobti", email: "ankit@postman.com", role: "CTO" },
                { name: "Abhijit Kane", email: "abhijit@postman.com", role: "Co-Founder" },
                { name: "Hiring", email: "jobs@postman.com", role: "HR" }
            ]
        },
        {
            id: "miro", company: "Miro", industry: "Collaboration", description: "Online collaborative whiteboard platform.",
            contacts: [
                { name: "Andrey Khusid", email: "andrey@miro.com", role: "CEO" },
                { name: "Oleg Shardin", email: "oleg@miro.com", role: "Co-Founder" },
                { name: "Varun Parmar", email: "varun@miro.com", role: "CPO" },
                { name: "Recruiting", email: "careers@miro.com", role: "Talent" }
            ]
        },
        {
            id: "mixpanel", company: "Mixpanel", industry: "Analytics", description: "Business analytics service company.",
            contacts: [
                { name: "Amir Movafaghi", email: "amir@mixpanel.com", role: "CEO" },
                { name: "Suhail Doshi", email: "suhail@mixpanel.com", role: "Founder" },
                { name: "Tim Trefren", email: "tim@mixpanel.com", role: "Co-Founder" },
                { name: "Jobs", email: "jobs@mixpanel.com", role: "Hiring" }
            ]
        },
        {
            id: "stripe", company: "Stripe", industry: "Fintech", description: "Financial services and software as a service company.",
            contacts: [
                { name: "Patrick Collison", email: "patrick@stripe.com", role: "CEO" },
                { name: "John Collison", email: "john@stripe.com", role: "President" },
                { name: "Claire Hughes Johnson", email: "claire@stripe.com", role: "Advisor" },
                { name: "Recruiting", email: "jobs@stripe.com", role: "HR" }
            ]
        },
        {
            id: "coinbase", company: "Coinbase", industry: "Crypto", description: "Secure online platform for buying, selling, transferring, and storing digital currency.",
            contacts: [
                { name: "Brian Armstrong", email: "brian@coinbase.com", role: "CEO" },
                { name: "Emilie Choi", email: "emilie@coinbase.com", role: "COO" },
                { name: "Fred Ehrsam", email: "fred@coinbase.com", role: "Co-Founder" },
                { name: "Recruiting", email: "careers@coinbase.com", role: "Talent" }
            ]
        },
        {
            id: "robinhood", company: "Robinhood", industry: "Fintech", description: "Financial services company known for pioneering commission-free trades.",
            contacts: [
                { name: "Vlad Tenev", email: "vlad@robinhood.com", role: "CEO" },
                { name: "Baiju Bhatt", email: "baiju@robinhood.com", role: "CCO" },
                { name: "Jason Warnick", email: "jason@robinhood.com", role: "CFO" },
                { name: "Hiring", email: "careers@robinhood.com", role: "Recruiting" }
            ]
        },
        {
            id: "instacart", company: "Instacart", industry: "Delivery", description: "Grocery delivery and pick-up service.",
            contacts: [
                { name: "Fidji Simo", email: "fidji@instacart.com", role: "CEO" },
                { name: "Apoorva Mehta", email: "apoorva@instacart.com", role: "Founder" },
                { name: "Daniel Danker", email: "daniel@instacart.com", role: "CPO" },
                { name: "Recruiting", email: "jobs@instacart.com", role: "HR" }
            ]
        },
        {
            id: "doordash", company: "DoorDash", industry: "Delivery", description: "On-demand food delivery service.",
            contacts: [
                { name: "Tony Xu", email: "tony@doordash.com", role: "CEO" },
                { name: "Tang Stanley", email: "stanley@doordash.com", role: "Co-Founder" },
                { name: "Andy Fang", email: "andy@doordash.com", role: "Co-Founder" },
                { name: "Careers", email: "careers@doordash.com", role: "Talent" }
            ]
        },
        {
            id: "slack", company: "Slack", industry: "Communication", description: "Messaging app for business.",
            contacts: [
                { name: "Lidiane Jones", email: "lidiane@slack.com", role: "CEO" },
                { name: "Stewart Butterfield", email: "stewart@slack.com", role: "Founder" },
                { name: "Cal Henderson", email: "cal@slack.com", role: "CTO" },
                { name: "Recruiting", email: "feedback@slack.com", role: "HR" }
            ]
        },
        {
            id: "zoom", company: "Zoom", industry: "Video Comms", description: "Communications technology company.",
            contacts: [
                { name: "Eric Yuan", email: "eric@zoom.us", role: "CEO" },
                { name: "Kelly Steckelberg", email: "kelly@zoom.us", role: "CFO" },
                { name: "Aparna Bawa", email: "aparna@zoom.us", role: "COO" },
                { name: "Recruiting", email: "careers@zoom.us", role: "Talent" }
            ]
        }
    ]);

    // Logic for swiping
    const handleSwipe = (direction, company) => {
        if (direction === "right") {
            // Add Role Logic
            const newRole = {
                role: company.company,
                stats: { sent: 0, replied: 0, pending: company.contacts.length },
                emails: company.contacts.map((c, i) => ({
                    id: Date.now() + i,
                    company: company.company,
                    contact: c.email,
                    status: "Pending",
                    date: new Date().toISOString().split('T')[0],
                    subject: `Application for Role at ${company.company}`
                }))
            };
            setJobRoles([...jobRoles, newRole]);
            setActiveTab(company.company);
        }

        // Remove from potential stack
        setPotentialRoles((prev) => prev.filter((r) => r.id !== company.id));
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "Replied": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "Rejected": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "Sent": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "Pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Replied": return <CheckCircle2 className="w-4 h-4" />;
            case "Rejected": return <XCircle className="w-4 h-4" />;
            case "Pending": return <Clock className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    }

    const activeRoleData = jobRoles.find(r => r.role === activeTab);

    return (
        <div className="flex-1 w-full px-10 space-y-6 pt-6 mb-10 relative">
            {/* Modal Overlay for Swiping */}
            <AnimatePresence>
                {isAddRoleOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                        <div className="relative w-full max-w-md h-[500px] flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 z-50 rounded-full bg-background border shadow-sm translate-x-12 -translate-y-12 md:translate-x-0 md:translate-y-0"
                                onClick={() => setIsAddRoleOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="absolute top-[-50px] text-center w-full">
                                <h2 className="text-xl font-bold">Discover Opportunities</h2>
                                <p className="text-sm text-muted-foreground">Swipe right to add to your list</p>
                            </div>

                            {potentialRoles.length > 0 ? (
                                potentialRoles.map((role, index) => (
                                    <SwipeableCompanyCard
                                        key={role.id}
                                        company={role}
                                        onSwipe={(dir) => handleSwipe(dir, role)}
                                        style={{ zIndex: potentialRoles.length - index }}
                                    />
                                )).reverse()
                            ) : (
                                <div className="text-center p-8 bg-card border rounded-xl shadow-lg">
                                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg font-bold">All Caught Up!</h3>
                                    <p className="text-muted-foreground text-sm mt-2 mb-4">You've reviewed all suggested companies.</p>
                                    <Button onClick={() => setIsAddRoleOpen(false)}>Back to Dashboard</Button>
                                    <div className="mt-4 pt-4 border-t w-full">
                                        <p className="text-xs text-muted-foreground cursor-pointer hover:underline" onClick={() => {
                                            window.location.reload(); // Simple reload to reset state for demo
                                        }}>Reset Recommendations (Demo)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cold Outreach</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage and track your job application outreach campaigns.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setIsAddRoleOpen(true)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        New Outreach
                    </button>
                </div>
            </div>

            {/* User Profile Card */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">User Name</p>
                        <p className="text-2xl font-bold">{user.name}</p>
                    </div>
                    <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm font-bold truncate max-w-[150px]" title={user.email}>{user.email}</p>
                    </div>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Total Outreach</p>
                        <p className="text-2xl font-bold">{user.totalOutreach}</p>
                    </div>
                    <Send className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                        <p className="text-2xl font-bold">{user.responseRate}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* My Outreach Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold tracking-tight">My Outreach</h3>

                {/* Tabs / Job Roles */}
                <div className="flex flex-wrap gap-2 pb-2">
                    {jobRoles.map((role) => (
                        <button
                            key={role.role}
                            onClick={() => setActiveTab(role.role)}
                            className={`
                            relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                            ${activeTab === role.role
                                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                                    : "bg-card hover:bg-accent text-card-foreground border shadow-sm"}
                        `}
                        >
                            <Building2 className="mr-2 h-4 w-4" />
                            {role.role}
                            {activeTab === role.role && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 rounded-lg border-2 border-primary/20 pointer-events-none"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="ml-2 bg-background/20 px-1.5 py-0.5 rounded-full text-xs">
                                {role.emails.length}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={() => setIsAddRoleOpen(true)}
                        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground bg-transparent border border-dashed border-muted-foreground/30 hover:bg-accent/50 transition-all"
                    >
                        + Add Role
                    </button>
                </div>

                {/* Outreach Content for Active Tab */}
                <AnimatePresence mode="wait">
                    {activeRoleData ? (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                    <div>
                                        <h4 className="text-lg font-semibold flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            {activeTab}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Tracking {activeRoleData?.emails.length} outreach emails for this role.
                                        </p>
                                    </div>
                                    <div className="relative w-full md:w-auto">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search emails..."
                                            className="w-full md:w-[300px] h-9 pl-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-md border">
                                    <div className="w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {activeRoleData?.emails.map((email) => (
                                                    <tr key={email.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                    {email.company.charAt(0)}
                                                                </div>
                                                                {email.company}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-muted-foreground">{email.contact}</td>
                                                        <td className="p-4 align-middle">{email.subject}</td>
                                                        <td className="p-4 align-middle text-muted-foreground flex items-center gap-2">
                                                            <Calendar className="w-3 h-3" />
                                                            {email.date}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border ${getStatusColor(email.status)}`}>
                                                                {getStatusIcon(email.status)}
                                                                {email.status}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-right">
                                                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-muted-foreground">Select a role to view outreach details.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default YourOutreachs;
