import React from "react";
import { InputBox, QuestionEdit, ApiHelper, FormSubmissionInterface, UniqueIdHelper } from "./";
import { AnswerInterface, QuestionInterface } from "../helpers";

interface Props {
    addFormId: string,
    contentType: string,
    contentId: string,
    formSubmissionId: string,
    updatedFunction: (formId: string) => void
}

export const FormSubmissionEdit: React.FC<Props> = (props) => {
    const [formSubmission, setFormSubmission] = React.useState(null);

    const handleCancel = () => props.updatedFunction("");

    const getDeleteFunction = () => { return (!UniqueIdHelper.isMissing(formSubmission?.id)) ? handleDelete : undefined; }
    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to delete this form data?")) {
            ApiHelper.delete("/formsubmissions/" + formSubmission.id, "MembershipApi").then(() => {
                props.updatedFunction("");
            });
        }
    }


    const getAnswer = (questionId: string) => {
        var answers = formSubmission.answers;
        for (var i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
        return null;
    }

    const loadData = () => {
        if (!UniqueIdHelper.isMissing(props.formSubmissionId)) { ApiHelper.get("/formsubmissions/" + props.formSubmissionId + "/?include=questions,answers,form", "MembershipApi").then(data => setFormSubmission(data)); }
        else if (!UniqueIdHelper.isMissing(props.addFormId)) {
            ApiHelper.get("/questions/?formId=" + props.addFormId, "MembershipApi").then(data => {
                var fs: FormSubmissionInterface = {
                    formId: props.addFormId, contentType: props.contentType, contentId: props.contentId, answers: []
                };
                fs.questions = data;
                fs.answers = [];
                fs.questions.forEach((q) => {
                    var answer: AnswerInterface = { formSubmissionId: fs.id, questionId: q.id };
                    answer.value = getDefaultValue(q);
                    fs.answers.push(answer);
                });
                setFormSubmission(fs);
            });
        }
    }

    const getDefaultValue = (q: QuestionInterface) => {
        var result = "";
        if (q.fieldType === "Yes/No") result = "False";
        else if (q.fieldType === "Multiple Choice") {
            if (q.choices !== undefined && q.choices !== null && q.choices.length > 0) result = q.choices[0].value;
        }
        return result;
    }

    const handleSave = () => {
        const fs = formSubmission;
        ApiHelper.post("/formsubmissions/", [fs], "MembershipApi")
            .then(data => {
                fs.id = data[0];
                props.updatedFunction(fs.formId);
            });
    }

    const handleChange = (questionId: string, value: string) => {
        var fs = { ...formSubmission };
        var answer: AnswerInterface = null;
        for (var i = 0; i < fs.answers.length; i++) if (fs.answers[i].questionId === questionId) answer = fs.answers[i];
        if (answer !== null) answer.value = value;
        else {
            answer = { formSubmissionId: fs.id, questionId: questionId, value: value };
            fs.answers.push(answer);
        }
        setFormSubmission(fs);
    }

    const checkFormAdded = () => { if (!UniqueIdHelper.isMissing(props.addFormId)) loadData(); }

    React.useEffect(loadData, [props.formSubmissionId]);
    React.useEffect(checkFormAdded, [props.addFormId]);

    var questionList = [];
    if (formSubmission != null) {
        var questions = formSubmission.questions;
        for (var i = 0; i < questions.length; i++) questionList.push(<QuestionEdit key={questions[i].id} question={questions[i]} answer={getAnswer(questions[i].id)} changeFunction={handleChange} />);
    }

    return <InputBox id="formSubmissionBox" headerText={formSubmission?.form?.name || "Edit Form"} headerIcon="fas fa-user" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} >{questionList}</InputBox>;
}


