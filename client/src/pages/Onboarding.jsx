import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { useUser } from "@clerk/clerk-react"
import axios from "axios"
import { FileText, Loader2, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import GuidanceCall from "./Resources/GuidanceCall"

const rolesList = [
    "Frontend Developer", "Backend Developer", "Fullstack Developer",
    "Mobile Developer", "DevOps Engineer", "UI/UX Designer",
    "Data Scientist", "Product Manager", "Software Engineer",
    "Machine Learning Engineer", "Cybersecurity Analyst", "Data Engineer",
    "SRE", "Cloud Architect", "AI Engineer", "System Administrator",
    "Network Engineer", "QA Engineer"
]

const skillsList = [
    "React", "Vue", "Angular", "Node.js", "Python", "Java", "Go",
    "Rust", "Docker", "Kubernetes", "AWS", "Figma", "TypeScript",
    "TailwindCSS", "PostgreSQL", "MongoDB", "C++", "C#", "Azure",
    "GCP", "GraphQL", "Next.js", "Redis", "Terraform", "Linux",
    "Git", "Jenkins", "SQL", "NoSQL", "Swift", "Kotlin", "Flutter",
    "React Native"
]

const countriesList = [
    "United States", "United Kingdom", "Canada", "Germany", "India", "Australia",
    "Remote", "France", "Netherlands", "Singapore", "Japan", "Brazil",
    "Sweden", "Switzerland", "Ireland", "Spain", "Italy"
]

const companiesList = [
    "Airbnb", "Dropbox", "Pinterest", "Reddit", "Twilio", "HubSpot",
    "Notion", "Zapier", "Asana", "Lyft", "Figma", "Cloudflare",
    "Postman", "Miro", "Mixpanel", "Stripe", "Coinbase", "Robinhood",
    "Instacart", "DoorDash", "Slack", "Zoom"
]

// Mapped for logic checks (Key = Keyword in Job Title/Desc, Value = Your Category)
const experienceLevelsList = {
    "intern": "Internship",
    "co-op": "Internship",
    "graduate": "Entry Level",
    "entry": "Entry Level",
    "junior": "Junior (1-3 yrs)",
    "associate": "Junior (1-3 yrs)",
    "mid": "Mid Level (3-5 yrs)",
    "senior": "Senior (5+ yrs)",
    "staff": "Senior (5+ yrs)",
    "principal": "Senior (5+ yrs)",
    "lead": "Lead / Manager",
    "manager": "Lead / Manager",
    "head": "Lead / Manager",
    "director": "Lead / Manager"
};

const experienceOptions = [...new Set(Object.values(experienceLevelsList))]

const jobTypesList = [
    "Full-time", "Part-time", "Contract", "Freelance", "Internship"
]

const learningRoles = [
    {
        title: "Frontend Developer",
        description: "Build user interfaces and web applications using modern frameworks.",
        learn: ["React", "CSS", "JavaScript", "UI/UX"]
    },
    {
        title: "Backend Developer",
        description: "Focus on server-side logic, databases, APIs, and overall system architecture.",
        learn: ["Node.js", "Python", "SQL", "APIs"]
    },
    {
        title: "Data Scientist",
        description: "Analyze complex data to help organizations make decisions and build models.",
        learn: ["Python", "Machine Learning", "SQL", "Data Viz"]
    },
    {
        title: "DevOps Engineer",
        description: "Bridge the gap between development and operations by automating pipelines.",
        learn: ["Docker", "Kubernetes", "CI/CD", "AWS"]
    },
    {
        title: "Mobile Developer",
        description: "Create native and cross-platform mobile apps for iOS and Android.",
        learn: ["React Native", "Swift", "Kotlin", "Flutter"]
    },
    {
        title: "UI/UX Designer",
        description: "Design seamless, intuitive, and visually appealing user experiences.",
        learn: ["Figma", "User Research", "Prototyping", "Design"]
    }
];

const MultiSelect = ({ options, value, onChange, placeholder, label }) => {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.toLowerCase().includes(query.toLowerCase()) &&
            !value.includes(option)
        )
    }, [options, query, value])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option) => {
        onChange([...value, option])
        setQuery("")
    }

    const handleRemove = (option) => {
        onChange(value.filter(item => item !== option))
    }

    return (
        <div className="space-y-2 w-full" ref={containerRef}>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
            <div
                className="relative flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-within:ring-2 focus-within:ring-neutral-950 focus-within:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-within:ring-neutral-300 transition-shadow duration-200"
                onClick={() => setIsOpen(true)}
            >
                {value.length > 0 && value.map((item) => (
                    <Badge key={item} variant="secondary" className="hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                        {item}
                        <button
                            className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRemove(item)
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onClick={() => handleRemove(item)}
                        >
                            <X className="h-3 w-3 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50" />
                        </button>
                    </Badge>
                ))}

                <input
                    className="flex-1 bg-transparent outline-none placeholder:text-neutral-400 min-w-[100px]"
                    placeholder={value.length === 0 ? placeholder : ""}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && (filteredOptions.length > 0 || query) && (
                <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
                    <div className="p-1">
                        {filteredOptions.length === 0 ? (
                            <p className="p-2 text-sm text-neutral-500 text-center">No results found.</p>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const Onboarding = () => {
    const { user } = useUser()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [hasResume, setHasResume] = useState(null)
    const [resumeFile, setResumeFile] = useState(null)
    const [selectedRole, setSelectedRole] = useState("")
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("")
    const [selectedJobTypes, setSelectedJobTypes] = useState([])
    const [selectedSkills, setSelectedSkills] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false);


    const toggleJobType = (type) => {
        if (selectedJobTypes.includes(type)) {
            setSelectedJobTypes(prev => prev.filter(t => t !== type))
        } else {
            setSelectedJobTypes(prev => [...prev, type])
        }
    }

    const toggleCountry = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(prev => prev.filter(c => c !== country))
        } else {
            setSelectedCountries(prev => [...prev, country])
        }
    }

    const toggleCompany = (company) => {
        if (selectedCompanies.includes(company)) {
            setSelectedCompanies(prev => prev.filter(c => c !== company))
        } else {
            setSelectedCompanies(prev => [...prev, company])
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setResumeFile(file);
    };

    const handleResumeSubmit = async () => {
        if (!resumeFile) return;

        setIsUploading(true);
        const data = new FormData();
        data.append('resume', resumeFile);
        data.append('user_id', user?.id);

        try {
            const response = await axios.post(`http://localhost:5678/webhook/9be83282-5446-4a2f-ad0e-4b6965be5095`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Resume Parsed Data:", response.data);

            if (response.data && response.data.resumeData) {
                const payload = {
                    ...response.data.resumeData,
                    clerkId: user?.id,
                    imageUrl: user?.imageUrl
                }

                const res = await axios.post(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile`, payload)
                // console.log("User Profile Response:", res.data);
                if (response.data.jobPreferences) {
                    setSelectedRole(response.data.jobPreferences.selectedRole || "");
                    setSelectedExperienceLevel(response.data.jobPreferences.selectedExperienceLevel || "");
                    setSelectedJobTypes(response.data.jobPreferences.selectedJobTypes || [])
                    setSelectedSkills(response.data.jobPreferences.selectedSkills || [])
                }
            }

            setStep(2);

        } catch (error) {
            console.error("Error parsing resume:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (isNoResumeFlow = false) => {
        if (!isNoResumeFlow) {
            if (!selectedRole || !selectedExperienceLevel || selectedJobTypes.length === 0) return
        }

        setIsSubmitting(true)
        try {
            const onboardingData = {
                role: selectedRole,
                experienceLevel: selectedExperienceLevel,
                jobTypes: selectedJobTypes,
                skills: selectedSkills,
                countries: selectedCountries,
                companies: selectedCompanies,
                userId: user.id
            }
            console.log("Onboarding Data:", onboardingData)

            if (user) {
                try {
                    await user.update({
                        unsafeMetadata: {
                            onboarded: true,
                            ...onboardingData
                        }
                    })
                } catch (err) {
                    console.warn("Could not update metadata:", err)
                }
            }

            const payloadBody = {
                clerkId: user.id,
                ...onboardingData
            };

            // Note: Update this webhook URL to your actual n8n workflow webhook URL
            const n8nWebhookUrl = 'http://localhost:5678/webhook/get-filtered-jobs';

            const response = await axios.post(n8nWebhookUrl, payloadBody);
            console.log("Processed n8n info:", response.data);

            navigate("/dashboard")
        } catch (error) {
            console.error("Onboarding failed:", error)
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleNoResumeSubmit = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);
        try {
            const selectedRoleObj = learningRoles.find(r => r.title === selectedRole);
            const intrest_skills = selectedRoleObj ? selectedRoleObj.learn : [];

            if (user) {
                try {
                    await user.update({
                        unsafeMetadata: {
                            onboarded: true,
                            role: selectedRole,
                            intrest_skills: intrest_skills
                        }
                    })
                } catch (err) {
                    console.warn("Could not update metadata:", err)
                }
            }

            // Hit another API call with the intrest_skills payload
            try {
                // Adjust this webhook URL if you need a different endpoint
                await axios.post('http://localhost:5678/webhook/f190af8f-2d42-4f18-a860-0259f6c959c9', {
                    role: selectedRole,
                    userId: user?.id,
                    intrest_skills: intrest_skills
                });
            } catch (webhookErr) {
                console.warn("Exploration webhook failed:", webhookErr);
            }

            // Optional: Also save this to your Firebase backend via the existing user-profile endpoint
            await axios.post(`${import.meta.env.VITE_SERVER_API}/api/user/user-profile`, {
                clerkId: user?.id,
                role: selectedRole,
                intrest_skills: intrest_skills
            });

            navigate("/dashboard");
        } catch (error) {
            console.error("No-resume Onboarding failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl bg-white dark:bg-neutral-950 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent mb-3">
                        Welcome, {user?.firstName || "there"}!
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        {step === 1 ? "Help us tailor your job feed by answering a few quick questions." : "Review your extracted details and complete onboarding."}
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="text-center space-y-4">
                            <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
                                Do you have a resume to upload?
                            </h2>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant={hasResume === true ? "default" : "outline"}
                                    onClick={() => setHasResume(true)}
                                    className={hasResume === true ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0" : ""}
                                >
                                    Yes, I have a resume
                                </Button>
                                <Button
                                    variant={hasResume === false ? "default" : "outline"}
                                    onClick={() => setHasResume(false)}
                                    className={hasResume === false ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0" : ""}
                                >
                                    No, I don't
                                </Button>
                            </div>
                        </div>

                        {hasResume === true && (
                            <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4">
                                <p className="text-neutral-500 dark:text-neutral-400 text-center">
                                    Upload your resume and we'll automatically fill out your profile!
                                </p>
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <label htmlFor="resume-upload">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 gap-2 cursor-pointer px-8 py-4 text-lg h-auto"
                                            onClick={() => document.getElementById('resume-upload').click()}
                                            disabled={isUploading}
                                        >
                                            <FileText className="h-6 w-6" />
                                            {resumeFile ? "Change Resume" : "Upload Resume"}
                                        </Button>
                                    </label>

                                    {resumeFile && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                                Selected: {resumeFile.name}
                                            </span>
                                            <Button
                                                type="button"
                                                onClick={handleResumeSubmit}
                                                disabled={isUploading}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-lg h-auto shadow-lg hover:shadow-green-500/30 transition-all duration-300"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                ) : null}
                                                {isUploading ? "Parsing Resume..." : "Submit File"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {hasResume === false && (
                            <div className="flex flex-col gap-6 mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-full mb-4">
                                    <GuidanceCall
                                        apiKey={"e285b4c3-08ac-44e2-9f78-38dfc58ce87b"} assistantId={"b46cb0e9-28bd-422f-9099-71be2bff0d09"}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-center font-medium text-neutral-800 dark:text-neutral-200 text-lg mb-6">
                                        ...Or tell us a bit about what roles you want to explore manually.
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {learningRoles.map((role) => {
                                            const isSelected = selectedRole === role.title;
                                            return (
                                                <div
                                                    key={role.title}
                                                    onClick={() => setSelectedRole(role.title)}
                                                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-neutral-200 hover:border-indigo-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"}`}
                                                >
                                                    <h4 className={`font-semibold ${isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-neutral-900 dark:text-neutral-100"}`}>{role.title}</h4>
                                                    <p className="text-sm text-neutral-500 mt-1 mb-3">{role.description}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                                        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mr-1 self-center">You'll learn:</span>
                                                        {role.learn.map(skill => (
                                                            <span key={skill} className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-600 dark:text-neutral-300">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                                        <Button
                                            type="button"
                                            onClick={handleNoResumeSubmit}
                                            disabled={isSubmitting || !selectedRole}
                                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                            {isSubmitting ? "Generating..." : "Start Exploring"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        {/* Top Section: Role & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Desired Role <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={selectedRole}
                                    onChange={setSelectedRole}
                                    options={rolesList}
                                    placeholder="Select a role"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Experience Level <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={selectedExperienceLevel}
                                    onChange={setSelectedExperienceLevel}
                                    options={experienceOptions}
                                    placeholder="Select level"
                                />
                            </div>
                        </div>

                        {/* Job Types - Pills */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Job Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {jobTypesList.map((type) => {
                                    const isSelected = selectedJobTypes.includes(type)
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => toggleJobType(type)}
                                            className={`
                                                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                                ${isSelected
                                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-sm"
                                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"}
                                            `}
                                        >
                                            {type}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                        {/* Multi-Select for Skills */}
                        <MultiSelect
                            label="Key Skills"
                            placeholder="Type to search skills (e.g. React, Python)..."
                            options={skillsList}
                            value={selectedSkills}
                            onChange={setSelectedSkills}
                        />

                        {/* Countries - Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Preferred Countries
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {countriesList.map((country) => {
                                    const isSelected = selectedCountries.includes(country)
                                    return (
                                        <button
                                            key={country}
                                            onClick={() => toggleCountry(country)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                                                ${isSelected
                                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-sm"
                                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"}
                                            `}
                                        >
                                            {country}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Companies - Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Target Companies
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {companiesList.map((company) => {
                                    const isSelected = selectedCompanies.includes(company)
                                    return (
                                        <button
                                            key={company}
                                            onClick={() => toggleCompany(company)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                                                ${isSelected
                                                    ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-sm"
                                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"}
                                            `}
                                        >
                                            {company}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => handleSubmit(false)}
                                disabled={!selectedRole || !selectedExperienceLevel || selectedJobTypes.length === 0 || isSubmitting}
                                className="w-full md:w-auto min-w-[200px]"
                            >
                                {isSubmitting ? "Saving..." : "Start Exploring Jobs"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-neutral-400 text-sm text-center">
                You can always update these preferences later in Settings.
            </p>
        </div>
    )
}

export default Onboarding
