import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BookOpen, CheckCircle, Circle, Library, Loader2, ExternalLink, Trophy, TrendingUp, Sparkles, Navigation } from "lucide-react";

const Dashboard = () => {
    const { user } = useUser();
    const [learnings, setLearnings] = useState([]);
    const [loadingLearnings, setLoadingLearnings] = useState(true);

    // --- Learnings Fetching ---
    const fetchLearnings = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/api/user/learnings/${user.id}`);
            console.log("Learnings Data:", response.data);
            if (response.data && response.data.learnings) {
                setLearnings(response.data.learnings);
            }
        } catch (error) {
            console.error("Error fetching learnings:", error);
        } finally {
            setLoadingLearnings(false);
        }
    }, [user]);

    useEffect(() => {
        fetchLearnings();
    }, [fetchLearnings]);

    // --- Task Toggling ---
    const toggleTaskCompletion = async (learningDocId, skillIndex, currentStatus) => {
        // Optimistic UI Update
        const updatedLearnings = [...learnings];
        const learning = updatedLearnings.find(l => l.id === learningDocId);
        if (!learning) return;

        let skillObj = learning.skills_roadmap[skillIndex];
        skillObj.completed = !currentStatus;

        setLearnings(updatedLearnings);

        try {
            await axios.put(`${import.meta.env.VITE_SERVER_API}/api/user/learnings/${user.id}/${learningDocId}`, {
                skillIndex,
                taskIndex: -1,
                completed: !currentStatus
            });
        } catch (error) {
            console.error("Error updating task status:", error);
            // Revert on failure
            skillObj.completed = currentStatus;
            setLearnings([...updatedLearnings]);
        }
    };


    if (loadingLearnings) {
        return (
            <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-neutral-500 font-medium tracking-wide">Generating your immersive roadmap...</p>
                </div>
            </div>
        );
    }

    const hasLearnings = learnings && learnings.length > 0;

    let basePercentile = 100;
    let netPercentileSum = 0;
        
    let totalSkillsOverall = 0;
    let totalCompletedSkillsOverall = 0;

    if (hasLearnings) {
        learnings.forEach(learningDoc => {
            const skillGaps = Array.isArray(learningDoc.skills_roadmap) ? learningDoc.skills_roadmap : [];
            skillGaps.forEach(skill => {
                totalSkillsOverall += 1;
                                
                if (skill.completed) {
                    totalCompletedSkillsOverall += 1;
                    const percentVal = skill.competition_overcome_percent ?  
                        parseFloat(skill.competition_overcome_percent.toString().replace('%', '')) : 0;
                    if (!isNaN(percentVal)) {
                        netPercentileSum += percentVal;
                    }
                }
            });
        });
    }

    const currentPercentile = Math.max(1, basePercentile - netPercentileSum);
        
    let nextDropValue = 0;
    if (hasLearnings) {
        outer: for (const doc of learnings) {
            const gaps = Array.isArray(doc.skills_roadmap) ? doc.skills_roadmap : [];
            for (let i = 0; i < gaps.length; i++) {
                if (!gaps[i].completed) {
                    const percentVal = gaps[i].competition_overcome_percent ?  
                        parseFloat(gaps[i].competition_overcome_percent.toString().replace('%', '')) : 0;
                    if (!isNaN(percentVal) && percentVal > 0) nextDropValue = percentVal;
                    break outer;
                }
            }
        }
    }
    const nextPercentile = Math.max(1, currentPercentile - nextDropValue);


    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 relative">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Header Section */}
                <section>
                    <header className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                                    <Navigation className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                    My Learning Path
                                </h1>
                                <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg">Master your skill gaps sequentially and ascend to the top ranks.</p>
                            </div>

                            {hasLearnings && (
                                <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-5 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 transition-all hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 dark:from-indigo-600/20 dark:to-purple-600/20 mix-blend-overlay"></div>
                                            <TrendingUp className="w-8 h-8 text-indigo-700 dark:text-indigo-400 relative z-10" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Competition Horizon</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-black text-indigo-700 dark:text-indigo-400 drop-shadow-sm">Top {currentPercentile}%</p>
                                                <p className="text-sm font-semibold text-neutral-400">worldwide</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {hasLearnings && totalSkillsOverall > 0 && totalCompletedSkillsOverall < totalSkillsOverall && (
                            <div className="mt-6 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                <p className="text-sm md:text-base text-indigo-950 dark:text-indigo-100">
                                    <strong>Insight:</strong> Securing your next <strong>Ongoing</strong> objective drops competition by <span className="font-bold underline decoration-indigo-300 decoration-2 underline-offset-2">{nextDropValue}%</span>, elevating you to the <strong className="text-indigo-700 dark:text-indigo-300 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md shadow-sm">Top {nextPercentile}%</strong> tier globally!
                                </p>
                            </div>
                        )}
                    </header>

                    {!hasLearnings ? (
                        <div className="flex w-full items-center justify-center bg-white dark:bg-neutral-900 shadow-xl rounded-[2.5rem] p-12 max-w-xl mx-auto border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-500">
                            <div className="text-center">
                                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-50 dark:border-indigo-800/50">
                                    <Library className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-black mb-3 dark:text-white tracking-tight">Your Path is Emtpy!</h2>
                                <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                                    We don't see any active learning paths just yet. Choose a career role to begin curating your journey.
                                </p>
                                <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-2xl py-6 font-bold text-lg shadow-md shadow-indigo-600/20">
                                    Refresh Radar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {learnings.map((learningDoc, idx) => {
                                const title = learningDoc.role_name || learningDoc.skill || learningDoc.category || `Learning Track ${idx + 1}`;
                                const skillGaps = Array.isArray(learningDoc.skills_roadmap) ? learningDoc.skills_roadmap : [];

                                // Calculate aggregate stats for the Role header
                                const totalRoleTasks = skillGaps.length;
                                const completedRoleTasks = skillGaps.filter(s => s.completed).length;
                                const rolePercent = totalRoleTasks > 0 ? Math.round((completedRoleTasks / totalRoleTasks) * 100) : 0;

                                return (
                                    <div key={learningDoc.id || idx} className="bg-white dark:bg-neutral-[950] rounded-[2.5rem] shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative">
                                        {/* Subtle background glow */}
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                                        {/* Role Header */}
                                        <div className="p-8 md:p-10 border-b border-neutral-100 dark:border-neutral-800 relative z-10">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="bg-neutral-900 dark:bg-white p-4 rounded-3xl shadow-xl">
                                                        <BookOpen className="w-8 h-8 text-white dark:text-neutral-900" />
                                                    </div>
                                                    <div>
                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1 block">Target Role</span>
                                                        <h2 className="text-3xl font-black text-neutral-900 dark:text-white capitalize tracking-tight">{title}</h2>
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-72 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Total Completion</span>
                                                        <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{rolePercent}%</span>
                                                    </div>
                                                    <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${rolePercent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sequence Timeline Steps */}
                                        <div className="p-8 md:p-12 relative z-10 bg-neutral-50/30 dark:bg-neutral-950/50">
                                            {skillGaps.length === 0 ? (
                                                <div className="text-center py-10">
                                                    <p className="text-neutral-500 italic">No specific roadmap available.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Central vertical line for desktop */}
                                                    <div className="absolute left-[62px] top-12 bottom-12 w-1 bg-gradient-to-b from-indigo-200 to-indigo-50 dark:from-indigo-900/50 dark:to-transparent hidden md:block rounded-full z-0"></div>

                                                    {skillGaps.map((skillGap, sIdx) => {
                                                        const isCompleted = skillGap.completed === true;
                                                        const previousCompleted = sIdx === 0 ? true : skillGaps[sIdx - 1].completed;
                                                        const isLocked = !isCompleted && !previousCompleted;
                                                                                                                
                                                        // Resolve status theme
                                                        let statusText = "Upcoming";
                                                        let statusColor = "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700";
                                                        let cardBorder = "border-neutral-200 dark:border-neutral-800";
                                                                                                                
                                                        if (isCompleted) {
                                                            statusText = "Completed";
                                                            statusColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800";
                                                            cardBorder = "border-green-200 !bg-green-50/50 dark:border-green-900/30 dark:!bg-green-950/10";
                                                        } else if (!isLocked) {
                                                            statusText = "Ongoing";
                                                            statusColor = "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800";
                                                            cardBorder = "border-indigo-300 ring-4 ring-indigo-50 dark:border-indigo-700 dark:ring-indigo-900/20 shadow-xl shadow-indigo-100 dark:shadow-indigo-950/50 scale-[1.01] z-20";
                                                        }

                                                        const skillName = skillGap.skill || `Skill Module ${sIdx + 1}`;
                                                        const actionPlan = skillGap.action_plan || "Focus on completing this milestone to advance in your journey.";
                                                        const courseName = skillGap.udemy_course_suggestion || `Course Title Unavailable`;
                                                        const courseUrl = skillGap.udemy_course_url;
                                                        const competitionDrop = skillGap.competition_overcome_percent || "0%";

                                                        return (
                                                            <div key={sIdx} className={`relative flex flex-col md:flex-row gap-5 md:gap-8 items-start transition-all duration-500 ease-in-out ${isLocked ? 'opacity-60 grayscale-[30%] hover:opacity-80' : 'opacity-100'}`}>
                                                                                                                                
                                                                {/* Number Node Icon */}
                                                                <div className="shrink-0 mt-4 hidden md:flex flex-col items-center relative z-10">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[15px] shadow-sm transition-colors duration-300 ${isCompleted ? 'bg-green-500 text-white shadow-green-500/40 ring-4 ring-green-100 dark:ring-green-900/30' : (isLocked ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400' : 'bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-indigo-100 dark:ring-indigo-900/50')}`}>
                                                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : sIdx + 1}
                                                                    </div>
                                                                </div>

                                                                {/* Content Panel */}
                                                                <div className={`flex-1 w-full bg-white dark:bg-neutral-900 rounded-[2rem] border ${cardBorder} p-6 md:p-8 transition-all`}>
                                                                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 border-b border-neutral-100 dark:border-neutral-800/60 pb-6 mb-6">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-3 mb-4">
                                                                                <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor}`}>
                                                                                    {statusText}
                                                                                </span>
                                                                                <span className="text-[12px] font-bold tracking-wide text-amber-700 dark:text-amber-500 bg-amber-50 border border-amber-200/50 dark:border-amber-900/50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                                                                    <Trophy className="w-3.5 h-3.5 drop-shadow-sm" /> Avoids {competitionDrop} Competition
                                                                                </span>
                                                                            </div>
                                                                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-3 tracking-tight leading-tight">{skillName}</h3>
                                                                            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl font-medium">
                                                                                {actionPlan}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Action Area */}
                                                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                                                                        <div className="flex-1">
                                                                            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Suggested Action / Course</p>
                                                                            {courseUrl ? (
                                                                                <a  
                                                                                    href={isLocked ? undefined : courseUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    onClick={(e) => {
                                                                                        if (isLocked) e.preventDefault();
                                                                                    }}
                                                                                    className={`group inline-flex items-center gap-3 p-3 pr-5 rounded-2xl border ${isLocked ? 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 cursor-not-allowed text-neutral-500' : 'bg-white dark:bg-neutral-900 border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md cursor-pointer text-indigo-700 dark:text-indigo-300'} transition-all max-w-[95%]`}
                                                                                >
                                                                                    <div className={`p-2 rounded-xl shadow-sm shrink-0 flex items-center justify-center transition-colors ${isLocked ? 'bg-neutral-200 dark:bg-neutral-800' : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                                                                        <BookOpen className="w-5 h-5" />
                                                                                    </div>
                                                                                    <span className="font-bold text-sm tracking-wide truncate">{courseName}</span>
                                                                                    {!isLocked && <ExternalLink className="w-4 h-4 ml-2 opacity-40 xl:opacity-100 group-hover:opacity-100 shrink-0 transition-opacity" />}
                                                                                </a>
                                                                            ) : (
                                                                                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 italic">No direct action link provided. Focus on independent study.</p>
                                                                            )}
                                                                        </div>

                                                                        <div className="shrink-0 mt-3 xl:mt-0 flex items-end">
                                                                            <Button  
                                                                                disabled={isLocked}
                                                                                onClick={() => toggleTaskCompletion(learningDoc.id, sIdx, isCompleted)}
                                                                                variant={isCompleted ? "outline" : "default"}
                                                                                className={`w-full xl:w-auto font-bold tracking-wide gap-2 shadow-sm rounded-xl py-6 px-8 text-sm transition-all ${isCompleted ? 'text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/40' : (isLocked ? '' : 'bg-neutral-900 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white hover:scale-105 active:scale-95')}`}
                                                                            >
                                                                                {isCompleted ? (
                                                                                    <><CheckCircle className="w-5 h-5" /> Completed</>
                                                                                ) : (
                                                                                    isLocked ? <><Circle className="w-5 h-5 opacity-50" /> Locked Phase</> : <><CheckCircle className="w-5 h-5" /> Mark Status Done</>
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;