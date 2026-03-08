"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

type Mode = "login" | "signup"

interface QuizAuthModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function QuizAuthModal({ open, onClose, onSuccess }: QuizAuthModalProps) {
    const [mode, setMode] = useState<Mode>("signup")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (!open) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (mode === "signup") {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                })
                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || "Registration failed")
                    setLoading(false)
                    return
                }
            }

            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid credentials")
                setLoading(false)
                return
            }

            setUsername("")
            setPassword("")
            onSuccess()
        } catch {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                {/* Top section — celebratory header */}
                <div className="bg-linear-to-br from-girly-purple via-hot-pink to-cute-orange px-6 pt-8 pb-6 text-center relative">
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
                        Your results are ready!
                    </h2>
                    <p
                        className="text-white/90 text-sm sm:text-base leading-relaxed"
                        style={{ fontFamily: "var(--font-baloo)" }}
                    >
                        {mode === "signup"
                            ? "Create a free account to discover your perfect STEM career match"
                            : "Log in to see your perfect STEM career match"}
                    </p>
                </div>

                {/* Form section */}
                <div className="px-6 pt-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-semibold text-dark-purple mb-1.5"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-xl border-2 border-light-pink/60 bg-cream/50 px-4 py-2.5 text-dark-purple placeholder:text-dark-purple/30 focus:outline-none focus:border-girly-purple focus:ring-1 focus:ring-girly-purple/30 transition-colors"
                                style={{ fontFamily: "var(--font-baloo)" }}
                                placeholder="Pick a username"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-semibold text-dark-purple mb-1.5"
                                style={{ fontFamily: "var(--font-fredoka)" }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border-2 border-light-pink/60 bg-cream/50 px-4 py-2.5 text-dark-purple placeholder:text-dark-purple/30 focus:outline-none focus:border-girly-purple focus:ring-1 focus:ring-girly-purple/30 transition-colors"
                                style={{ fontFamily: "var(--font-baloo)" }}
                                placeholder="Create a password"
                                required
                                minLength={6}
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
                                ? "One moment..."
                                : mode === "signup"
                                    ? "Show my results!"
                                    : "Log in & see results!"}
                        </button>
                    </form>

                    <p
                        className="mt-5 text-center text-sm text-dark-purple/60"
                        style={{ fontFamily: "var(--font-baloo)" }}
                    >
                        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError("") }}
                            className="text-girly-purple font-bold hover:underline"
                        >
                            {mode === "signup" ? "Log in" : "Sign up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
