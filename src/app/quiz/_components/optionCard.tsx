import Image from "next/image"
import { Option } from "@/types/quiz"

type Props = {
    option: Option
    label: string
    imageSrc: string
    selected: boolean
    onSelect: (type: Option["type"]) => void
}

export default function OptionCard({ option, label, imageSrc, selected, onSelect }: Props) {
    return (
        <div
            onClick={() => onSelect(option.type)}
            className={`
                flex flex-col rounded-2xl overflow-hidden cursor-pointer
                hover:shadow-xl active:scale-[0.98]
                transition-all duration-300 ease-in-out
                ${selected
                    ? "ring-3 ring-cute-orange shadow-lg shadow-cute-orange/30"
                    : "ring-1 ring-white/20 hover:ring-cute-orange/50"
                }
            `}
        >
            <div className="relative h-[40vh] bg-white/90">
                <Image
                    src={imageSrc}
                    alt={option.text}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>

            <div className={`
                w-full px-4 py-3 min-h-24 text-white text-center shrink-0
                flex flex-col items-center justify-center
                bg-linear-to-r from-cute-orange to-orange-400
                transition-opacity duration-300
                ${selected ? "opacity-100" : "opacity-90 hover:opacity-100"}
            `}>
                <p className="text-base font-bold mb-0.5">
                    {label}
                </p>
                <p className="text-xs leading-snug">
                    {option.text}
                </p>
            </div>
        </div>
    )
}
