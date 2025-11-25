import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Play, Sparkles, FileText, Smartphone, AlertTriangle, ShieldCheck, CheckCircle, RotateCcw, ArrowRight, ScanLine, Zap, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface ExplainerVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SCENE_DURATION = 5000;
const TOTAL_SCENES = 3;

const SCRIPTS = [
    "Lost receipts? Expired warranties? Stop letting chaos rule your life.",
    "Welcome to Pro-Techt. One secure hub to organize and track everything you own.",
    "Automated protection. Instant service. Experience true peace of mind."
];

const ExplainerVideoModal = ({ isOpen, onClose }: ExplainerVideoModalProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [scene, setScene] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const navigate = useNavigate();

    // Voice State
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const synth = useRef(window.speechSynthesis);

    // Load Voices - prioritize lively/energetic voices
    useEffect(() => {
        const loadVoices = () => {
            const voices = synth.current.getVoices();

            // Prioritize younger, more energetic voices
            const livelyVoice = voices.find(v =>
                // Google voices tend to be more natural and lively
                v.name.includes("Google UK English Male") ||
                v.name.includes("Google US English") ||
                v.name.includes("Samantha") || // macOS voice
                v.name.includes("Alex") || // macOS voice  
                v.name.includes("Daniel") || // macOS voice
                v.name.includes("Microsoft Zira") || // Windows female but energetic
                v.name.includes("Microsoft Mark") // Windows male
            ) || voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB")) || voices[0];

            setVoice(livelyVoice);
        };

        loadVoices();
        if (synth.current.onvoiceschanged !== undefined) {
            synth.current.onvoiceschanged = loadVoices;
        }
    }, []);

    // Speak Function with lively settings
    const speak = (text: string) => {
        if (isMuted || !voice) return;

        // Cancel previous
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 1.25; // Faster for more energy and excitement
        utterance.pitch = 1.15; // Slightly higher pitch for liveliness
        utterance.volume = 1;

        synth.current.speak(utterance);
    };

    // Stop speech on close
    useEffect(() => {
        if (!isOpen) {
            synth.current.cancel();
            setIsPlaying(false);
        }
    }, [isOpen]);

    // Animation Loop & Speech Trigger
    useEffect(() => {
        let interval: NodeJS.Timeout;
        let progressInterval: NodeJS.Timeout;

        if (isPlaying) {
            // Speak current scene script
            speak(SCRIPTS[scene]);

            if (progress >= 100 && scene === TOTAL_SCENES - 1) {
                setScene(0);
                setProgress(0);
            }

            interval = setInterval(() => {
                setScene((prev) => {
                    if (prev < TOTAL_SCENES - 1) {
                        return prev + 1;
                    }
                    setIsPlaying(false);
                    return prev;
                });
            }, SCENE_DURATION);

            const updateRate = 20;
            const increment = 100 / ((SCENE_DURATION * TOTAL_SCENES) / updateRate);

            progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + increment, 100));
            }, updateRate);
        } else {
            synth.current.cancel(); // Stop speaking if paused/stopped
        }

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [isPlaying, scene]); // Re-run when scene changes to trigger new speech

    const handlePlay = () => {
        setIsPlaying(true);
        setScene(0);
        setProgress(0);
    };

    const handleReplay = () => {
        setIsPlaying(true);
        setScene(0);
        setProgress(0);
    };

    const handleGetStarted = () => {
        onClose();
        navigate('/auth');
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            synth.current.cancel();
        } else if (isPlaying) {
            speak(SCRIPTS[scene]); // Resume speech if unmuted
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black border-emerald-500/20 sm:rounded-3xl shadow-[0_0_100px_rgba(0,204,102,0.2)]">
                <div className="relative aspect-video w-full group overflow-hidden bg-black">

                    {/* --- DYNAMIC BACKGROUNDS --- */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

                    <motion.div
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px] opacity-50"
                    />

                    <motion.div
                        animate={{
                            opacity: isPlaying ? 0.6 : 0.2,
                            background: scene === 0 ? "radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.15), transparent 50%)" :
                                scene === 1 ? "radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.15), transparent 50%)" :
                                    "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 50%)"
                        }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    />

                    <Particles isPlaying={isPlaying} scene={scene} />

                    {/* --- MAIN CONTENT --- */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12">
                        <AnimatePresence mode="wait">

                            {/* START SCREEN */}
                            {!isPlaying && progress === 0 && (
                                <motion.div
                                    key="start"
                                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                    className="text-center relative z-30"
                                >
                                    <div onClick={handlePlay} className="relative group/play cursor-pointer mb-10 inline-block">
                                        <div className="absolute inset-0 bg-emerald-500/40 rounded-full blur-2xl group-hover/play:blur-3xl transition-all duration-500 animate-pulse-glow" />
                                        <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-20" />
                                        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-300 border border-white/30 backdrop-blur-md">
                                            <Play className="w-12 h-12 text-white fill-white ml-2" />
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-2xl">
                                        Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pro-Techt</span>
                                    </h3>
                                    <p className="text-emerald-400/90 font-medium text-lg flex items-center justify-center gap-2 bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-500/30 backdrop-blur-sm mx-auto w-fit">
                                        <Sparkles className="w-5 h-5" /> Watch the 15s Demo
                                    </p>
                                </motion.div>
                            )}

                            {/* END SCREEN */}
                            {!isPlaying && progress >= 99 && (
                                <motion.div
                                    key="end"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center relative z-30"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                    >
                                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="text-5xl font-bold text-white mb-8">Ready to Pro-Techt?</h3>
                                    <div className="flex gap-6 justify-center">
                                        <Button onClick={handleReplay} variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white px-8 py-6 text-lg">
                                            <RotateCcw className="w-5 h-5 mr-2" /> Replay
                                        </Button>
                                        <Button onClick={handleGetStarted} className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-6 text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all">
                                            Get Started <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* SCENES */}
                            {isPlaying && scene === 0 && <ChaosScene key="scene1" />}
                            {isPlaying && scene === 1 && <OrderScene key="scene2" />}
                            {isPlaying && scene === 2 && <ShieldScene key="scene3" />}

                        </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/5 z-30">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_100%] animate-gradient shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className="absolute top-6 left-6 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all backdrop-blur-md border border-white/10 hover:border-white/30 z-50"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all backdrop-blur-md border border-white/10 hover:border-white/30 z-50 group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// --- SUB-COMPONENTS ---

const Particles = ({ isPlaying, scene }: { isPlaying: boolean, scene: number }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${scene === 0 ? 'bg-red-500/20' : scene === 1 ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                        }`}
                    initial={{
                        x: Math.random() * 1000,
                        y: Math.random() * 600,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: 0.3
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        x: [null, Math.random() * 100 - 50],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 10 + 5,
                        height: Math.random() * 10 + 5,
                    }}
                />
            ))}
        </div>
    );
};

const ChaosScene = () => (
    <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
        className="relative w-full h-full flex flex-col items-center justify-center"
    >
        <div className="relative w-full max-w-lg h-80 mb-8">
            {/* Chaotic Elements */}
            {[FileText, Smartphone, AlertTriangle, FileText, Smartphone, AlertTriangle, FileText].map((Icon, i) => (
                <motion.div
                    key={i}
                    className="absolute text-red-500/80 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    initial={{
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 300 - 150,
                        rotate: Math.random() * 360,
                        scale: 0
                    }}
                    animate={{
                        x: [null, Math.random() * 600 - 300],
                        y: [null, Math.random() * 400 - 200],
                        rotate: [null, Math.random() * 720],
                        scale: [0, 1.5, 1]
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                >
                    <Icon className="w-16 h-16" />
                </motion.div>
            ))}

            {/* Glitch Effect Overlay */}
            <motion.div
                className="absolute inset-0 bg-red-500/5 mix-blend-overlay"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
            />
        </div>

        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center z-10"
        >
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 drop-shadow-sm mb-4">
                CHAOS.
            </h2>
            <p className="text-2xl text-red-200/80 font-light">Lost Receipts? Expired Warranties?</p>
        </motion.div>
    </motion.div>
);

const OrderScene = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative w-full h-full flex flex-col items-center justify-center"
    >
        {/* Scanning Grid */}
        <div className="relative w-[600px] h-[400px] mb-8 grid grid-cols-3 gap-6 p-8 border border-blue-500/30 rounded-3xl bg-blue-900/20 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">

            {/* Scanner Beam */}
            <motion.div
                className="absolute top-0 bottom-0 w-2 bg-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,1)] z-20"
                initial={{ left: "-10%" }}
                animate={{ left: "120%" }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
            />

            {/* Organized Icons */}
            {[FileText, Smartphone, ShieldCheck, FileText, Smartphone, ShieldCheck].map((Icon, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.5, type: "spring" }}
                    className="flex flex-col items-center justify-center bg-blue-500/10 rounded-xl border border-blue-500/30 p-4 group hover:bg-blue-500/20 transition-colors"
                >
                    <Icon className="w-10 h-10 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="w-12 h-2 bg-blue-500/30 rounded-full" />
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center z-10"
        >
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700 drop-shadow-sm mb-4">
                CLARITY.
            </h2>
            <p className="text-2xl text-blue-200/80 font-light">One Hub. Everything Organized.</p>
        </motion.div>
    </motion.div>
);

const ShieldScene = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-full h-full flex flex-col items-center justify-center"
    >
        <div className="relative w-80 h-80 mb-10 flex items-center justify-center">
            {/* Pulse Waves */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                />
            ))}

            {/* Core Shield */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="relative z-10"
            >
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse-glow" />
                <ShieldCheck className="w-48 h-48 text-emerald-400 drop-shadow-[0_0_50px_rgba(52,211,153,0.8)]" />

                {/* Floating 'AI' Badge */}
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-emerald-500 text-black font-bold px-3 py-1 rounded-full shadow-lg border border-white/20"
                >
                    AI
                </motion.div>
            </motion.div>

            {/* Orbiting Satellites */}
            {[0, 120, 240].map((deg, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full"
                    initial={{ rotate: deg }}
                    animate={{ rotate: deg + 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-12 h-12 bg-black/50 backdrop-blur-md border border-emerald-500/50 rounded-xl absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                        {i === 0 ? <Zap className="w-6 h-6 text-yellow-400" /> :
                            i === 1 ? <ScanLine className="w-6 h-6 text-blue-400" /> :
                                <CheckCircle className="w-6 h-6 text-emerald-400" />}
                    </div>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center z-10"
        >
            <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700 drop-shadow-sm mb-4">
                PROTECTED.
            </h2>
            <p className="text-2xl text-emerald-200/80 font-light">Smart Tracking. Instant Service.</p>
        </motion.div>
    </motion.div>
);

export default ExplainerVideoModal;
