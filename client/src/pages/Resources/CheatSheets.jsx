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
        // Determine absolute path or use relative if served statically
        const link = document.createElement('a');
        link.href = file;
        link.download = fileName; // Optional: specify filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = (file) => {
        window.open(file, '_blank');
    };

    return (
        <div className="flex-1 w-full px-10 space-y-6 pt-6 mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roadmaps</h2>
                    <p className="text-muted-foreground mt-1">
                        Curated tech roadmaps to help you navigate your learning path and master your chosen field.
                    </p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-[250px] h-10 pl-3 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSheets.map((sheet) => (
                    <Card key={sheet.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-muted/60">
                        <div className={`h-28 w-full ${sheet.bgColor} flex items-center justify-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
                            <sheet.icon className={`w-12 h-12 ${sheet.color} transform group-hover:scale-110 transition-transform duration-300`} />
                        </div>

                        <CardHeader className="pt-4 pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {sheet.category}
                                </Badge>
                            </div>
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {sheet.title}
                            </h3>
                        </CardHeader>

                        <CardContent className="flex-1 pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {sheet.description}
                            </p>
                        </CardContent>

                        <CardFooter className="pt-0 pb-4 px-4 flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                                onClick={() => handleView(sheet.file)}
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </Button>
                            <Button
                                className="flex-1 gap-2"
                                onClick={() => handleDownload(sheet.file, `${sheet.id}-cheatsheet.pdf`)}
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredSheets.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No cheat sheets found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default CheatSheets;
