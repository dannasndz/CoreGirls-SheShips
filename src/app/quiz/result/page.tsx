"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { careers as careersEn, categoryLabels as categoryLabelsEn, categoryColors } from "@/data/careers"
import { careersEs, categoryLabelsEs } from "@/data/careers.es"
import { StemType } from "@/types/quiz"
import { useI18n } from "@/lib/i18n"
import { Sparkles, BookOpen, Users, ArrowRight, RotateCcw, LinkIcon } from "lucide-react"

const categoryGradients: Record<StemType, string> = {
    S: "from-girly-purple to-strong-purple",
    T: "from-hot-pink to-girly-purple",
    E: "from-cute-orange to-hot-pink",
    M: "from-strong-purple to-hot-pink",
}

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
                    <h1 className="text-3xl font-extrabold text-dark-purple mb-4 font-heading">
                        {t("quizResult.noResult")}
                    </h1>
                    <Link href="/quiz" className="text-girly-purple font-semibold underline">
                        {t("quizResult.takeAgain")}
                    </Link>
                </div>
            </div>
        )
    }

    const totalAnswers = scores.S + scores.T + scores.E + scores.M
    const topType = career.category
    const percentage = totalAnswers > 0 ? Math.round((scores[topType] / totalAnswers) * 100) : 0

    const sortedScores = (Object.entries(scores) as [StemType, number][])
        .sort((a, b) => b[1] - a[1])

    const otherCareers = careers
        .filter((c) => c.category === topType && c.id !== career.id && c.growth)
        .slice(0, 3)

    const categoryDesc = t(`quizResult.categoryDescriptions.${topType}`)

    return (
        <div className="min-h-[calc(100vh-56px)] bg-cream">
            {/* ==================== TOP ROW: Split layout ==================== */}
            <div className="flex flex-col md:flex-row">

                {/* LEFT PANEL — Gradient with results text */}
                <div className="relative md:w-[42%] md:min-h-[calc(100vh-56px)] md:sticky md:top-14
                    bg-linear-to-br from-strong-purple via-hot-pink to-cute-orange
                    flex flex-col justify-center px-8 py-16 md:py-0 md:px-12 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('/background-pattern.png')] bg-cover bg-center opacity-10" />

                    <div className="relative z-10 max-w-md mx-auto md:mx-0 space-y-6 animate-funfact-in">
                        <div className="space-y-2">
                            <p className="text-white/70 text-lg">{t("quizResult.youCouldBe")}</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading leading-tight">
                                {career.name}
                            </h1>
                        </div>

                        <p className="text-white/80 text-sm leading-relaxed">
                            {categoryDesc}
                        </p>

                        <Link
                            href="/quiz"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                                bg-white/15 border border-white/30 text-white font-bold text-sm
                                hover:bg-white/25 hover:border-white/50
                                backdrop-blur-sm transition-all duration-300"
                        >
                            <RotateCcw size={14} /> {t("quizResult.retakeQuiz")}
                        </Link>
                    </div>
                </div>

                {/* RIGHT PANEL — Career info */}
                <div className="md:w-[58%] bg-cream animate-funfact-in"
                    style={{ animationDelay: "0.15s" }}
                >
                    {/* Career hero image */}
                    <div className="relative h-56 md:h-72">
                        <Image
                            src={getCareerImage(career.id)}
                            alt={career.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-cream via-cream/20 to-transparent" />
                        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-3">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`bg-linear-to-r ${categoryGradients[topType]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                                    {categoryLabels[topType]}
                                </span>
                                {career.growth && (
                                    <span className="bg-linear-to-r from-cute-orange to-orange-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                        {t("quizResult.trending")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info sections */}
                    <div className="px-6 md:px-8 pb-10 flex flex-col gap-6">
                        <p className="text-sm text-dark-purple/75 leading-relaxed">
                            {career.description}
                        </p>

                        {/* STEM Profile */}
                        <div className={`bg-linear-to-br ${categoryGradients[topType]} rounded-2xl p-5`}>
                            <h3 className="text-sm font-extrabold text-white mb-1 font-heading">
                                {t("quizResult.stemProfile")}
                            </h3>
                            <p className="text-white/70 text-xs mb-4">
                                {t("quizResult.answersAligned", {
                                    percentage: String(percentage),
                                    category: categoryLabels[topType],
                                })}
                            </p>
                            <div className="flex flex-col gap-2.5">
                                {sortedScores.map(([type, count]) => {
                                    const pct = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0
                                    return (
                                        <div key={type} className="flex items-center gap-2.5">
                                            <span className="text-[11px] font-bold text-white/85 w-22 font-heading">
                                                {categoryLabels[type]}
                                            </span>
                                            <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] font-semibold text-white/60 w-8 text-right">
                                                {pct}%
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* What to Study */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <BookOpen size={16} className="text-girly-purple" />
                                <h3 className="text-sm font-extrabold text-dark-purple font-heading">
                                    {t("quizResult.whatToStudy")}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {career.studyPaths.map((path) => (
                                    <span
                                        key={path}
                                        className="bg-girly-purple/10 text-girly-purple
                                            text-xs font-semibold px-3 py-1.5 rounded-full"
                                    >
                                        {path}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Related Careers */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <LinkIcon size={16} className="text-hot-pink" />
                                <h3 className="text-sm font-extrabold text-dark-purple font-heading">
                                    {t("quizResult.relatedCareers")}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {career.relatedCareers.map((related) => (
                                    <span
                                        key={related}
                                        className="bg-hot-pink/10 text-hot-pink
                                            text-xs font-semibold px-3 py-1.5 rounded-full"
                                    >
                                        {related}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Leaders */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <Users size={16} className="text-cute-orange" />
                                <h3 className="text-sm font-extrabold text-dark-purple font-heading">
                                    {t("quizResult.leadersInField")}
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {career.leaders.map((leader) => (
                                    <div
                                        key={leader.name}
                                        className="flex items-center gap-3 bg-white rounded-xl px-4 py-3
                                            ring-1 ring-gray-100 shadow-sm"
                                    >
                                        <div className={`w-9 h-9 rounded-full bg-linear-to-br ${categoryGradients[topType]}
                                            flex items-center justify-center text-xs font-bold text-white font-heading shrink-0`}
                                        >
                                            {leader.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-dark-purple text-sm font-heading">
                                                {leader.name}
                                            </p>
                                            <p className="text-dark-purple/50 text-xs">
                                                {leader.country}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== BOTTOM SECTION: Other careers + buttons ==================== */}
            {otherCareers.length > 0 && (
                <div
                    className="bg-cream px-6 py-12 sm:px-10 md:px-16 animate-funfact-in"
                    style={{ animationDelay: "0.3s" }}
                >
                    <div className="max-w-5xl mx-auto">
                        <h3 className="text-2xl font-extrabold text-dark-purple mb-6 text-center font-heading">
                            {t("quizResult.otherCareers", { category: categoryLabels[topType] })}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {otherCareers.map((c) => (
                                <div
                                    key={c.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md ring-1 ring-gray-100
                                        hover:shadow-xl hover:ring-girly-purple/30
                                        transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <Image
                                            src={getCareerImage(c.id)}
                                            alt={c.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                                        {c.growth && (
                                            <span className="absolute top-3 left-3 bg-white/80 text-cute-orange text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                🔥 {t("quizResult.trending")}
                                            </span>
                                        )}

                                        <p className="absolute bottom-3 left-4 right-4 text-white font-extrabold text-base drop-shadow font-heading">
                                            {c.name}
                                        </p>

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-strong-purple via-strong-purple/95 to-strong-purple/80
                                            flex flex-col justify-end p-4
                                            opacity-0 translate-y-4
                                            group-hover:opacity-100 group-hover:translate-y-0
                                            transition-all duration-300 ease-out"
                                        >
                                            <p className="text-white font-extrabold text-sm font-heading mb-1">
                                                {c.name}
                                            </p>
                                            <p className="text-white/75 text-xs leading-snug line-clamp-3 mb-2">
                                                {c.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {c.studyPaths.slice(0, 2).map((path) => (
                                                    <span
                                                        key={path}
                                                        className="bg-white/15 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                    >
                                                        {path}
                                                    </span>
                                                ))}
                                                {c.studyPaths.length > 2 && (
                                                    <span className="text-white/50 text-[10px] font-semibold px-1 py-0.5">
                                                        {t("quizResult.more", { count: String(c.studyPaths.length - 2) })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={`/explore-careers?category=${topType}`}
                                className="flex items-center justify-center gap-2 px-7 py-3 rounded-full
                                    bg-linear-to-r from-cute-orange to-hot-pink
                                    text-white font-bold text-sm
                                    hover:from-hot-pink hover:to-cute-orange
                                    transition-all duration-500 shadow-lg hover:shadow-xl
                                    hover:scale-105 active:scale-95"
                            >
                                {t("quizResult.exploreAll", { category: categoryLabels[topType] })} <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/explore-careers"
                                className="flex items-center justify-center gap-2 px-7 py-3 rounded-full
                                    border-2 border-girly-purple text-girly-purple font-bold text-sm
                                    hover:bg-girly-purple/10
                                    transition-all duration-300"
                            >
                                {t("quizResult.browseAll")}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function QuizResultPage() {
    const { t } = useI18n()
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <p className="text-dark-purple/60 text-lg font-heading">{t("quizResult.loadingResults")}</p>
            </div>
        }>
            <QuizResultContent />
        </Suspense>
    )
}
