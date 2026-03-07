import { NextResponse } from "next/server";

const questions = [
  {
    id: 1,
    question: "What do you enjoy most in your free time?",
    options: [
      "Building or fixing things",
      "Drawing, designing, or creating art",
      "Solving puzzles or brain teasers",
      "Helping or teaching others",
    ],
  },
  {
    id: 2,
    question: "Which school subject excites you the most?",
    options: [
      "Math or Science",
      "Art or Music",
      "Computer class or Technology",
      "Social Studies or Languages",
    ],
  },
  {
    id: 3,
    question: "How do you prefer to work?",
    options: [
      "Alone, deep in focus",
      "In a creative team",
      "Leading a group project",
      "One-on-one with someone",
    ],
  },
  {
    id: 4,
    question: "Which sounds most like your dream day at work?",
    options: [
      "Writing code and building apps",
      "Designing beautiful interfaces",
      "Analyzing data to find insights",
      "Managing projects and talking to clients",
    ],
  },
  {
    id: 5,
    question: "What motivates you the most?",
    options: [
      "Creating something new",
      "Making things look amazing",
      "Solving complex problems",
      "Making a positive impact on people",
    ],
  },
];

export async function GET() {
  return NextResponse.json({ data: questions, error: null });
}
