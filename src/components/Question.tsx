import React from "react";
import { Helper, QuestionInterface, AnswerInterface } from "./";

interface Props { question: QuestionInterface, answer: AnswerInterface }

export const Question: React.FC<Props> = (props) => {
  let q = props.question;
  let a = props.answer;
  if (a === null) return null;

  if (q.fieldType === "Heading") return <h5>{q.title}</h5>;
  else {
    let displayValue = "";
    switch (q.fieldType) {
    case "Date":
      displayValue = (a.value === null || a.value === "") ? "" : Helper.getShortDate(new Date(a.value));
      break;
    case "Yes/No":
      displayValue = (a.value === null || a.value === "") ? "" : a.value.replace("False", "No").replace("True", "Yes");
      break;
    default:
      displayValue = a.value;
      break;
    }
    return <div><label>{q.title}:</label> {displayValue}</div>
  }
}
