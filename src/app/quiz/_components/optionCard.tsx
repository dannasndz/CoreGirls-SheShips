import { Option } from "@/types/quiz"

type Props = {
    option: Option
    label: string
    selected: boolean
    onSelect: (type: Option["type"]) => void
}

export default function OptionCard({ option, label, selected, onSelect }: Props) {
    return (
        <div
            onClick={() => onSelect(option.type)}
            className={`
                flex flex-col rounded-2xl overflow-hidden cursor-pointer
                hover:shadow-xl active:scale-[0.98]
                transition-all duration-300 ease-in-out
                ${selected
                    ? "ring-3 ring-cute-orange shadow-lg shadow-cute-orange/20"
                    : "ring-1 ring-gray-200 hover:ring-cute-orange/50"
                }
            `}
        >
            <div className="flex-1 min-h-44 bg-gray-100" />

            <div className={`
                w-full p-5 min-h-28 text-white text-center
                flex flex-col items-center justify-center
                bg-linear-to-r from-cute-orange to-orange-400
                transition-opacity duration-300
                ${selected ? "opacity-100" : "opacity-90 hover:opacity-100"}
            `}>
                <p className="text-lg font-bold mb-1">
                    {label}
                </p>
                <p className="text-sm leading-snug">
                    {option.text}
                </p>
            </div>
        </div>
    )
}
