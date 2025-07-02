import React from "react";
import { FormQuestionEdit } from ".";
import { ApiHelper, DisplayBox, type FormInterface, type QuestionInterface, Permissions, Loading, UserHelper, Locale } from "@churchapps/apphelper";
import { Grid, Icon, Table, TableBody, TableCell, TableRow, TableHead, Box, Card, Typography, Stack } from "@mui/material";

interface Props { id: string }

export const Form: React.FC<Props> = (props) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);
  const [questions, setQuestions] = React.useState<QuestionInterface[]>(null);
  const [editQuestionId, setEditQuestionId] = React.useState("notset");
  const formPermission = UserHelper.checkAccess(Permissions.membershipApi.forms.admin) || UserHelper.checkAccess(Permissions.membershipApi.forms.edit);
  const questionUpdated = () => { loadQuestions(); setEditQuestionId("notset"); }
  const loadData = () => { ApiHelper.get("/forms/" + props.id, "MembershipApi").then(data => setForm(data)); loadQuestions(); }
  const loadQuestions = () => ApiHelper.get("/questions?formId=" + props.id, "MembershipApi").then(data => setQuestions(data));
  const getEditContent = () => (<button className="no-default-style" aria-label="addQuestion" onClick={() => { setEditQuestionId(""); }}><Icon>add</Icon></button>)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const row = anchor.parentNode.parentNode as HTMLElement;
    const idx = parseInt(row.getAttribute("data-index"));
    setEditQuestionId(questions[idx].id);
  }
  const moveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const row = anchor.parentNode.parentNode as HTMLElement;
    const idx = parseInt(row.getAttribute("data-index"));
    const tmpQuestions = [...questions];
    const question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx - 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/up", "MembershipApi");
  }
  const moveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const row = anchor.parentNode.parentNode as HTMLElement;
    const idx = parseInt(row.getAttribute("data-index"));
    const tmpQuestions = [...questions];
    const question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx + 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/down", "MembershipApi");
  }
  const getRows = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("forms.form.noCustomMsg")}</TableCell></TableRow>);
      return rows;
    }
    for (let i = 0; i < questions.length; i++) {
      const upArrow = (i === 0) ? <span style={{ display: "inline-block", width: 20 }} /> : <button className="no-default-style" aria-label="moveUp" onClick={moveUp}><Icon>arrow_upward</Icon></button>
      const downArrow = (i === questions.length - 1) ? <></> : <> &nbsp; <button className="no-default-style" aria-label="moveDown" onClick={moveDown}><Icon>arrow_downward</Icon></button></>
      rows.push(
        <TableRow key={i} data-index={i}>
          <TableCell><a href="about:blank" onClick={handleClick}>{questions[i].title}</a></TableCell>
          <TableCell>{questions[i].fieldType}</TableCell>
          <TableCell style={{ textAlign: "left" }}>{upArrow}{downArrow}</TableCell>
          <TableCell>{questions[i].required ? Locale.label("common.yes") : Locale.label("common.no")}</TableCell>
        </TableRow>
      );
    }
    return rows;
  }
  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      return rows;
    }
    rows.push(<TableRow sx={{textAlign: "left"}} key="header"><th>{Locale.label("forms.form.question")}</th><th>{Locale.label("forms.form.type")}</th><th>{Locale.label("forms.form.act")}</th><th>{Locale.label("forms.form.req")}</th></TableRow>);
    return rows;
  }
  const getSidebarModules = () => {
    const result = [];
    if (editQuestionId !== "notset") result.push(<FormQuestionEdit key="form-questions" questionId={editQuestionId} updatedFunction={questionUpdated} formId={form.id} />)
    return result;
  }

  React.useEffect(loadData, []); //eslint-disable-line

  if (!formPermission) return (<></>);
  else {
    let contents = <Loading />
    if (questions) {
      contents = (<Table>
        <TableHead>{getTableHeader()}</TableHead>
        <TableBody>{getRows()}</TableBody>
      </Table>);
    }
    return (
      <>
        {/* Edit Question Content - Appears above when editing */}
        {getSidebarModules()}
        
        {/* Main Questions Content - Full Width Card */}
        <Card sx={{ width: "100%" }}>
          {/* Card Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon>help</Icon>
                <Typography variant="h6">
                  {Locale.label("forms.form.questions")}
                </Typography>
              </Stack>
              {formPermission && (
                <button 
                  className="no-default-style" 
                  aria-label="addQuestion" 
                  onClick={() => { setEditQuestionId(""); }}
                  style={{ 
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--c1l2)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Icon>add</Icon>
                  Add Question
                </button>
              )}
            </Stack>
          </Box>
          
          {/* Card Content */}
          <Box sx={{ p: 0 }}>
            {contents}
          </Box>
        </Card>
      </>
    );
  }
}
