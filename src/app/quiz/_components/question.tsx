import { Question as QuestionType, StemType } from "@/types/quiz"
import { SpeakButton } from "@/components/speak-button"
import OptionCard from "./optionCard"
import { useI18n } from "@/lib/i18n"

type Props = {
    data: QuestionType
    selectedAnswer?: StemType
    onAnswer: (type: StemType) => void
}

const optionLetters = ["A", "B", "C", "D"]

export default function Question({ data, selectedAnswer, onAnswer }: Props) {
    const { t } = useI18n()
    const optionLabels = [t("quiz.optionA"), t("quiz.optionB"), t("quiz.optionC"), t("quiz.optionD")]

    return (
        <div className="text-center text-cream sm:flex sm:flex-col sm:flex-1 sm:min-h-0">
            <div className="flex items-center justify-center gap-2 mb-3 mt-1 sm:shrink-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading leading-tight">
                    {data.question}
                </h2>
                <SpeakButton
                    text={data.question}
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30 shrink-0"
                />
            </div>

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
