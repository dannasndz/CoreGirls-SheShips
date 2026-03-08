"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { questions } from "@/data/quizQuestions"
import Question from "@/app/quiz/_components/question"
import ProgressBar from "@/app/quiz/_components/progressBar"
import { StemType } from "@/types/quiz"
import Grainient from '@/components/Grainient';

const STAGES = [...new Set(questions.map((q) => q.stage))]

function getStageNumber(stageName: string) {
    return STAGES.indexOf(stageName) + 1
}

export default function QuizPage() {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<number, StemType>>({})
    const [progress, setProgress] = useState(0)

    const total = questions.length
    const currentQuestion = questions[current]
    const currentStageIndex = STAGES.indexOf(currentQuestion.stage)

    const showFunFact = answers[current] !== undefined

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

    return (
        <div className="relative min-h-screen sm:h-screen sm:overflow-hidden">
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
            <div className="relative z-10 sm:h-full flex flex-col max-w-3xl mx-auto px-4 pt-14 pb-4 sm:px-6 sm:pt-16 sm:pb-3 md:px-10">
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
                        <span>&larr;</span> Back
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
                        Next <span>&rarr;</span>
                    </button>
                </div>

                {/* Fun fact banner */}
                <div
                    className={`
                        rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3
                        text-center text-white/80 text-[11px] sm:text-xs md:text-sm
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
        </div>
    )
}
