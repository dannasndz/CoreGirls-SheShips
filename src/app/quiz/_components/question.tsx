import { Question as QuestionType, StemType } from "@/types/quiz"
import { SpeakButton } from "@/components/speak-button"
import OptionCard from "./optionCard"

type Props = {
    data: QuestionType
    selectedAnswer?: StemType
    onAnswer: (type: StemType) => void
}

const optionLabels = ["Option A", "Option B", "Option C", "Option D"]

export default function Question({ data, selectedAnswer, onAnswer }: Props) {
    return (
        <div className="text-center text-strong-purple">
            <div className="flex items-start justify-center gap-3 mb-8 mt-6">
                <h2 className="text-3xl md:text-4xl font-extrabold font-heading leading-tight">
                    {data.question}
                </h2>
                <SpeakButton
                    text={data.question}
                    size="md"
                    className="mt-1.5"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-1">
                {data.options.map((option, index) => (
                    <OptionCard
                        key={index}
                        option={option}
                        label={optionLabels[index]}
                        selected={selectedAnswer === option.type}
                        onSelect={onAnswer}
                    />
                ))}
            </div>
        </div>
    )
}
