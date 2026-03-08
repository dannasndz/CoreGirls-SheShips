"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { questions as questionsEn } from "@/data/quizQuestions"
import { questionsEs } from "@/data/quizQuestions.es"
import Question from "@/app/quiz/_components/question"
import ProgressBar from "@/app/quiz/_components/progressBar"
import QuizAuthModal from "@/app/quiz/_components/quizAuthModal"
import { StemType, Score } from "@/types/quiz"
import { careers as careersEn } from "@/data/careers"
import { careersEs } from "@/data/careers.es"
import Grainient from '@/components/Grainient';
import { useI18n } from "@/lib/i18n"

const questionsMap = { en: questionsEn, es: questionsEs } as const
const careersMap = { en: careersEn, es: careersEs } as const

function pickCareer(answers: Record<number, StemType>, careers: typeof careersEn) {
    const score: Score = { S: 0, T: 0, E: 0, M: 0 }
    for (const type of Object.values(answers)) {
        score[type]++
    }

    const topType = (Object.entries(score) as [StemType, number][])
        .sort((a, b) => b[1] - a[1])[0][0]

    const categoryCareers = careers.filter((c) => c.category === topType)
    const growthCareers = categoryCareers.filter((c) => c.growth)
    const pool = growthCareers.length > 0 ? growthCareers : categoryCareers

    // Deterministic pick based on total score hash
    const hash = Object.values(answers).reduce((acc, t) => acc + t.charCodeAt(0), 0)
    const picked = pool[hash % pool.length]

    return { career: picked, score, topType }
}

export default function QuizPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const { t, locale } = useI18n()
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<number, StemType>>({})
    const [progress, setProgress] = useState(0)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const pendingFinish = useRef(false)

    const questions = questionsMap[locale]
    const STAGES = [...new Set(questions.map((q) => q.stage))]

    function getStageNumber(stageName: string) {
        return STAGES.indexOf(stageName) + 1
    }

    const total = questions.length
    const currentQuestion = questions[current]
    const currentStageIndex = STAGES.indexOf(currentQuestion.stage)
    const isLastQuestion = current === total - 1
    const allAnswered = Object.keys(answers).length === total

    function handleAnswer(type: StemType) {
        setAnswers((prev) => ({ ...prev, [current]: type }))
    }

    function next() {
        if (current < total - 1) {
            const nextIndex = current + 1
            setCurrent(nextIndex)
            if (nextIndex > progress) setProgress(nextIndex)
        }
    }

    function back() {
        if (current > 0) {
            setCurrent(current - 1)
            setProgress(current - 1)
        }
    }

    const careers = careersMap[locale]

    function navigateToResults() {
        const { career, score } = pickCareer(answers, careers)

        // Save results to DB
        fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers, career: career.id }),
        }).catch(() => {})

        const params = new URLSearchParams({
            career: career.id,
            S: String(score.S),
            T: String(score.T),
            E: String(score.E),
            M: String(score.M),
        })
        router.push(`/quiz/result?${params.toString()}`)
    }

    function finish() {
        if (session) {
            navigateToResults()
        } else {
            pendingFinish.current = true
            setShowAuthModal(true)
        }
    }

    function handleAuthSuccess() {
        setShowAuthModal(false)
        if (pendingFinish.current) {
            pendingFinish.current = false
            navigateToResults()
        }
    }

    return (
        <div className="relative min-h-screen sm:h-screen sm:overflow-hidden">
            <QuizAuthModal
                open={showAuthModal}
                onClose={() => { setShowAuthModal(false); pendingFinish.current = false }}
                onSuccess={handleAuthSuccess}
            />

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <Grainient
                    color1="#6B21A8"
                    color2="#A855F7"
                    color3="#1A0A2E"
                    timeSpeed={0.25}
                    colorBalance={0}
                    warpStrength={1}
                    warpFrequency={5}
                    warpSpeed={2}
                    warpAmplitude={50}
                    blendAngle={0}
                    blendSoftness={0.05}
                    rotationAmount={500}
                    noiseScale={2}
                    grainAmount={0.1}
                    grainScale={2}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={1}
                    saturation={1}
                    centerX={0}
                    centerY={0}
                    zoom={0.9}
                />
            </div>

            {/* Logo */}
            <Link href="/" className="fixed top-3 left-3 z-50 sm:top-4 sm:left-4">
                <Image
                    src="/logoBlanco.png"
                    alt="SheShips logo"
                    width={40}
                    height={40}
                    className="object-contain sm:w-12 sm:h-12"
                />
            </Link>

            {/* Content */}
            <div className="relative z-10 sm:h-full flex items-center justify-center px-4 pt-14 pb-4 sm:px-6 sm:pt-16 sm:pb-3 md:px-10">
                <div className="w-full max-w-3xl flex flex-col sm:h-full
                    bg-white/10 backdrop-blur-xl border border-white/20
                    rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20
                    px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6"
                >
                    <ProgressBar
                        current={progress}
                        total={total}
                        stageName={currentQuestion.stage}
                        stageNumber={getStageNumber(currentQuestion.stage)}
                    />

                    <div className="mt-2 sm:flex-1 sm:min-h-0 sm:flex sm:flex-col">
                        <Question
                            data={currentQuestion}
                            selectedAnswer={answers[current]}
                            onAnswer={handleAnswer}
                        />
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between py-3 sm:py-2">
                        <button
                            onClick={back}
                            disabled={current === 0}
                            className="flex items-center gap-1 text-white/80 font-semibold text-sm sm:text-base hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                        >
                            <span>&larr;</span> {t("quiz.back")}
                        </button>

                        <div className="flex gap-1.5 sm:gap-2">
                            {STAGES.map((_, i) => (
                                <div
                                    key={i}
                                    className={`
                                        w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300
                                        ${i === currentStageIndex
                                            ? "bg-white scale-110"
                                            : i < currentStageIndex
                                                ? "bg-light-pink"
                                                : "bg-white/30"
                                        }
                                    `}
                                />
                            ))}
                        </div>

                        {isLastQuestion && allAnswered ? (
                            <button
                                onClick={finish}
                                className="flex items-center gap-1 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full
                                    bg-linear-to-r from-hot-pink to-cute-orange
                                    text-white font-semibold text-xs sm:text-sm
                                    hover:from-cute-orange hover:to-hot-pink
                                    transition-all duration-500 ease-in-out shadow-md
                                    cursor-pointer animate-pulse"
                            >
                                {t("quiz.seeResults")} <span>&#10024;</span>
                            </button>
                        ) : (
                            <button
                                onClick={next}
                                disabled={answers[current] === undefined}
                                className="flex items-center gap-1 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full
                                    bg-linear-to-r from-cute-orange to-hot-pink
                                    text-white font-semibold text-xs sm:text-sm
                                    hover:from-hot-pink hover:to-cute-orange
                                    transition-all duration-500 ease-in-out shadow-md
                                    disabled:opacity-40 disabled:pointer-events-none
                                    cursor-pointer"
                            >
                                {t("quiz.next")} <span>&rarr;</span>
                            </button>
                        )}
                    </div>

                    {/* Fun fact banner */}
                    <div
                        key={current}
                        className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3
                            text-center text-white/80 text-[11px] sm:text-xs md:text-sm
                            italic leading-relaxed animate-funfact-in"
                    >
                        &ldquo;{currentQuestion.funFact}&rdquo;
                    </div>
                </div>
            </div>
        </div>
    )
}
