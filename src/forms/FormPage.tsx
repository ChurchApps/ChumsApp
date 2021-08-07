import React from "react";
import { UserHelper, Permissions, Tabs, ApiHelper, FormInterface } from "./components";
import { RouteComponentProps } from "react-router-dom"

type TParams = { id?: string };
export const FormPage = ({ match }: RouteComponentProps<TParams>) => {
  const [form, setForm] = React.useState<FormInterface>({} as FormInterface);

  const questionUpdated = () => { loadQuestions(); setEditQuestionId("notset"); }
  const loadData = () => {
    ApiHelper.get("/forms/" + match.params.id, "MembershipApi").then(data => {
      setForm(data);
      ApiHelper.get("/memberpermissions/form/" + data.id, "MembershipApi").then(results => setFormMembers(results));
      loadQuestions();
    });
  }
  const loadQuestions = () => ApiHelper.get("/questions?formId=" + match.params.id, "MembershipApi").then(data => setQuestions(data));
  const getEditContent = () => (<button className="no-default-style" aria-label="addQuestion" onClick={() => { setEditQuestionId(""); }}><i className="fas fa-plus"></i></button>)
  const getEditMembersContent = () => (<a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditFomrMembers(true); }}><i className="fas fa-plus"></i></a>)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    setEditQuestionId(questions[idx].id);
  }

  const moveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    let tmpQuestions = [...questions];
    let question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx - 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/up", "MembershipApi");
  }

  const moveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let row = anchor.parentNode.parentNode as HTMLElement;
    let idx = parseInt(row.getAttribute("data-index"));
    let tmpQuestions = [...questions];
    let question = tmpQuestions.splice(idx, 1)[0];
    tmpQuestions.splice(idx + 1, 0, question);
    setQuestions(tmpQuestions);
    ApiHelper.get("/questions/sort/" + question.id + "/down", "MembershipApi");
  }

  const getRows = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      rows.push(<tr key="0"><td>No custom questions have been created yet.  Questions will be listed here.</td></tr>);
      return rows;
    }
    for (let i = 0; i < questions.length; i++) {
      let upArrow = (i === 0) ? <span style={{ display: "inline-block", width: 20 }} /> : <button className="no-default-style" aria-label="moveUp" onClick={moveUp}><i className="fas fa-arrow-up" /></button>
      let downArrow = (i === questions.length - 1) ? <></> : <> &nbsp; <button className="no-default-style" aria-label="moveDown" onClick={moveDown}><i className="fas fa-arrow-down" /></button></>
      rows.push(
        <tr key={i} data-index={i}>
          <td><a href="about:blank" onClick={handleClick}>{questions[i].title}</a></td>
          <td>{questions[i].fieldType}</td>
          <td style={{ textAlign: "left" }}>{upArrow}{downArrow}</td>
        </tr>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (questions.length === 0) {
      return rows;
    }
    rows.push(<tr key="header"><th>Question</th><th>Type</th><th>Action</th></tr>);
    return rows;
  }

  const getSidebarModules = () => {
    let result = [];
    if (editQuestionId !== "notset") result.push(<FormQuestionEdit key="form-questions" questionId={editQuestionId} updatedFunction={questionUpdated} formId={form.id} />)
    if (editFormMembers) result.push(<FormQuestionEdit key="form-questions" questionId={editQuestionId} updatedFunction={questionUpdated} formId={form.id} />)
    return result;
  }

  const getMemberRows = () => {
    const rows: JSX.Element[] = [];
    formMembers.forEach(member => {
      rows.push(<tr key={member.id}><td>{member.personName}</td><td className="capitalize">{member.action}</td></tr>);
    });
    return rows;
  }

  React.useEffect(loadData, []);

  if (!UserHelper.checkAccess(Permissions.membershipApi.forms.edit)) return (<></>);
  else return (
    <>
      <h1><i className="fas fa-list"></i> {form.name}</h1>
      <Tabs formId={match.params.id} />
    </>
  );
}
