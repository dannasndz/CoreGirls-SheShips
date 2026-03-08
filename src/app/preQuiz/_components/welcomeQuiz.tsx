"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import SplashScreen from "@/components/SplashCursor"
import SplitText from "@/components/SplitText";
import { Clock, ClipboardList, Sparkles } from "lucide-react"


const stemPaths = [
    {
        letter: "S",
        title: "Science",
        description: "Explore the mysteries of nature and life",
        icon: "🔬",
        color: "from-purple-500 to-violet-600",
    },
    {
        letter: "T",
        title: "Technology",
        description: "Build the digital tools of tomorrow",
        icon: "💻",
        color: "from-pink-500 to-hot-pink",
    },
    {
        letter: "E",
        title: "Engineering",
        description: "Design and create real-world solutions",
        icon: "⚙️",
        color: "from-orange-400 to-cute-orange",
    },
    {
        letter: "M",
        title: "Mathematics",
        description: "Unlock patterns that shape our world",
        icon: "📐",
        color: "from-fuchsia-500 to-purple-600",
    },
]

export default function WelcomeQuiz() {
    const router = useRouter()

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left — Purple welcome panel */}
            <div className="md:w-1/2 bg-linear-to-br from-strong-purple via-girly-purple to-strong-purple flex items-center justify-center px-8 py-16 md:py-0 relative">
                <Link href="/" className="absolute top-6 left-6">
                    <Image
                        src="/logoBlanco.png"
                        alt="SheShips logo"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </Link>

                <div className="max-w-md space-y-8 text-center md:text-left">
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
                                onLetterAnimationComplete={() => {}}
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
                                    onLetterAnimationComplete={() => {}}
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
                                    onLetterAnimationComplete={() => {}}
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
                                    onLetterAnimationComplete={() => {}}
                                />
                            </span>
                        </div>

                    <button
                        onClick={() => router.push("/quiz")}
                        className="px-10 py-3.5 rounded-full text-lg font-bold text-white
                            bg-linear-to-r from-cute-orange to-orange-400
                            hover:from-hot-pink hover:to-cute-orange
                            transition-all duration-500 ease-in-out
                            shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Let&apos;s go! &rarr;
                    </button>
                </div>
            </div>

            {/* Right — STEM paths preview */}
            <div className="md:w-1/2 bg-cream flex items-center justify-center px-8 py-16 md:py-0 relative overflow-hidden">
                <SplashScreen scoped />
                <div className="max-w-sm w-full space-y-6 relative z-10">
                    <div className="text-center md:text-left space-y-1">
                        <h2 className="text-2xl font-bold text-strong-purple font-heading">
                            What will you discover?
                        </h2>
                        <p className="text-dark-purple/50 text-sm">
                            One of these four paths awaits you
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {stemPaths.map((path) => (
                            <div
                                key={path.letter}
                                className="group rounded-2xl bg-white p-5 ring-1 ring-gray-100
                                    hover:ring-girly-purple/30 hover:shadow-lg
                                    transition-all duration-300 cursor-default"
                            >
                                <div className={`
                                    w-10 h-10 rounded-xl bg-linear-to-br ${path.color}
                                    flex items-center justify-center text-xl mb-3
                                `}>
                                    {path.icon}
                                </div>
                                <p className="font-bold text-strong-purple text-sm">
                                    {path.title}
                                </p>
                                <p className="text-dark-purple/50 text-xs mt-1 leading-snug">
                                    {path.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl bg-girly-purple/8 p-5 text-center">
                        <p className="text-dark-purple/60 text-sm italic leading-relaxed">
                            &ldquo;Every great scientist, engineer, and innovator
                            started exactly where you are now — curious.&rdquo;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
