import React from "react";
import { DateHelper, QuestionInterface, AnswerInterface } from "@churchapps/apphelper";
import { useAppTranslation } from "../contexts/TranslationContext";

interface Props { question: QuestionInterface, answer: AnswerInterface }

export const Question: React.FC<Props> = (props) => {
  const { t } = useAppTranslation();
  let q = props.question;
  let a = props.answer;
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
        displayValue = (a.value === null || a.value === "") ? "" : a.value.replace("False", t("common.no")).replace("True", t("common.yes"));
        break;
      default:
        displayValue = a.value;
        break;
    }
    return <div><label>{q.title}:</label> {displayValue}</div>
  }
}
