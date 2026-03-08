import { Question as QuestionType, StemType } from "@/types/quiz"
import OptionCard from "./optionCard"

type Props = {
    data: QuestionType
    selectedAnswer?: StemType
    onAnswer: (type: StemType) => void
}

const optionLabels = ["Option A", "Option B", "Option C", "Option D"]
const optionLetters = ["A", "B", "C", "D"]

export default function Question({ data, selectedAnswer, onAnswer }: Props) {
    return (
        <div className="text-center text-cream sm:flex sm:flex-col sm:flex-1 sm:min-h-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 mt-1 font-heading leading-tight sm:shrink-0">
                {data.question}
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 px-1 sm:flex-1 sm:min-h-0">
                {data.options.map((option, index) => (
                    <OptionCard
                        key={index}
                        option={option}
                        label={optionLabels[index]}
                        imageSrc={`/quiz/Q${data.id}A${optionLetters[index]}.png`}
                        selected={selectedAnswer === option.type}
                        onSelect={onAnswer}
                    />
                ))}
            </div>
        </div>
    )
}
