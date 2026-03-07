export type StemType = "S" | "T" | "E" | "M"

export type Option = {
  text: string
  type: StemType
}

export type Question = {
  id: number
  stage: string
  question: string
  options: Option[]
  funFact: string
}

export type Score = {
  S: number
  T: number
  E: number
  M: number
}