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
        <div className="w-full space-y-2">
            <div className="flex justify-between items-baseline text-sm md:text-base">
                <span className="text-strong-purple font-semibold">
                    Stage {stageNumber}:{" "}
                    <span className="text-dark-purple font-bold">{stageName}</span>
                </span>
                <span className="text-dark-purple/40 font-light">
                    {percentage}% complete
                </span>
            </div>

            <Progress value={percentage} />
        </div>
    )
}
