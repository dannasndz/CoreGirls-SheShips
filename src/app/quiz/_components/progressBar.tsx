import { Progress } from "@/components/ui/progress"

type Props = {
    current: number
    total: number
    stageName: string
    stageNumber: number
}

export default function ProgressBar({ current, total, stageName, stageNumber }: Props) {
    const percentage = Math.round((current / total) * 100)

    return (
        <div className="w-full space-y-1 sm:space-y-2 shrink-0">
            <div className="flex justify-between items-baseline text-xs sm:text-sm md:text-base">
                <span className="text-white font-extrabold">
                    Stage {stageNumber}:{" "}
                    <span className="text-white font-semibold">{stageName}</span>
                </span>
                <span className="text-white/50 font-light">
                    {percentage}%
                </span>
            </div>

            <Progress value={percentage} />
        </div>
    )
}
