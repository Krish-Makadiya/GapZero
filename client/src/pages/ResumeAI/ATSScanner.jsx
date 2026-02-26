import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
    Upload, FileText, CheckCircle, AlertCircle, Info,
    TrendingUp, Target, Brain, Zap, Loader2, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from 'axios';

const MOCK_RESULT = [
    {
        "atsScore": 93,
        "matchStatus": "High Match",
        "summary": "This candidate is an exceptional fit, possessing MERN expertise, strong measurable impact (40% speed boost), and covering advanced preferred skills like Docker, Kubernetes, Next.js, and Redis. Despite being an early career profile, their project scope and technology breadth indicate readiness for this role's technical demands.",
        "hardSkills": {
            "present": [
                "MERN Stack", "React.js", "Node.js", "Express.js", "MongoDB",
                "JavaScript (ES6+)", "RESTful APIs", "Tailwind CSS", "Performance Optimization",
                "Git/GitHub"
            ],
            "missing": [
                "TypeScript", "OAuth",
                "MongoDB Aggregation", "AWS/Cloud"
            ]
        },
        "implicitSkillsDetected": [
            {
                "skill": "State Management (React)",
                "reason": "Building complex, interactive UIs like the Arogya platform with video/chat requires advanced state management (e.g., Redux/Context)."
            },
            {
                "skill": "Database Schema Design",
                "reason": "Designing secure digital health records and implementing end-to-end workflows for a telemedicine platform necessitates strong MongoDB schema design."
            },
            {
                "skill": "CI/CD & Deployment Automation",
                "reason": "Explicit mention of 'CI/CD' in the summary and usage of Jenkins and Docker Hub in the SharkChat project."
            },
            {
                "skill": "Nginx Configuration / Reverse Proxying",
                "reason": "Used Nginx to design a scalable, containerized architecture to handle concurrent users with low latency, implying reverse proxy and basic load balancing knowledge."
            }
        ],
        "quantificationAnalysis": {
            "score": "High",
            "explanation": "Excellent usage of hard metrics for an intern/early career profile. Key impacts include 'Boosted 40% page load speed,' 'inspected 15+ PRs,' and 'Led a 6-member team.' Metrics focus on speed, volume, and leadership scope."
        },
        "fluffPhrases": [
            "collaborative, ownership-driven mindset"
        ],
        "improvementPlan": {
            "weakestBulletPoint": "Adhered to bi-weekly sprint planning and inspected 15+ PRs to ensure code quality and enhance collaboration among different modules in the team.",
            "suggestedRewrite": "Drove application quality and integration velocity by inspecting 15+ cross-functional Pull Requests during bi-weekly Agile sprints, preventing critical errors and accelerating feature deployment by 10% [inferred metric]."
        },
        "interviewPrep": {
            "predictedQuestion": "Your SharkChat project utilized Docker, Kubernetes, and Socket.IO. If your application needed to scale across multiple Kubernetes pods, how did you architect Socket.IO (e.g., using Redis adapters) to maintain consistent state and ensure reliable real-time message delivery across the cluster?"
        }
    }
];

const InfoTrigger = ({ content }) => (
    <TooltipProvider>
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                <div className="cursor-help inline-flex items-center justify-center ml-2 text-muted-foreground hover:text-primary transition-colors">
                    <Info className="w-4 h-4" />
                </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-3">
                <p className="text-sm">{content}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const ScoreCircle = ({ score }) => {
    const radius = 100;
    const stroke = 16;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const animation = animate(count, score, { duration: 1.5, ease: "easeOut" });
        return animation.stop;
    }, [score]);

    return (
        <div className="relative flex items-center justify-center p-4">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="-rotate-90 transition-all duration-1000 ease-out"
            >
                <circle
                    stroke="var(--color-input)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    stroke="var(--color-primary)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={`${circumference} ${circumference}`}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <motion.span
                    className="text-4xl font-bold font-['Titan_One'] text-primary"
                >
                    {rounded}
                </motion.span>
                <span className="text-xs text-muted-foreground font-semibold">ATS SCORE</span>
            </div>
        </div>
    );
};

