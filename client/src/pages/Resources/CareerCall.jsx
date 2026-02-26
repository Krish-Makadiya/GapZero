import { Phone } from "lucide-react";
import CareerCallContent from "./CareerCallContent";

const CareerCall = () => {
    return (
        <div className="flex-1 w-full px-10 space-y-6 pt-6 mb-10">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Phone className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Career Guidance Call</h2>
                </div>
                <p className="text-muted-foreground mt-1">
                    Get personalized guidance on your career goals and learn how to move forward with confidence.
                </p>
            </div>

            <div className="h-screen w-full md:py-10 py-6 md:px-8 px-2">
                <CareerCallContent apiKey={"e285b4c3-08ac-44e2-9f78-38dfc58ce87b"} assistantId={"b46cb0e9-28bd-422f-9099-71be2bff0d09"} />
            </div>
        </div>
    );
};

export default CareerCall;
