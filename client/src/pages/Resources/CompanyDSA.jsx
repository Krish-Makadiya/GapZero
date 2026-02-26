import { useState } from "react";
import { Search, ExternalLink, BarChart3, PieChart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dsaData from "../../data/companyDSA.json";

// Derive company list directly from JSON keys
const companies = Object.keys(dsaData).map((key) => ({
    key,
    label: key
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
}));

const CompanyDSA = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState(companies[0].key);

    const getDifficultyColor = (diff) => {
        switch (diff.toUpperCase()) {
            case "EASY": return "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200";
            case "MEDIUM": return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200";
            case "HARD": return "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const currentCompany = companies.find((c) => c.key === activeTab);

    const currentQuestions = (dsaData[activeTab] || []).filter(
        (q) =>
            q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.topics.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 w-full px-6 md:px-10 space-y-6 pt-6 mb-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Company Specific DSA</h2>
                    <p className="text-muted-foreground mt-1">
                        Top frequent questions asked in interviews at leading tech companies.
                    </p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search questions or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-[300px] pl-9"
                    />
                </div>
            </div>

            <div className="w-full flex-1 flex flex-col">
                {/* Company Tabs */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="bg-muted/50 p-1 rounded-md flex flex-wrap gap-1">
                        {companies.map((company) => (
                            <button
                                key={company.key}
                                onClick={() => {
                                    setActiveTab(company.key);
                                    setSearchTerm("");
                                }}
                                className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-all flex items-center gap-1.5 ${activeTab === company.key
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                    }`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                {company.label}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{currentCompany?.label}</span>
                        &mdash; Showing{" "}
                        <span className="font-semibold text-primary">{currentQuestions.length}</span>{" "}
                        question{currentQuestions.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* Table */}
                <div className="mt-0 flex-1 min-h-0">
                    <QuestionsTable
                        questions={currentQuestions}
                        getDifficultyColor={getDifficultyColor}
                    />
                </div>
            </div>
        </div>
    );
};

const QuestionsTable = ({ questions, getDifficultyColor }) => {
    return (
        <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium w-[300px]">Problem Title</th>
                            <th className="px-6 py-4 font-medium w-[100px]">Difficulty</th>
                            <th className="px-6 py-4 font-medium w-[120px]">
                                <div className="flex items-center gap-1">
                                    Frequency <BarChart3 className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-medium w-[120px]">
                                <div className="flex items-center gap-1">
                                    Acceptance <PieChart className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-medium">Topics</th>
                            <th className="px-6 py-4 font-medium w-[50px]">Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {questions.length > 0 ? (
                            questions.map((q, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-3 font-medium text-foreground">
                                        {q.title}
                                    </td>
                                    <td className="px-6 py-3">
                                        <Badge
                                            variant="outline"
                                            className={`${getDifficultyColor(q.difficulty)} border px-2.5 py-0.5 rounded-full font-semibold`}
                                        >
                                            {q.difficulty}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${q.frequency}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {q.frequency}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-muted-foreground">
                                        {(q.acceptance * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {q.topics
                                                .split(", ")
                                                .slice(0, 3)
                                                .map((topic, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            {q.topics.split(", ").length > 3 && (
                                                <span className="text-xs text-muted-foreground px-1 self-center">
                                                    +{q.topics.split(", ").length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            asChild
                                        >
                                            <a
                                                href={q.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-muted-foreground"
                                >
                                    No questions found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default CompanyDSA;
