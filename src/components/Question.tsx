import React from "react";
import {
 DateHelper, type QuestionInterface, type AnswerInterface, Locale 
} from "@churchapps/apphelper";

interface Props { question: QuestionInterface, answer: AnswerInterface }

export const Question: React.FC<Props> = (props) => {
  const q = props.question;
  const a = props.answer;
  if (a === null) return null;

  if (q.fieldType === "Heading") return <h5>{q.title}</h5>;
  else {
    let displayValue = "";
    switch (q.fieldType) {
      case "Date":
        displayValue = "";
        if (a.value) {
          try {
            const theDate = new Date(a.value);
            const localDate = new Date(theDate.getTime() + (theDate.getTimezoneOffset() * 60000));
            displayValue = DateHelper.getShortDate(localDate);
          } catch (e) {
            console.log(e);
          }
        }
        break;
      case "Yes/No":
        displayValue = (a.value === null || a.value === "") ? "" : a.value.replace("False", Locale.label("common.no")).replace("True", Locale.label("common.yes"));
        break;
      default:
        displayValue = a.value;
        break;
    }
    return <div><label>{q.title}:</label> {displayValue}</div>
  }
}
