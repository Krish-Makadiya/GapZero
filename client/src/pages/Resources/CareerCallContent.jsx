import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import {
    Mail,
    MessageCircleMore,
    Phone,
    PhoneMissed,
    PhoneOutgoing,
    TriangleAlert,
} from "lucide-react";
import GuidanceCall from "./GuidanceCall";

const CallContent = ({ apiKey, assistantId }) => {
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);


    useEffect(() => {
        const vapiInstance = new Vapi(apiKey);
        setVapi(vapiInstance);
        // Event listeners
        vapiInstance.on("call-start", () => {
            console.log("Call started");
            setIsConnected(true);
        });
        vapiInstance.on("call-end", () => {
            console.log("Call ended");
            setIsConnected(false);
            setIsSpeaking(false);
        });
        vapiInstance.on("speech-start", () => {
            console.log("Assistant started speaking");
            setIsSpeaking(true);
        });
        vapiInstance.on("speech-end", () => {
            console.log("Assistant stopped speaking");
            setIsSpeaking(false);
        });
        vapiInstance.on("message", (message) => {
            if (message.type === "transcript") {
                if (
                    message.type === "transcript" &&
                    message.transcriptType == "final"
                ) {
                    setTranscript((prev) => [
                        ...prev,
                        {
                            role: message.role,
                            text: message.transcript,
                        },
                    ]);
                }
            }
        });
        vapiInstance.on("error", (error) => {
            console.error("Vapi error:", error);
        });
        return () => {
            vapiInstance?.stop();
        };
    }, [apiKey]);

    const startCall = () => {
        if (vapi) {
            vapi.start(assistantId);
        }
    };
    const endCall = () => {
        if (vapi) {
            vapi.stop();
            setTranscript([]);
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="">
                <div className="bg-yellow-100 border-l-4 flex gap-2 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                    <TriangleAlert className="" size={26} />
                    <p>
                        <strong>Note:</strong> This AI career guidance assistant
                        provides general advice on career goals and next steps.
                        Responses are based on your inputs and may not account
                        for every individual circumstance. For personalised
                        mentorship or urgent career decisions, please reach out
                        through our official contact channels below.
                    </p>
                </div>

                <GuidanceCall
                    apiKey={apiKey}
                    assistantId={assistantId}
                />
            </div>
        </div>
    );
};

export default CallContent;