const ATSScanner = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [resumeRawData, setResumeRawData] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location.state?.jobDescription) {
            setJobDescription(location.state.jobDescription);
        }
    }, [location.state]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleScan = async () => {
        if (!file || !jobDescription) return;
        setLoading(true);

        // Simulate API call payload construction
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        console.log("Submitting Scan:", {
            fileName: file.name,
            jobDescription: jobDescription
        });

        try {
            const response = await axios.post('http://localhost:5678/webhook/d3ba70b8-fc36-4be6-b4f2-01817cfdf1ab', formData);
            console.log(response.data[0]);
            setResult(response.data[0].json);
            setResumeRawData(response.data[0].resumeRawData);
        } catch (error) {
            console.error('Error scanning resume:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <div className="min-h-screen p-6 md:p-10 space-y-12 w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-['Titan_One'] text-foreground">
                    ATS <span className="text-primary">Resume Scanner</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Optimize your resume with AI-powered insights. Get a detailed analysis of your ATS score,
                    missing skills, and actionable improvements.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-[400px]">
                            {/* Job Description Input */}
                            <div className="space-y-4 col-span-2 flex flex-col h-full bg-card/30 p-6 rounded-3xl border border-border/50 backdrop-blur-sm shadow-xs">
                                <Label htmlFor="job-description" className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Job Description
                                </Label>
                                <Textarea
                                    id="job-description"
                                    placeholder="Paste the job description here..."
                                    className="flex-1 resize-none bg-background/50 border-input/50 focus:border-primary/50 text-base leading-relaxed"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            {/* Resume Upload Dropzone */}
                            <div
                                className={`
                                    relative flex flex-col items-center justify-center p-8 
                                    border-2 border-dashed rounded-3xl transition-all duration-300 h-full
                                    cursor-pointer overflow-hidden
                                    ${isDragging
                                        ? 'border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10'
                                        : 'border-border bg-card/30 hover:bg-card/50 hover:border-primary/30'
                                    }
                                    ${file ? 'border-green-500/50 bg-green-500/5' : ''}
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('resume-upload').click()}
                            >
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileChange}
                                />

                                <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                                <div className={`
                                    rounded-full p-6 mb-6 transition-all duration-300 shadow-lg
                                    ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-background text-muted-foreground'}
                                    ${file ? 'bg-green-500 text-white' : ''}
                                `}>
                                    {file ? <CheckCircle className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                                </div>

                                <div className="space-y-2 text-center z-10 px-4">
                                    <h3 className="text-xl font-bold tracking-tight">
                                        {file ? "Resume Uploaded" : "Drop Resume Here"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
                                        {file ? file.name : "Upload your PDF or DOCX resume to match against the job description."}
                                    </p>
                                </div>

                                {file && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                    >
                                        Remove File
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                size="lg"
                                className="px-12 py-6 text-lg font-bold shadow-xl shadow-primary/25 rounded-full transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
                                onClick={handleScan}
                                disabled={loading || !file || !jobDescription.trim()}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing Match...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="mr-2 h-5 w-5 fill-current" />
                                        Scan & Match
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Top Bar: Score & Status */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <Card className="col-span-1 border-none shadow-xl bg-linear-to-br from-card to-secondary/30">
                                <CardHeader className="pb-0">
                                    <CardTitle className="flex items-center text-lg font-medium text-muted-foreground">
                                        Overall Match
                                        <InfoTrigger content="Your ATS readiness score based on keyword matching, formatting, and content relevance." />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center pt-2">
                                    <ScoreCircle score={result.atsScore} />
                                    <Badge variant={result.matchStatus === "High Match" ? "default" : "secondary"} className="mt-4 px-4 py-1 text-sm rounded-full">
                                        {result.matchStatus}
                                    </Badge>
                                </CardContent>
                            </Card>

                            {/* Summary Card */}
                            <Card className="col-span-1 lg:col-span-2 border-none shadow-lg bg-card/60 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-primary" />
                                        AI Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg leading-relaxed text-foreground/90 font-light">
                                        {result.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Skills Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Present Skills */}
                            <Card className="border-l-4 border-l-green-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" /> Matches
                                        </span>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            {result.hardSkills.present.length} Found
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.hardSkills.present.map((skill, i) => (
                                            <Badge key={i} variant="secondary" className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Missing Skills */}
                            <Card className="border-l-4 border-l-red-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-500" /> Missing
                                        </span>
                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                            {result.hardSkills.missing.length} Missing
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.hardSkills.missing.map((skill, i) => (
                                            <Badge key={i} variant="outline" className="px-3 py-1 border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Implicit Skills */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">Implicit Skills Detected</h2>
                                <InfoTrigger content="Skills inferred from your project descriptions and tasks, even if not explicitly listed." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.implicitSkillsDetected.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-5 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm"
                                    >
                                        <h3 className="font-semibold text-lg text-primary mb-2">{item.skill}</h3>
                                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Metrics & Fluff */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="col-span-1 lg:col-span-2 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                        Impact Quantification
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Score</div>
                                        <Badge className="bg-blue-500 text-white hover:bg-blue-600">{result.quantificationAnalysis.score}</Badge>
                                    </div>
                                    <p className="text-foreground/80">{result.quantificationAnalysis.explanation}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md border-red-100 dark:border-red-900/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <X className="w-5 h-5 text-red-500" />
                                        Vague Phrases
                                    </CardTitle>
                                    <CardDescription>Avoid these fluff words</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.fluffPhrases.map((phrase, i) => (
                                            <span key={i} className="px-3 py-1 rounded-md bg-red-100 text-red-600 text-sm font-medium dark:bg-red-900/20 dark:text-red-400">
                                                {phrase}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Improvement Plan */}
                        <Card className="bg-secondary/20 border-none shadow-inner">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-500" />
                                    Improvement Suggestion
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2 p-4 rounded-lg bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                    <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm uppercase">Weak Bullet Point</h4>
                                    <p className="text-sm italic text-muted-foreground">"{result.improvementPlan.weakestBulletPoint}"</p>
                                </div>
                                <div className="space-y-2 p-4 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                    <h4 className="font-semibold text-green-600 dark:text-green-400 text-sm uppercase">Suggested Rewrite</h4>
                                    <p className="text-sm font-medium text-foreground">{result.improvementPlan.suggestedRewrite}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Prep */}
                        <Card className="bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    Prep for your Interview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-medium text-white/80 mb-2 text-sm uppercase tracking-wide">Most Likely Question</h4>
                                <p className="text-lg font-medium leading-relaxed">
                                    "{result.interviewPrep.predictedQuestion}"
                                </p>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center pt-8 gap-4">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={resetScanner}>
                                Upload another resume
                            </Button>
                            <Button
                                className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20"
                                onClick={async () => {
                                    try {
                                        // 1. Prepare Data
                                        const payload = {
                                            improvementPlan: result.improvementPlan,
                                            quantificationScore: result.quantificationAnalysis.score,
                                            fluffPhrases: result.fluffPhrases,
                                            resumeContent: resumeRawData,
                                        };

                                        // 2. Store in Version History (Local Storage for now)
                                        const historyItem = {
                                            id: crypto.randomUUID(),
                                            name: jobDescription.substring(0, 50) + (jobDescription.length > 50 ? "..." : ""), // Use substring as name might be long
                                            fullJobDescription: jobDescription,
                                            date: new Date().toISOString(),
                                            ...payload
                                        };

                                        const existingHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
                                        localStorage.setItem('resumeHistory', JSON.stringify([historyItem, ...existingHistory]));

                                        alert("Resume sent for refinement!");
                                        // 3. Send to Webhook
                                        // 3. Send to Webhook and Download Binary
                                        const res = await axios.post(
                                            "http://localhost:5678/webhook/48f54861-10d7-4842-be8a-1d8d6adc0c10",
                                            payload,
                                            { responseType: 'blob' } // Important for binary files
                                        );

                                        console.log("Webhook response:", res);

                                        // Create a blob from the response data
                                        const blob = new Blob([res.data], { type: 'application/pdf' });

                                        // Create a link element and trigger download
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', 'refined_resume.pdf'); // Set desired filename
                                        document.body.appendChild(link);
                                        link.click();

                                        // Cleanup
                                        link.parentNode.removeChild(link);
                                        window.URL.revokeObjectURL(url);


                                    } catch (error) {
                                        console.error("Error refining resume:", error);
                                        alert("Failed to send resume for refinement.");
                                    }
                                }}
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                Refine Resume
                            </Button>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ATSScanner;