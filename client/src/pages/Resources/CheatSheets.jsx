import { useState } from "react";
import { Download, Eye, FileText, Code2, Database, Laptop, Server, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cheatSheetsData = [
    {
        id: "frontend",
        title: "Frontend Development",
        description: "Complete guide to HTML, CSS, JavaScript, React, and modern frontend tools.",
        file: "/frontend.pdf",
        category: "Development",
        icon: Laptop,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        id: "backend",
        title: "Backend Engineering",
        description: "Essential concepts for backend systems, APIs, databases, and server management.",
        file: "/backend.pdf",
        category: "Engineering",
        icon: Server,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        id: "data-engineer",
        title: "Data Engineering",
        description: "A comprehensive roadmap and cheat sheet for data pipelines, warehousing, and big data.",
        file: "/data-engineer.pdf",
        category: "Data",
        icon: Database,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        id: "ai-engineer",
        title: "AI Engineer",
        description: "Key concepts in Artificial Intelligence, Machine Learning, and Neural Networks.",
        file: "/ai-engineer.pdf",
        category: "AI/ML",
        icon: Brain,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        id: "devops",
        title: "DevOps Practices",
        description: "Quick reference for CI/CD, Docker, Kubernetes, and cloud infrastructure.",
        file: "/devops.pdf",
        category: "Operations",
        icon: Code2,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        id: "system-design",
        title: "System Design",
        description: "Scalability patterns, distributed systems, and architectural best practices.",
        file: "/system-design.pdf",
        category: "Architecture",
        icon: FileText,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
    },
    {
        id: "claude-code",
        title: "Claude Code",
        description: "Refrence for the Claude Code tool.",
        file: "/claude-code.pdf",
        category: "AI Tools",
        icon: Code2,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    }
];

const CheatSheets = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSheets = cheatSheetsData.filter(sheet =>
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownload = (file, fileName) => {
        const link = document.createElement('a');
        link.href = file;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = (file) => {
        window.open(file, '_blank');
    };

    return (
        <div className="flex-1 w-full px-10 space-y-6 pt-6 mb-10 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic">
                        The Developer's Vault
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Turbocharge your learning with curated roadmaps, cheat sheets, and technical deep-dives.
                    </p>
                </div>

            </div>

            <div className="flex justify-end pt-2">
                <div className="relative group w-full md:w-[350px]">
                    <input
                        type="text"
                        placeholder="Search roadmaps by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-4 pr-4 text-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSheets.map((sheet) => {
                    const Icon = sheet.icon;
                    return (
                        <Card key={sheet.id} className="flex flex-col h-full overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group border-neutral-200 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900">
                            <div className={`h-32 w-full ${sheet.bgColor} flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:h-36`}>
                                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
                                <Icon className={`w-14 h-14 ${sheet.color} transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 z-10`} />
                            </div>

                            <CardHeader className="pt-2 pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-lg">
                                        {sheet.category}
                                    </Badge>
                                </div>
                                <h3 className="font-extrabold text-xl leading-tight group-hover:text-primary transition-colors">
                                    {sheet.title}
                                </h3>
                            </CardHeader>

                            <CardContent className="flex-1 pb-4">
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                                    {sheet.description}
                                </p>
                            </CardContent>

                            <CardFooter className="pt-0 pb-6 px-6 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 border-neutral-200 dark:border-neutral-800 rounded-2xl hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all duration-300"
                                    onClick={() => handleView(sheet.file)}
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Button>
                                <Button
                                    className="flex-1 gap-2 rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
                                    onClick={() => handleDownload(sheet.file, `${sheet.id}-cheatsheet.pdf`)}
                                >
                                    <Download className="w-4 h-4" />
                                    Fetch
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {filteredSheets.length === 0 && (
                <div className="text-center py-24 bg-neutral-100/50 dark:bg-neutral-800/20 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                    <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-medium text-lg italic">No treasure found matching your search. Try another path.</p>
                </div>
            )}
        </div>
    );
};

export default CheatSheets;