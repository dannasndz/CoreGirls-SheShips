"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { RegisterForm } from "@/components/register-form"
import { useI18n } from "@/lib/i18n"

type Mode = "login" | "signup"

interface QuizAuthModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function QuizAuthModal({ open, onClose, onSuccess }: QuizAuthModalProps) {
    const { t } = useI18n()
    const [mode, setMode] = useState<Mode>("signup")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (!open) return null

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError(t("auth.invalidCredentials"))
                setLoading(false)
                return
            }

            setEmail("")
            setPassword("")
            onSuccess()
        } catch {
            setError(t("auth.somethingWentWrong"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Top section — celebratory header */}
                <div className="bg-linear-to-br from-girly-purple via-hot-pink to-cute-orange px-6 pt-8 pb-6 text-center relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors text-lg leading-none"
                    >
                        &times;
                    </button>

                    <div className="text-5xl mb-3">&#127775;</div>
                    <h2
                        className="text-2xl sm:text-3xl font-extrabold text-white mb-2"
                        style={{ fontFamily: "var(--font-fredoka)" }}
                    >
                        {t("quizAuth.resultsReady")}
                    </h2>
                    <p
                        className="text-white/90 text-sm sm:text-base leading-relaxed"
                        style={{ fontFamily: "var(--font-baloo)" }}
                    >
                        {mode === "signup"
                            ? t("quizAuth.signupPrompt")
                            : t("quizAuth.loginPrompt")}
                    </p>
                </div>

                {/* Form section */}
                <div className="px-6 pt-6 pb-8 overflow-y-auto">
                    {mode === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label
                                    className="block text-sm font-semibold text-dark-purple mb-1.5"
                                    style={{ fontFamily: "var(--font-fredoka)" }}
                                >
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border-2 border-light-pink/60 bg-cream/50 px-4 py-2.5 text-dark-purple placeholder:text-dark-purple/30 focus:outline-none focus:border-girly-purple focus:ring-1 focus:ring-girly-purple/30 transition-colors"
                                    style={{ fontFamily: "var(--font-baloo)" }}
                                    placeholder="tu@correo.com"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-semibold text-dark-purple mb-1.5"
                                    style={{ fontFamily: "var(--font-fredoka)" }}
                                >
                                    {t("quizAuth.password")}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border-2 border-light-pink/60 bg-cream/50 px-4 py-2.5 text-dark-purple placeholder:text-dark-purple/30 focus:outline-none focus:border-girly-purple focus:ring-1 focus:ring-girly-purple/30 transition-colors"
                                    style={{ fontFamily: "var(--font-baloo)" }}
                                    placeholder={t("quizAuth.passwordPlaceholder")}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 font-medium text-center rounded-lg bg-red-50 py-2">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-bold text-white text-base
                                    bg-linear-to-r from-girly-purple to-hot-pink
                                    hover:from-hot-pink hover:to-cute-orange
                                    disabled:opacity-50 disabled:pointer-events-none
                                    transition-all duration-500 shadow-md cursor-pointer"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                {loading
                                    ? t("quizAuth.oneMoment")
                                    : t("quizAuth.loginAndSee")}
                            </button>
                        </form>
                    ) : (
                        <RegisterForm
                            onSuccess={({ email: regEmail, password: regPassword }) => {
                                signIn("credentials", {
                                    email: regEmail,
                                    password: regPassword,
                                    redirect: false,
                                }).then((result) => {
                                    if (!result?.error) {
                                        onSuccess()
                                    }
                                })
                            }}
                            onError={(msg) => setError(msg)}
                        />
                    )}

                    {error && mode === "signup" && (
                        <p className="text-sm text-red-500 font-medium text-center rounded-lg bg-red-50 py-2 mt-3">
                            {error}
                        </p>
                    )}

                    <p
                        className="mt-5 text-center text-sm text-dark-purple/60"
                        style={{ fontFamily: "var(--font-baloo)" }}
                    >
                        {mode === "signup" ? t("quizAuth.alreadyHaveAccount") : t("quizAuth.dontHaveAccount")}{" "}
                        <button
                            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError("") }}
                            className="text-girly-purple font-bold hover:underline"
                        >
                            {mode === "signup" ? t("quizAuth.logIn") : t("quizAuth.signUp")}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
