import { create } from "zustand";

export const useResumeStore = create((set) => ({
    // Navigation State
    currentStep: 1,
    totalSteps: 5,

    // Resume Data
    resumeData: {
        personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            linkedin: "",
            portfolio: "",
            location: "",
            summary: "",
        },
        experience: [
            {
                id: "exp-1",
                company: "",
                role: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
            }, // Initial empty entry
        ],
        education: [
            {
                id: "edu-1",
                school: "",
                degree: "",
                location: "",
                graduationDate: "",
                gpa: "",
            }, // Initial empty entry
        ],
        skills: [], // Array of strings
        activities: "", // Text area for extra curriculars
    },

    // Actions
    goToStep: (step) => set({ currentStep: step }),
    nextStep: () =>
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        })),
    prevStep: () =>
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1),
        })),

    // Field Updaters
    updatePersonalInfo: (field, value) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                personalInfo: {
                    ...state.resumeData.personalInfo,
                    [field]: value,
                },
            },
        })),

    summaryUpdate: (value) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                personalInfo: {
                    ...state.resumeData.personalInfo,
                    summary: value,
                },
            },
        })),

    // Dynamic Array Updaters
    updateExperience: (id, field, value) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) =>
                    exp.id === id ? { ...exp, [field]: value } : exp,
                ),
            },
        })),

    addExperience: () =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: [
                    ...state.resumeData.experience,
                    {
                        id: `exp-${Date.now()}`,
                        company: "",
                        role: "",
                        location: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        description: "",
                    },
                ],
            },
        })),

    removeExperience: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.filter(
                    (exp) => exp.id !== id,
                ),
            },
        })),

    updateEducation: (id, field, value) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.map((edu) =>
                    edu.id === id ? { ...edu, [field]: value } : edu,
                ),
            },
        })),

    addEducation: () =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: [
                    ...state.resumeData.education,
                    {
                        id: `edu-${Date.now()}`,
                        school: "",
                        degree: "",
                        location: "",
                        graduationDate: "",
                        gpa: "",
                    },
                ],
            },
        })),

    removeEducation: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.filter(
                    (edu) => edu.id !== id,
                ),
            },
        })),

    updateSkills: (skillsArray) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                skills: skillsArray,
            },
        })),

    updateActivities: (value) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                activities: value,
            },
        })),

    // Demo Data for Testing
    loadDemoData: () =>
        set({
            resumeData: {
                personalInfo: {
                    fullName: "Alex Carter",
                    email: "alex.carter@example.com",
                    phone: "+1 555-0123",
                    linkedin: "linkedin.com/in/alexcarter",
                    portfolio: "alexcarter.design",
                    location: "San Francisco, CA",
                    summary:
                        "Experienced Product Designer with 5+ years of experience in building user-centered digital products. Skilled in UI/UX design, prototyping, and design systems.",
                },
                experience: [
                    {
                        id: "exp-1",
                        company: "TechFlow Solutions",
                        role: "Senior UX Designer",
                        location: "Remote",
                        startDate: "2021-03",
                        endDate: "Present",
                        current: true,
                        description:
                            "Led the redesign of the core SaaS platform, increasing user retention by 25%. Mentored junior designers and established a new design system.",
                    },
                    {
                        id: "exp-2",
                        company: "Creative Studio",
                        role: "UI Designer",
                        location: "New York, NY",
                        startDate: "2018-06",
                        endDate: "2021-02",
                        current: false,
                        description:
                            "Collaborated with cross-functional teams to ship mobile apps for Fortune 500 clients. Conducted user research and usability testing.",
                    },
                ],
                education: [
                    {
                        id: "edu-1",
                        school: "Parsons School of Design",
                        degree: "BFA in Interaction Design",
                        location: "New York, NY",
                        graduationDate: "2018-05",
                        gpa: "3.8",
                    },
                ],
                skills: [
                    "Figma",
                    "Adobe XD",
                    "React",
                    "HTML/CSS",
                    "User Research",
                    "Prototyping",
                ],
                activities:
                    "Volunteer Web Designer for local non-profits. Organizer of 'Design Talk' meetup group.",
            },
        }),
}));
