import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    BookOpen,
    Loader2,
    UploadCloud,
    TrendingUp,
    ShieldCheck,
    Briefcase,
    Zap,
    GraduationCap,
    CheckCircle2,
    Clock,
    Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const AcademicHub = () => {
    const { user, isLoaded } = useUser();
    const [alignmentData, setAlignmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState({ transcript: null, syllabus: null });

    useEffect(() => {
        const fetchResults = async () => {
            if (!user) return;
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_API || 'http://localhost:3000'}/api/academic/results/${user.id}`
                );
                setAlignmentData(response.data);
            } catch (error) {
                console.log("No academic alignment data found yet or error fetching:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            fetchResults();
        }
    }, [user, isLoaded]);

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
        }
    };

    const handleUpload = async () => {
        if (!files.transcript && !files.syllabus) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("clerkId", user.id);
        if (files.transcript) formData.append("transcript", files.transcript);
        if (files.syllabus) formData.append("syllabus", files.syllabus);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_API || 'http://localhost:3000'}/api/academic/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setAlignmentData(response.data.data);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    if (!isLoaded || loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)] w-full">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
        );
    }

    // Chart Data
    const overallScore = alignmentData?.alignment?.overallScore || 0;
    const chartData = [
        { name: 'Alignment', value: overallScore, fill: '#6366f1' }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-neutral-950/50">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    Academic <span className="text-indigo-600 dark:text-indigo-400">Enrichment Hub</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Bridge your college foundation to 2026 Industry Standards. Upload your transcript and syllabus to reveal your competitive edges.
                </p>
            </div>

            {!alignmentData && !isUploading && (
                <Card className="bg-muted/30 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-8">
                        <div className="flex gap-8 justify-center w-full max-w-2xl flex-col md:flex-row">
                            <div className="flex-1 space-y-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 dark:hover:bg-indigo-900/40 dark:bg-neutral-900 hover:bg-indigo-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <BookOpen className="w-8 h-8 text-indigo-500 mb-2" />
                                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Upload Result PDF</p>
                                        <p className="text-xs text-indigo-500">{files.transcript ? files.transcript.name : "Click to select"}</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, 'transcript')} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:hover:bg-purple-900/40 dark:bg-neutral-900 hover:bg-purple-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 text-purple-500 mb-2" />
                                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Upload Syllabus PDF</p>
                                        <p className="text-xs text-purple-500">{files.syllabus ? files.syllabus.name : "Click to select"}</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(e, 'syllabus')} />
                                </label>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg w-full max-w-xs"
                            onClick={handleUpload}
                            disabled={!files.transcript && !files.syllabus}
                        >
                            Analyze Academic Journey
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isUploading && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Processing Documents...</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            Our Enrichment Engine is comparing your academic background against 2026 Industry Standards to identify foundational strongholds and strategic bridge modules.
                        </p>
                    </div>
                </div>
            )}

            {alignmentData && !isUploading && (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

                    {/* Top Section: Meter and Timeline */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Enrichment Meter */}
                        <motion.div variants={item} className="md:col-span-1">
                            <Card className="h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500" />
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                                        Industry Alignment Progress
                                    </CardTitle>
                                    <CardDescription>Overall readiness based on your foundation</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="h-48 w-full relative cursor-help">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadialBarChart
                                                            cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
                                                            barSize={15} data={chartData} startAngle={180} endAngle={0}
                                                        >
                                                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                                            <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                                                        </RadialBarChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                                                        <span className="font-bold text-4xl text-slate-800 dark:text-slate-200">{overallScore}%</span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-slate-800 text-white p-3 rounded-lg border-0 shadow-xl w-64 z-50">
                                                <p className="font-bold mb-2 text-slate-200 border-b border-slate-700 pb-1">Sub-Scores Breakdown</p>
                                                <ul className="space-y-1 text-sm">
                                                    {alignmentData.alignment?.subScores?.map((sub, idx) => (
                                                        <li key={idx} className="flex justify-between items-center">
                                                            <span className="text-slate-300">{sub.category}</span>
                                                            <span className="font-semibold text-emerald-400">{sub.score}%</span>
                                                        </li>
                                                    ))}
                                                    {(!alignmentData.alignment?.subScores || alignmentData.alignment.subScores.length === 0) && (
                                                        <li className="text-slate-400 italic">No sub-scores available.</li>
                                                    )}
                                                </ul>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Academic Timeline */}
                        <motion.div variants={item} className="md:col-span-2">
                            <Card className="h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-0 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        Academic Performance Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                        {alignmentData.transcriptData?.map((dataItem, idx) => (
                                            <div key={idx} className="min-w-[200px] shrink-0 p-4 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-slate-700 snap-center">
                                                <Badge variant="outline" className="mb-2 bg-white dark:bg-neutral-900">{dataItem.semester || 'Semester'}</Badge>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1" title={dataItem.subject}>{dataItem.subject}</h4>
                                                <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Grade: {dataItem.grade}</p>
                                            </div>
                                        ))}
                                        {(!alignmentData.transcriptData || alignmentData.transcriptData.length === 0) && (
                                            <div className="w-full text-center p-8 text-muted-foreground italic">
                                                No transcript data successfully parsed.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Interactive Grid Section -> Masonry/Flex Layout */}
                    <div className="grid md:grid-cols-2 gap-6 items-start">

                        {/* Left Column: Foundational Strongholds */}
                        <motion.div variants={item} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    Foundational Strongholds
                                </h3>
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                    {alignmentData.alignment?.foundationalStrongholds?.map((cardItem, idx) => (
                                        <AccordionItem key={idx} value={`item-${idx}`} className="bg-emerald-50/80 dark:bg-emerald-950/20 backdrop-blur-md border border-emerald-200 dark:border-emerald-900 shadow-sm rounded-xl px-4 data-[state=open]:shadow-md transition-all">
                                            <AccordionTrigger className="hover:no-underline py-4 text-emerald-900 dark:text-emerald-100 font-bold">
                                                <div className="flex flex-col items-start text-left">
                                                    <span>{cardItem.subject}</span>
                                                    <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 mt-1">{cardItem.quickTake || 'Strengths'}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-4 pt-1">
                                                <ul className="space-y-2">
                                                    {cardItem.bullets?.map((bullet, bIdx) => (
                                                        <li key={bIdx} className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                                                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                                                            <span>{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            {/* Move Pro Tip here to fill space dynamically under shorter accordions if needed, or keep it on the right if that's shorter. Let's place it here as it usually balances the tall Industry cards. */}
                            <div className="flex flex-col gap-4">
                                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 backdrop-blur-md border-amber-200 dark:border-amber-900/50 shadow-sm border-dashed">
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full shrink-0">
                                            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">Academic Pro Tip</h4>
                                            <p className="text-sm text-amber-800/80 dark:text-amber-300/80">
                                                Your <strong>{alignmentData.alignment?.foundationalStrongholds?.[0]?.subject || 'core subjects'}</strong> are a high-value asset. When interviewing for roles aligned with 2026 standards, frame this academic rigor as your unique differentiator.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>

                        {/* Right Column: Industry Alignment Opportunities */}
                        <motion.div variants={item} className="flex flex-col gap-4 w-full">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Briefcase className="w-6 h-6 text-blue-500" />
                                Industry Alignment
                            </h3>
                            <div className="space-y-4">
                                {alignmentData.alignment?.industryAlignmentOpportunities?.map((cardItem, idx) => (
                                    <Card key={idx} className="bg-blue-50/80 dark:bg-blue-950/20 backdrop-blur-md border-blue-200 dark:border-blue-900 shadow-sm hover:shadow-md transition-all">
                                        <CardContent className="p-5 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-blue-900 dark:text-blue-100">{cardItem.topic}</h4>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{cardItem.quickTake || 'Opportunity'}</p>
                                                </div>
                                                {cardItem.gamificationBadge && (
                                                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm border-0 whitespace-nowrap ml-2">
                                                        {cardItem.gamificationBadge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <ul className="space-y-2">
                                                {cardItem.bullets?.map((bullet, bIdx) => (
                                                    <li key={bIdx} className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                                                        <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400" />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>

                    </div>

                    {/* Horizontal Interactive Roadmap */}
                    <motion.div variants={item} className="w-full">
                        <Card className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-neutral-950/50 border-b border-slate-100 dark:border-neutral-800 pb-4">
                                <CardTitle className="text-xl flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                                    <Zap className="w-6 h-6 text-indigo-500" />
                                    Strategic Bridge Modules Roadmap
                                </CardTitle>
                                <CardDescription>Hover over each progression node to reveal micro-learning paths.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row justify-between items-center relative w-full pt-4">
                                    {/* Connecting Line (Desktop) */}
                                    <div className="hidden md:block absolute top-[28px] left-[10%] w-[80%] h-1 bg-indigo-100 dark:bg-indigo-900/50 z-0 rounded-full" />
                                    {/* Connecting Line (Mobile) */}
                                    <div className="md:hidden absolute left-1/2 top-0 h-full w-1 bg-indigo-100 dark:bg-indigo-900/50 -translate-x-1/2 z-0 rounded-full" />

                                    <TooltipProvider delayDuration={200}>
                                        {alignmentData.alignment?.strategicBridgeModules?.map((node, idx) => (
                                            <div key={idx} className="relative z-10 flex flex-col items-center group mb-12 md:mb-0 w-full md:w-1/3">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border-4 border-indigo-500 flex items-center justify-center shadow-md cursor-pointer group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/20 group-hover:shadow-xl">
                                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-slate-800 text-white p-4 rounded-xl shadow-xl w-72 border-0 z-50">
                                                        <h4 className="font-bold text-lg text-indigo-300 mb-1">{node.module}</h4>
                                                        <p className="text-sm font-medium text-slate-300 mb-3 pb-2 border-b border-slate-700">{node.quickTake || 'Bridge Path'}</p>
                                                        <ul className="space-y-2">
                                                            {node.bullets?.map((bullet, bIdx) => (
                                                                <li key={bIdx} className="text-xs text-slate-200 flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                                                                    <span>{bullet}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <div className="mt-4 text-center w-full max-w-[180px] bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-100 dark:border-neutral-800 hidden md:block">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-2">{node.module}</p>
                                                </div>
                                                <div className="mt-2 text-center w-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-100 dark:border-neutral-800 md:hidden">
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{node.module}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => { setAlignmentData(null); setFiles({ transcript: null, syllabus: null }); }}>
                            Upload New Documents
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AcademicHub;
