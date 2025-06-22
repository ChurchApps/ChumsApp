import React from "react";
import { Question } from "./";
import { Grid } from "@mui/material"
import { SmallButton, type FormSubmissionInterface, Permissions, ApiHelper, UserHelper, UniqueIdHelper } from "@churchapps/apphelper";

interface Props {
  formSubmissionId: string,
  editFunction: (formSubmissionId: string) => void
}

export const FormSubmission: React.FC<Props> = (props) => {
  const [formSubmission, setFormSubmission] = React.useState<FormSubmissionInterface | null>(null);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  const getEditLink = () => {
    if (!formPermission) return null;
    else return <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { props.editFunction(props.formSubmissionId); }} data-testid="edit-form-submission-button" ariaLabel="Edit form submission" /></span>
  }
  const loadData = React.useCallback(async () => {
    if (!UniqueIdHelper.isMissing(props.formSubmissionId)) {
      try {
        const data = await ApiHelper.get("/formsubmissions/" + props.formSubmissionId + "/?include=questions,answers", "MembershipApi");
        setFormSubmission(data);
      } catch (error) {
        console.error("Failed to load form submission:", error);
      }
    }
  }, [props.formSubmissionId]);
  const getAnswer = (questionId: string) => {
    if (!formSubmission?.answers) return null;
    const answers = formSubmission.answers;
    for (let i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
    return null;
  }
  React.useEffect(() => {
    loadData();
  }, [props.formSubmissionId, loadData]);

  const firstHalf = [];
  const secondHalf = [];
  if (formSubmission != null) {
    const questions = formSubmission.questions;
    const halfWay = Math.round(questions.length / 2);
    for (let i = 0; i < halfWay; i++) firstHalf.push(<Question key={i} question={questions[i]} answer={getAnswer(questions[i].id)} />);
    for (let j = halfWay; j < questions.length; j++) secondHalf.push(<Question key={j} question={questions[j]} answer={getAnswer(questions[j].id)} />);
  }

  return (
    <>
      <div className="content">

        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>{firstHalf}</Grid>
          <Grid item md={6} xs={12}>
            {getEditLink()}
            {secondHalf}
          </Grid>
        </Grid>
      </div>
    </>
  );
}

