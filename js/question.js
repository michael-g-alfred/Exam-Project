import { Answer } from "./answer.js";
export class Question {
  constructor(QId, question, answers) {
    this.QId = QId;
    this.question = question;
    this.answers = Array.isArray(answers)
      ? answers.map((answer) => new Answer(answer.text, answer.isCorrect))
      : [];
  }
}
