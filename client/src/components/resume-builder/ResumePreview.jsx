import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const ResumePreview = () => {
    const { resumeData } = useResumeStore();
    const { personalInfo, experience, education, skills, activities } = resumeData;

    return (
        <div className="w-full h-full flex items-start justify-center p-8 bg-neutral-100 overflow-y-auto custom-scrollbar">
            {/* A4 Container */}
            <div
                id="resume-preview"
                className="bg-white text-neutral-900 shadow-xl w-[210mm] min-h-[297mm] relative print:shadow-none print:w-full"
                style={{
                    // No fixed aspect ratio here to allow content to grow naturally, but min-height matches A4
                }}
            >
                <div className="p-12 space-y-8">

                    {/* Header */}
                    <div className="border-b-2 border-neutral-900 pb-8">
                        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-neutral-900 mb-2">
                            {personalInfo.fullName || "Your Name"}
                        </h1>
                        <p className="text-lg text-neutral-600 font-medium mb-4">
                            {personalInfo.summary ? "Professional Profile" : "Software Engineer"}
                            {/* We might want a dedicated Role field, but for now using the summary title or hardcoded placeholder logic if empty */}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                            {personalInfo.email && (
                                <div className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                                    <Linkedin className="w-3.5 h-3.5" />
                                    <span>{personalInfo.linkedin}</span>
                                </div>
                            )}
                            {personalInfo.portfolio && (
                                <div className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{personalInfo.portfolio}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <section>
                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-neutral-200 pb-1">Professional Summary</h3>
                            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (experience[0].company || experience[0].role) && (
                        <section>
                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-1">Experience</h3>
                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    (exp.company || exp.role) && (
                                        <div key={exp.id} className="group">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-neutral-900 text-base">{exp.role}</h4>
                                                <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                                </span>
                                            </div>
                                            <div className="text-sm font-semibold text-neutral-600 mb-2">{exp.company}</div>
                                            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (education[0].school || education[0].degree) && (
                        <section>
                            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-1">Education</h3>
                            <div className="space-y-4">
                                {education.map((edu, idx) => (
                                    (edu.school || edu.degree) && (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-neutral-900 text-sm">{edu.school}</h4>
                                                <span className="text-xs text-neutral-500">{edu.graduationDate}</span>
                                            </div>
                                            <div className="text-sm text-neutral-700">{edu.degree}</div>
                                            {edu.gpa && <div className="text-xs text-neutral-500 mt-1">GPA: {edu.gpa}</div>}
                                        </div>
                                    )
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills & Activities */}
                    <div className="grid grid-cols-2 gap-8">
                        {skills.length > 0 && skills[0] !== "" && (
                            <section>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-neutral-200 pb-1">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.filter(s => s.trim() !== "").map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-md border border-neutral-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activities && (
                            <section>
                                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-neutral-200 pb-1">Activities</h3>
                                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {activities}
                                </p>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
