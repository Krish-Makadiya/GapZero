import { useState } from "react";
import { Copy, Check, Edit2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const templatesData = [
    {
        id: 1,
        title: "Direct Application",
        subject: "Application for [Role] - [Your Name]",
        body: `Hi [Hiring Manager Name],

I've been following [Company Name] for a while and love your work on [Specific Project/Feature].

I'm a [Current Role] with experience in [Key Skill 1] and [Key Skill 2]. I recently [Achievement relating to job requirements].

I noticed the [Role] opening and believe my background in [Relevant Field] would be a great fit. I've attached my resume and would love to chat about how I can contribute to your team.

Best,
[Your Name]
[Portfolio Link]`
    },
    {
        id: 2,
        title: "The 'Value Add' Approach",
        subject: "Idea for [Company Name] - [Your Name]",
        body: `Hi [Name],

I was using [Product/Service] recently and noticed a quick win you could implement regarding [Specific Feature]. I mocked up a quick concept here: [Link].

I'm a [Role] passionate about building products that users love. I'd love to bring this same proactive energy to the [Role] position at [Company Name].

Are you open to a 10-minute chat next week?

Cheers,
[Your Name]`
    },
    {
        id: 3,
        title: "The Referral Request",
        subject: "Quick question about [Company Name]",
        body: `Hi [Name],

I see you're working as a [Role] at [Company Name]. I'm a huge fan of the company's culture and mission to [Company Mission].

I'm currently applying for the [Role] position and was hoping to ask a couple of quick questions about your experience there. I promise to keep it brief!

Would you be open to a short call or email exchange?

Thanks,
[Your Name]`
    },
    {
        id: 4,
        title: "Short & Punchy",
        subject: "[Role] Opportunity",
        body: `Hi [Name],

I saw the [Role] opening and couldn't not apply.

I have [Number] years of experience shipping code at [Company/Project]. My stack is mainly [Tech Stack].

I know you're busy, so I'll keep this short. My resume is attached.

Let me know if you'd like to chat.

Best,
[Your Name]`
    },
    {
        id: 5,
        title: "The Follow Up",
        subject: "Following up on my application for [Role]",
        body: `Hi [Name],

I wanted to quickly follow up on my application for the [Role] position submitted last week.

I'm still very interested in the opportunity to join [Company Name] and help build [Product/Feature].

Please let me know if you need any additional information from my end.

Best,
[Your Name]`
    },
    {
        id: 6,
        title: "Project Showcase",
        subject: "Built a project using [Company's Tech]",
        body: `Hi [Name],

I recently built a [Project Name] using [Company's Product/API] and was blown away by the developer experience. You can check it out here: [Link].

I'm currently looking for new opportunities and saw the [Role] opening. Having hands-on experience with your tech, I'm confident I can hit the ground running.

Would love to discuss how I can contribute.

Best,
[Your Name]`
    }
];

const ColdEmailTemplates = () => {
    const [templates, setTemplates] = useState(templatesData);
    const [copiedId, setCopiedId] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEditChange = (id, field, value) => {
        setTemplates(templates.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    const handleReset = (id) => {
        const original = templatesData.find(t => t.id === id);
        setTemplates(templates.map(t =>
            t.id === id ? original : t
        ));
    };

    return (
        <div className="flex-1 w-full px-10 space-y-6 pt-6 mb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Cold Email Templates</h2>
                <p className="text-muted-foreground mt-1">
                    Proven, high-conversion templates to help you land your dream job. Customize and copy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex justify-between items-center text-lg">
                                {template.title}
                                <div className="flex gap-1">
                                    {editingId === template.id ? (
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReset(template.id)} title="Reset to default">
                                            <RotateCcw className="h-3.5 w-3.5" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(template.id)} title="Edit Template">
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 text-sm">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Subject</label>
                                {editingId === template.id ? (
                                    <Input
                                        value={template.subject}
                                        onChange={(e) => handleEditChange(template.id, 'subject', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                ) : (
                                    <div className="p-2 bg-muted/50 rounded-md text-foreground font-medium border border-transparent">
                                        {template.subject}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Body</label>
                                {editingId === template.id ? (
                                    <Textarea
                                        value={template.body}
                                        onChange={(e) => handleEditChange(template.id, 'body', e.target.value)}
                                        className="text-sm min-h-[200px] leading-relaxed"
                                    />
                                ) : (
                                    <div className="p-3 bg-muted/30 rounded-md text-muted-foreground whitespace-pre-wrap leading-relaxed border border-transparent h-full max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                        {template.body}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 pb-6">
                            <Button
                                className="w-full gap-2"
                                variant={copiedId === template.id ? "default" : "outline"}
                                onClick={() => handleCopy(`${template.subject}\n\n${template.body}`, template.id)}
                            >
                                {copiedId === template.id ? (
                                    <>
                                        <Check className="h-4 w-4" /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" /> Copy to Clipboard
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ColdEmailTemplates;
