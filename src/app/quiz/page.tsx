"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { questions } from "@/data/quizQuestions"
import Question from "@/app/quiz/_components/question"
import ProgressBar from "@/app/quiz/_components/progressBar"
import { StemType, Score } from "@/types/quiz"
import { careers } from "@/data/careers"

const STAGES = [...new Set(questions.map((q) => q.stage))]

function getStageNumber(stageName: string) {
    return STAGES.indexOf(stageName) + 1
}

function pickCareer(answers: Record<number, StemType>) {
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
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<number, StemType>>({})

    const total = questions.length
    const currentQuestion = questions[current]
    const currentStageIndex = STAGES.indexOf(currentQuestion.stage)
    const isLastQuestion = current === total - 1
    const allAnswered = Object.keys(answers).length === total

    const showFunFact = answers[current] !== undefined

    function handleAnswer(type: StemType) {
        setAnswers((prev) => ({ ...prev, [current]: type }))
    }

    function next() {
        if (current < total - 1) setCurrent(current + 1)
    }

    function back() {
        if (current > 0) setCurrent(current - 1)
    }

    function finish() {
        const { career, score } = pickCareer(answers)
        const params = new URLSearchParams({
            career: career.id,
            S: String(score.S),
            T: String(score.T),
            E: String(score.E),
            M: String(score.M),
        })
        router.push(`/quiz/result?${params.toString()}`)
    }

    return (
        <>
        <Link href="/" className="absolute top-6 left-6">
            <Image
                src="/logo.png"
                alt="SheShips logo"
                width={48}
                height={48}
                className="object-contain"
            />
        </Link>

        <div className="max-w-3xl mx-auto px-6 py-8 mt-10 md:px-10 md:py-10 overflow-x-hidden">
            <ProgressBar
                current={current + 1}
                total={total}
                stageName={currentQuestion.stage}
                stageNumber={getStageNumber(currentQuestion.stage)}
            />

            <div className="mt-4">
                <Question
                    data={currentQuestion}
                    selectedAnswer={answers[current]}
                    onAnswer={handleAnswer}
                />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
                <button
                    onClick={back}
                    disabled={current === 0}
                    className="flex items-center gap-1 text-strong-purple font-semibold hover:text-girly-purple transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                >
                    <span className="text-lg">&larr;</span> Back
                </button>

                {/* Stage dot indicators */}
                <div className="flex gap-2">
                    {STAGES.map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-2.5 h-2.5 rounded-full transition-all duration-300
                                ${i === currentStageIndex
                                    ? "bg-strong-purple scale-110"
                                    : i < currentStageIndex
                                        ? "bg-girly-purple"
                                        : "bg-gray-300"
                                }
                            `}
                        />
                    ))}
                </div>

                {isLastQuestion && allAnswered ? (
                    <button
                        onClick={finish}
                        className="flex items-center gap-1 px-6 py-2.5 rounded-full
                            bg-linear-to-r from-hot-pink to-cute-orange
                            text-white font-semibold text-sm
                            hover:from-cute-orange hover:to-hot-pink
                            transition-all duration-500 ease-in-out shadow-md
                            cursor-pointer"
                    >
                        See Results <span className="text-base">&#10024;</span>
                    </button>
                ) : (
                    <button
                        onClick={next}
                        disabled={answers[current] === undefined}
                        className="flex items-center gap-1 px-6 py-2.5 rounded-full
                            bg-linear-to-r from-strong-purple to-girly-purple
                            text-white font-semibold text-sm
                            hover:from-girly-purple hover:to-hot-pink
                            transition-all duration-500 ease-in-out shadow-md
                            disabled:opacity-40 disabled:pointer-events-none
                            cursor-pointer"
                    >
                        Next <span className="text-base">&rarr;</span>
                    </button>
                )}
            </div>

            {/* Fun fact banner */}
            <div
                className={`
                    mt-8 rounded-2xl bg-girly-purple/10 px-8 py-5
                    text-center text-strong-purple/80 text-sm md:text-base
                    italic leading-relaxed
                    transition-all duration-500 ease-in-out
                    ${showFunFact
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }
                `}
            >
                &ldquo;{currentQuestion.funFact}&rdquo;
            </div>
        </div>
        </>
    )
}
