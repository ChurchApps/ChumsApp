import React from "react";
import { InputBox, QuestionEdit, ApiHelper, FormSubmissionInterface, UniqueIdHelper } from "./";
import { AnswerInterface, QuestionInterface } from "../helpers";

interface Props {
    addFormId: string,
    contentType: string,
    contentId: string,
    formSubmissionId: string,
    updatedFunction: () => void
}

export const FormSubmissionEdit: React.FC<Props> = (props) => {
  const [formSubmission, setFormSubmission] = React.useState(null);

  const getDeleteFunction = () => (!UniqueIdHelper.isMissing(formSubmission?.id)) ? handleDelete : undefined
  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this form data?")) {
      ApiHelper.delete("/formsubmissions/" + formSubmission.id, "MembershipApi").then(() => {
        props.updatedFunction();
      });
    }
  }

  const getAnswer = (questionId: string) => {
    let answers = formSubmission.answers;
    for (let i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
    return null;
  }

  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.formSubmissionId)) { ApiHelper.get("/formsubmissions/" + props.formSubmissionId + "/?include=questions,answers,form", "MembershipApi").then(data => setFormSubmission(data)); }
    else if (!UniqueIdHelper.isMissing(props.addFormId)) {
      ApiHelper.get("/questions/?formId=" + props.addFormId, "MembershipApi").then(data => {
        let fs: FormSubmissionInterface = {
          formId: props.addFormId, contentType: props.contentType, contentId: props.contentId, answers: []
        };
        fs.questions = data;
        fs.answers = [];
        fs.questions.forEach((q) => {
          let answer: AnswerInterface = { formSubmissionId: fs.id, questionId: q.id };
          answer.value = getDefaultValue(q);
          fs.answers.push(answer);
        });
        setFormSubmission(fs);
      });
    }
  }

  const getDefaultValue = (q: QuestionInterface) => {
    let result = "";
    if (q.fieldType === "Yes/No") result = "False";
    else if (q.fieldType === "Multiple Choice") {
      if (q.choices !== undefined && q.choices !== null && q.choices.length > 0) result = q.choices[0].value;
    }
    return result;
  }

  const handleSave = () => {
    const fs = formSubmission;
    ApiHelper.post("/formsubmissions/", [fs], "MembershipApi")
      .then(() => {
        props.updatedFunction();
      });
  }

  const handleChange = (questionId: string, value: string) => {
    let fs = { ...formSubmission };
    let answer: AnswerInterface = null;
    for (let i = 0; i < fs.answers.length; i++) if (fs.answers[i].questionId === questionId) answer = fs.answers[i];
    if (answer !== null) answer.value = value;
    else {
      answer = { formSubmissionId: fs.id, questionId: questionId, value: value };
      fs.answers.push(answer);
    }
    setFormSubmission(fs);
  }

  React.useEffect(loadData, []);

  let questionList = [];
  if (formSubmission != null) {
    let questions = formSubmission.questions;
    for (let i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={getAnswer(questions[i].id)} changeFunction={handleChange} />);
  }

  return <InputBox id="formSubmissionBox" headerText={formSubmission?.form?.name || "Edit Form"} headerIcon="fas fa-user" saveFunction={handleSave} cancelFunction={props.updatedFunction} deleteFunction={getDeleteFunction()}>{questionList}</InputBox>;
}

