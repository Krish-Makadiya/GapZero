import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, Code } from 'lucide-react';

const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Experience', icon: Briefcase },
    { id: 3, title: 'Education', icon: GraduationCap },
    { id: 4, title: 'Skills & Extras', icon: Code },
];

const StepIndicator = ({ currentStep, goToStep }) => (
    <div className="flex justify-between items-center mb-8 px-2">
        {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
                <div key={step.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => goToStep(step.id)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' :
                            isCompleted ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-400'
                        }`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-neutral-500'}`}>
                        {step.title}
                    </span>
                </div>
            );
        })}
    </div>
);

const PersonalInfo = () => {
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const { personalInfo } = resumeData;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-neutral-800">Who are you?</h2>
            <p className="text-sm text-neutral-500 mb-6">Start with the basics so recruiters can contact you.</p>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                    <Label>Full Name</Label>
                    <Input
                        value={personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <Label>Professional Title (Optional)</Label>
                    <Input
                        value={personalInfo.summary ? personalInfo.summary.split('\n')[0] : ""} // Simple hack first line
                        placeholder="Software Engineer"
                        // Needs a dedicated field or handled in summary
                        disabled // Disabled for now, using summary directly
                    />
                    <p className="text-xs text-neutral-400">Title currently derived from target role or left blank.</p>
                </div>

                <div className="space-y-1">
                    <Label>Email</Label>
                    <Input value={personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input value={personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+1 555-0000" />
                </div>
                <div className="col-span-2 space-y-1">
                    <Label>Location</Label>
                    <Input value={personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} placeholder="City, Country" />
                </div>
                <div className="space-y-1">
                    <Label>LinkedIn (Optional)</Label>
                    <Input value={personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/john" />
                </div>
                <div className="space-y-1">
                    <Label>Portfolio (Optional)</Label>
                    <Input value={personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} placeholder="myportfolio.com" />
                </div>

                <div className="col-span-2 space-y-1 pt-2">
                    <div className="flex justify-between">
                        <Label>Professional Summary</Label>
                        <span className="text-xs text-neutral-400">{personalInfo.summary.length}/500 chars</span>
                    </div>
                    <Textarea
                        value={personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value.slice(0, 500))}
                        placeholder="Briefly describe your professional background and goals..."
                        className="min-h-[120px]"
                    />
                </div>
            </div>
        </div>
    );
};

const Experience = () => {
    const { resumeData, updateExperience, addExperience, removeExperience } = useResumeStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Experience</h2>
                <p className="text-sm text-neutral-500">Add your relevant work experience, starting with the most recent.</p>
            </div>

            {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-xl bg-neutral-50 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1">
                            <Label>Job Title</Label>
                            <Input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Senior Developer" />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label>Company</Label>
                            <Input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Acme Corp" />
                        </div>
                        <div className="space-y-1">
                            <Label>Start Date</Label>
                            <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label>End Date</Label>
                            <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                disabled={exp.current}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id={`curr-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="rounded border-neutral-300"
                                />
                                <label htmlFor={`curr-${exp.id}`} className="text-xs text-neutral-600">I currently work here</label>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-1">
                            <div className="flex justify-between">
                                <Label>Description</Label>
                                <span className="text-xs text-neutral-400">{exp.description.length}/800 chars</span>
                            </div>
                            <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value.slice(0, 800))}
                                placeholder="• Achieved X by doing Y..."
                                className="min-h-[100px]"
                            />
                            <p className="text-xs text-neutral-400">Tip: Use bullet points (•) to list achievements.</p>
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-800">
                <Plus className="w-4 h-4 mr-2" /> Add Another Position
            </Button>
        </div>
    );
};

const Education = () => {
    const { resumeData, updateEducation, addEducation, removeEducation } = useResumeStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Education</h2>
                <p className="text-sm text-neutral-500">Add your academic background.</p>
            </div>

            {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-xl bg-neutral-50 space-y-4 relative group">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label>School / University</Label>
                            <Input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} placeholder="University of Technology" />
                        </div>
                        <div className="space-y-1">
                            <Label>Degree / Major</Label>
                            <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science in Computer Science" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Graduation Date</Label>
                                <Input type="month" value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label>GPA (Optional)</Label>
                                <Input value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={addEducation} variant="outline" className="w-full border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-800">
                <Plus className="w-4 h-4 mr-2" /> Add Another Education
            </Button>
        </div>
    );
};

const SkillsExtras = () => {
    const { resumeData, updateSkills, updateActivities } = useResumeStore();
    const { skills, activities } = resumeData;

    const handleSkillsChange = (e) => {
        const val = e.target.value;
        const skillsArray = val.split(',').map(s => s.trim()); // Keep empty strings to allow typing
        // Logic to store array efficiently: For the input value we might need a local state if we want perfect comma handling, 
        // but for simplicity we directly map text to array. 
        // Better UX: Textarea that converts to array on blur or change? 
        // Let's stick to simple comma separated string logic in UI.
        updateSkills(skillsArray);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Skills & Extras</h2>
                <p className="text-sm text-neutral-500">Highlight your technical abilities and other achievements.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Skills</Label>
                    <Textarea
                        value={skills.join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="React, Node.js, Project Management, SEO..."
                        className="min-h-[80px]"
                    />
                    <p className="text-xs text-neutral-400">Separate each skill with a comma.</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                        <Label>Volunteering & Activities</Label>
                        <span className="text-xs text-neutral-400">{activities.length}/400 chars</span>
                    </div>
                    <Textarea
                        value={activities}
                        onChange={(e) => updateActivities(e.target.value.slice(0, 400))}
                        placeholder="Club President, Volunteer at Animal Shelter..."
                        className="min-h-[100px]"
                    />
                </div>
            </div>
        </div>
    );
};

const ResumeForm = () => {
    const { currentStep, nextStep, prevStep, goToStep, totalSteps } = useResumeStore();

    return (
        <div className="flex flex-col h-full bg-white border-r border-neutral-200">
            {/* Header / Nav */}
            <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                <StepIndicator currentStep={currentStep} goToStep={goToStep} />
            </div>

            {/* Form Content Scrolling Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-xl mx-auto">
                    {currentStep === 1 && <PersonalInfo />}
                    {currentStep === 2 && <Experience />}
                    {currentStep === 3 && <Education />}
                    {currentStep === 4 && <SkillsExtras />}
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-neutral-100 bg-white flex justify-between items-center z-10">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="text-neutral-500 hover:text-neutral-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {currentStep < totalSteps ? (
                    <Button onClick={nextStep} className="bg-neutral-900 hover:bg-neutral-800 text-white px-8">
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                        Finish & Download
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ResumeForm;
