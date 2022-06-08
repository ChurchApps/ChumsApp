import React from "react";
import { Question, ApiHelper, FormSubmissionInterface, UserHelper, Permissions, UniqueIdHelper } from "./";
import { Grid, Icon } from "@mui/material"

interface Props {
  formSubmissionId: string,
  editFunction: (formSubmissionId: string) => void
}

export const FormSubmission: React.FC<Props> = (props) => {
  const [formSubmission, setFormSubmission] = React.useState(null);
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);

  const handleEdit = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); props.editFunction(props.formSubmissionId); }
  const getEditLink = () => {
    if (!formPermission) return null;
    else return (<a href="about:blank" className="pull-right" onClick={handleEdit}><Icon>edit</Icon></a>);
  }
  const loadData = () => {
    if (!UniqueIdHelper.isMissing(props.formSubmissionId)) {
      try {
        ApiHelper.get("/formsubmissions/" + props.formSubmissionId + "/?include=questions,answers", "MembershipApi").then((data: FormSubmissionInterface) => setFormSubmission(data));
      } catch { }
    }
  }
  const getAnswer = (questionId: string) => {
    let answers = formSubmission.answers;
    for (let i = 0; i < answers.length; i++) if (answers[i].questionId === questionId) return answers[i];
    return null;
  }
  React.useEffect(loadData, [props.formSubmissionId]);

  let firstHalf = [];
  let secondHalf = [];
  if (formSubmission != null) {
    let questions = formSubmission.questions;
    let halfWay = Math.round(questions.length / 2);
    for (let i = 0; i < halfWay; i++) firstHalf.push(<Question key={i} question={questions[i]} answer={getAnswer(questions[i].id)} />);
    for (let j = halfWay; j < questions.length; j++) secondHalf.push(<Question key={j} question={questions[j]} answer={getAnswer(questions[j].id)} />);
  }

  return (
    <>
      {getEditLink()}
      <div className="content">
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>{firstHalf}</Grid>
          <Grid item md={6} xs={12}>{secondHalf}</Grid>
        </Grid>
      </div>
    </>
  );
}

