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

                <div className="flex justify-center gap-[2%]">
                    {/* Call Interface */}
                    <div className="w-full self-baseline bg-light-bg dark:bg-dark-bg rounded-base flex justify-center shadow-lg p-6 mb-8">
                        {!isConnected ? (
                            <button
                                className="flex gap-2 items-center bg-light-primary dark:bg-dark-primary text-white border-none rounded-full px-5 py-4 text-base font-bold cursor-pointer transition-all duration-300 ease-in-out"
                                onClick={startCall}>
                                <PhoneOutgoing /> <p>Talk to Assistant</p>
                            </button>
                        ) : (
                            <div className="bg-white rounded-xl p-5 w-[800px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#e1e5e9]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`${isSpeaking
                                                    ? "bg-[#ff4444] animate-pulse"
                                                    : "bg-[#12A594]"
                                                } w-3 h-3 rounded-full`}></div>
                                        <span className="font-bold text-[#333]">
                                            {isSpeaking
                                                ? "Assistant Speaking..."
                                                : "Listening..."}
                                        </span>
                                    </div>
                                    <button
                                        onClick={endCall}
                                        className="bg-[#ff4444] flex gap-2 items-center text-white border-none rounded-md px-3 py-1.5 text-xs cursor-pointer">
                                        <PhoneMissed />
                                        <p>End Call</p>
                                    </button>
                                </div>

                                <div
                                    ref={scrollRef}
                                    className="max-h-[200px] overflow-y-auto mb-3 p-2 bg-[#f8f9fa] rounded-lg">
                                    {transcript.length === 0 ? (
                                        <p className="text-[#666] text-sm m-0">
                                            Conversation will appear here...
                                        </p>
                                    ) : (
                                        transcript.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`mb-2 ${msg.role === "user"
                                                        ? "text-right"
                                                        : "text-left"
                                                    }`}>
                                                <span
                                                    className={`${msg.role === "user"
                                                            ? "bg-[#12A594]"
                                                            : "bg-[#333]"
                                                        } text-white px-3 py-2 rounded-xl inline-block text-sm max-w-[80%]`}>
                                                    {msg.text}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallContent;
