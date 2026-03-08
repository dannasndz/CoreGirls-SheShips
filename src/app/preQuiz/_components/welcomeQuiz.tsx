"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import SplashScreen from "@/components/SplashCursor"
import SplitText from "@/components/SplitText";
import LiquidChrome from '@/components/LiquidChrome';
import { Clock, ClipboardList, Sparkles } from "lucide-react"


const stemPaths = [
    {
        letter: "S",
        title: "Science",
        description: "Explore the mysteries of nature and life",
        gradient: "from-girly-purple to-strong-purple",
        textColor: "text-girly-purple",
        bgAccent: "bg-girly-purple",
    },
    {
        letter: "T",
        title: "Technology",
        description: "Build the digital tools of tomorrow",
        gradient: "from-hot-pink to-girly-purple",
        textColor: "text-hot-pink",
        bgAccent: "bg-hot-pink",
    },
    {
        letter: "E",
        title: "Engineering",
        description: "Design and create real-world solutions",
        gradient: "from-cute-orange to-hot-pink",
        textColor: "text-cute-orange",
        bgAccent: "bg-cute-orange",
    },
    {
        letter: "M",
        title: "Mathematics",
        description: "Unlock patterns that shape our world",
        gradient: "from-strong-purple to-hot-pink",
        textColor: "text-strong-purple",
        bgAccent: "bg-strong-purple",
    },
]

const loaderLetters = [
    { letter: "S", label: "Science", gradient: "from-girly-purple to-strong-purple" },
    { letter: "T", label: "Technology", gradient: "from-hot-pink to-girly-purple" },
    { letter: "E", label: "Engineering", gradient: "from-cute-orange to-hot-pink" },
    { letter: "M", label: "Mathematics", gradient: "from-strong-purple to-hot-pink" },
]

export default function WelcomeQuiz() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function handleStart() {
        setLoading(true)
        setTimeout(() => router.push("/quiz"), 2800)
    }

    if (loading) {
        return (
            <div className="fixed inset-0 z-200 bg-strong-purple flex flex-col items-center justify-center gap-10">
                <div className="flex gap-4 sm:gap-6">
                    {loaderLetters.map((item, i) => (
                        <div
                            key={item.letter}
                            className="flex flex-col items-center gap-3 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
                        >
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br ${item.gradient}
                                flex items-center justify-center shadow-lg`}
                            >
                                <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                                    {item.letter}
                                </span>
                            </div>
                            <span className="text-white/60 text-xs font-semibold">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-center space-y-3">
                    <p className="text-white/90 text-lg font-heading font-bold">
                        Preparing your quiz...
                    </p>
                    <div className="w-48 h-1.5 bg-white/15 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-linear-to-r from-cute-orange via-hot-pink to-girly-purple rounded-full animate-loader-bar" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left — Purple welcome panel */}
            <div className="md:w-1/2 flex items-center justify-center px-8 py-16 md:py-0 relative overflow-hidden">
                <div className="absolute inset-0">
                    <LiquidChrome
                        baseColor={[0.4, 0.2, 0.7]}
                        speed={0.2}
                        amplitude={0.2}
                        interactive={false}
                    />
                </div>
                <div className="absolute inset-0 bg-strong-purple/40" />

                <Link href="/" className="absolute top-6 left-6 z-20">
                    <Image
                        src="/logoBlanco.png"
                        alt="SheShips logo"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </Link>

                <div className="max-w-md space-y-8 text-center md:text-left relative z-10">
                    <div className="space-y-4">
                        <p className="text-light-pink/80 font-semibold tracking-wide uppercase text-sm">
                            STEM Discovery Quiz
                        </p>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white font-heading leading-tight">
                            <SplitText
                                text="Welcome!"
                                className="text-6xl md:text-7xl font-extrabold text-white font-heading leading-tight"
                                delay={40}
                                duration={1}
                                ease="power3.out"
                                splitType="chars"
                                onLetterAnimationComplete={() => { }}
                            />
                        </h1>
                        <p className="text-lg text-white/80 leading-relaxed">
                            You&apos;re about to discover which STEM path fits
                            you best. Answer a few fun questions and find out
                            where your superpower lies!
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5">
                            <Clock size={14} />
                            <SplitText
                                text="5 min"
                                className="text-sm text-white/60"
                                delay={40}
                                duration={1}
                                ease="power3.out"
                                splitType="chars"
                                tag="span"
                                onLetterAnimationComplete={() => { }}
                            />
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5">
                            <ClipboardList size={14} />
                            <SplitText
                                text="15 questions"
                                className="text-sm text-white/60"
                                delay={40}
                                duration={1}
                                ease="power3.out"
                                splitType="chars"
                                tag="span"
                                onLetterAnimationComplete={() => { }}
                            />
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/10 rounded-full px-4 py-1.5">
                            <Sparkles size={14} />
                            <SplitText
                                text="No wrong answers"
                                className="text-sm text-white/60"
                                delay={40}
                                duration={1}
                                ease="power3.out"
                                splitType="chars"
                                tag="span"
                                onLetterAnimationComplete={() => { }}
                            />
                        </span>
                    </div>

                    <button
                        onClick={handleStart}
                        className="px-10 py-3.5 rounded-full text-lg font-bold text-white
                            bg-linear-to-r from-hot-pink to-cute-orange
                            hover:from-cute-orange hover:to-hot-pink
                            transition-all duration-500 ease-in-out
                            shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Let&apos;s go! &rarr;
                    </button>
                </div>
            </div>

            {/* Right — STEM paths preview */}
            <div className="md:w-1/2 bg-cream flex items-center justify-center px-8 py-16 md:py-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-girly-purple/5 -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cute-orange/5 translate-y-1/3 -translate-x-1/3" />

                <div className="max-w-md w-full relative z-10">
                    <p className="text-dark-purple/40 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                        Your path awaits
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-strong-purple font-heading leading-tight mb-10">
                        What will you<br />discover?
                    </h2>

                    <div className="space-y-5">
                        {stemPaths.map((path, i) => (
                            <div
                                key={path.letter}
                                className="group flex items-center gap-5 cursor-default"
                            >
                                <div className={`
                                    shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${path.gradient}
                                    flex items-center justify-center
                                    shadow-md group-hover:shadow-lg group-hover:scale-105
                                    transition-all duration-300
                                `}>
                                    <span className="text-2xl font-extrabold text-white font-heading">
                                        {path.letter}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-base ${path.textColor} font-heading`}>
                                        {path.title}
                                    </p>
                                    <p className="text-dark-purple/45 text-sm leading-snug">
                                        {path.description}
                                    </p>
                                </div>

                                {i < stemPaths.length - 1 && (
                                    <div className="absolute left-7 mt-18 w-px h-5 bg-light-pink/60" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 border-l-2 border-light-pink pl-5">
                        <p className="text-dark-purple/50 text-sm italic leading-relaxed">
                            &ldquo;Every great scientist, engineer, and innovator
                            started exactly where you are now — curious.&rdquo;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
