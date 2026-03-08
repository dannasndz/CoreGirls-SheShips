"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { careers as careersEn, categoryLabels as categoryLabelsEn, categoryColors } from "@/data/careers"
import { careersEs, categoryLabelsEs } from "@/data/careers.es"
import { StemType } from "@/types/quiz"
import { useI18n } from "@/lib/i18n"

const getCareerImage = (id: string) => {
    if (id === "database-administrator") return "/careers/database-administrato.png"
    return `/careers/${id}.png`
}

const careersMap = { en: careersEn, es: careersEs } as const;
const categoryLabelsMap = { en: categoryLabelsEn, es: categoryLabelsEs } as const;

function QuizResultContent() {
    const { t, locale } = useI18n()
    const careers = careersMap[locale]
    const categoryLabels = categoryLabelsMap[locale]
    const searchParams = useSearchParams()
    const careerId = searchParams.get("career")
    const scores = {
        S: Number(searchParams.get("S") || 0),
        T: Number(searchParams.get("T") || 0),
        E: Number(searchParams.get("E") || 0),
        M: Number(searchParams.get("M") || 0),
    }

    const career = careers.find((c) => c.id === careerId)

    if (!career) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <h1
                        className="text-3xl font-extrabold text-dark-purple mb-4"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizResult.noResult")}
                    </h1>
                    <Link
                        href="/quiz"
                        className="text-girly-purple font-semibold underline"
                    >
                        {t("quizResult.takeAgain")}
                    </Link>
                </div>
            </div>
        )
    }

    const totalAnswers = scores.S + scores.T + scores.E + scores.M
    const topType = career.category
    const topScore = scores[topType]
    const percentage = totalAnswers > 0 ? Math.round((topScore / totalAnswers) * 100) : 0

    const sortedScores = (Object.entries(scores) as [StemType, number][])
        .sort((a, b) => b[1] - a[1])

    const otherCareers = careers
        .filter((c) => c.category === topType && c.id !== career.id && c.growth)
        .slice(0, 3)

    const categoryDesc = t(`quizResult.categoryDescriptions.${topType}`)

    return (
        <div className="min-h-screen bg-cream">
            <Link href="/" className="absolute top-6 left-6 z-10">
                <Image
                    src="/logo.png"
                    alt="SheShips logo"
                    width={48}
                    height={48}
                    className="object-contain"
                />
            </Link>

            <div className="max-w-3xl mx-auto px-6 py-12 mt-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <p
                        className="text-lg text-girly-purple font-semibold mb-2"
                        style={{ fontFamily: "var(--font-baloo)" }}
                    >
                        {t("quizResult.resultsIn")}
                    </p>
                    <h1
                        className="text-4xl md:text-5xl font-extrabold text-dark-purple"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizResult.youCouldBe")}
                    </h1>
                </div>

                {/* Career Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    {/* Career Image */}
                    <div className="relative h-52 md:h-64">
                        <Image
                            src={getCareerImage(career.id)}
                            alt={career.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-8 right-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`${categoryColors[topType]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                    {categoryLabels[topType]}
                                </span>
                                {career.growth && (
                                    <span className="bg-cute-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {t("quizResult.trendingCareer")}
                                    </span>
                                )}
                            </div>
                            <h2
                                className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                {career.name}
                            </h2>
                        </div>
                    </div>

                    {/* Career Details */}
                    <div className="p-8 flex flex-col gap-6">
                        <p
                            className="text-base text-dark-purple/80 leading-relaxed"
                            style={{ fontFamily: "var(--font-baloo)" }}
                        >
                            {career.description}
                        </p>

                        {/* Why this career */}
                        <div className="bg-girly-purple/5 rounded-2xl p-6">
                            <h3
                                className="text-xl font-extrabold text-dark-purple mb-3"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                {t("quizResult.whyMatches")}
                            </h3>
                            <p
                                className="text-dark-purple/70 leading-relaxed mb-4"
                                style={{ fontFamily: "var(--font-baloo)" }}
                            >
                                {categoryDesc}{" "}
                                {t("quizResult.basedOnAnswers", {
                                    percentage: String(percentage),
                                    category: categoryLabels[topType],
                                })}
                            </p>

                            {/* Score Breakdown */}
                            <div className="flex flex-col gap-2">
                                {sortedScores.map(([type, count]) => {
                                    const pct = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0
                                    return (
                                        <div key={type} className="flex items-center gap-3">
                                            <span
                                                className="text-sm font-bold text-dark-purple w-28"
                                                style={{ fontFamily: "var(--font-fredoka)" }}
                                            >
                                                {categoryLabels[type]}
                                            </span>
                                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${categoryColors[type]}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span
                                                className="text-sm font-semibold text-dark-purple/60 w-10 text-right"
                                                style={{ fontFamily: "var(--font-baloo)" }}
                                            >
                                                {pct}%
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* What to Study */}
                        <div>
                            <h3
                                className="text-xl font-extrabold text-dark-purple mb-3"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                {t("quizResult.whatToStudy")}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {career.studyPaths.map((path) => (
                                    <span
                                        key={path}
                                        className="bg-girly-purple/10 text-girly-purple text-sm font-semibold px-4 py-2 rounded-full"
                                        style={{ fontFamily: "var(--font-baloo)" }}
                                    >
                                        {path}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Leaders */}
                        <div>
                            <h3
                                className="text-xl font-extrabold text-dark-purple mb-3"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                {t("quizResult.leadersInField")}
                            </h3>
                            {career.leaders.map((leader) => (
                                <div
                                    key={leader.name}
                                    className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-cute-orange/20 flex items-center justify-center text-lg">
                                        👩‍🔬
                                    </div>
                                    <div>
                                        <p
                                            className="font-bold text-dark-purple text-sm"
                                            style={{ fontFamily: "var(--font-fredoka)" }}
                                        >
                                            {leader.name}
                                        </p>
                                        <p
                                            className="text-dark-purple/60 text-xs"
                                            style={{ fontFamily: "var(--font-baloo)" }}
                                        >
                                            {leader.country}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other careers in this field */}
                {otherCareers.length > 0 && (
                    <div className="mb-8">
                        <h3
                            className="text-2xl font-extrabold text-dark-purple mb-4 text-center"
                            style={{ fontFamily: "var(--font-fredoka)" }}
                        >
                            {t("quizResult.otherCareers", { category: categoryLabels[topType] })}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {otherCareers.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-md"
                                >
                                    <div className="relative h-28">
                                        <Image
                                            src={getCareerImage(c.id)}
                                            alt={c.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <p
                                            className="absolute bottom-3 left-4 text-white font-extrabold text-sm drop-shadow"
                                            style={{ fontFamily: "var(--font-fredoka)" }}
                                        >
                                            {c.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/explore-careers?category=${topType}`}
                        className="px-8 py-3 rounded-full bg-linear-to-r from-strong-purple to-girly-purple text-white font-semibold text-center hover:from-girly-purple hover:to-hot-pink transition-all duration-500 shadow-md"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizResult.exploreAll", { category: categoryLabels[topType] })}
                    </Link>
                    <Link
                        href="/explore-careers"
                        className="px-8 py-3 rounded-full border-2 border-girly-purple text-girly-purple font-semibold text-center hover:bg-girly-purple/10 transition-all duration-300"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizResult.browseAll")}
                    </Link>
                    <Link
                        href="/quiz"
                        className="px-8 py-3 rounded-full border-2 border-dark-purple/20 text-dark-purple/60 font-semibold text-center hover:bg-dark-purple/5 transition-all duration-300"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizResult.retakeQuiz")}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function QuizResultPage() {
    const { t } = useI18n()
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <p className="text-dark-purple text-lg">{t("quizResult.loadingResults")}</p>
            </div>
        }>
            <QuizResultContent />
        </Suspense>
    )
}
