import React, { useRef, useState } from "react";
import { type AnswerInterface, ApiHelper, DateHelper, DisplayBox, ExportLink, type FormSubmissionInterface, Locale, type MemberPermissionInterface, type PersonInterface, type QuestionInterface } from "@churchapps/apphelper";
import { useReactToPrint } from "react-to-print";
import { Grid, Icon, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";

interface Props { formId: string, memberPermissions: MemberPermissionInterface };

export const FormSubmissions: React.FC<Props> = (props) => {
  const [formSubmissions, setFormSubmissions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>([]);
  const [summaryCsv, setSummaryCsv] = useState<any>([]);
  const yesNoMap: any = { True: Locale.label("common.yes"), False: Locale.label("common.no") };
  const yesNoDefault = [{ value: "Yes", text: Locale.label("common.yes") }, { value: "No", text: Locale.label("common.no") }];
  const contentRef: any = useRef<HTMLDivElement>(null);
  const handleSummaryPrint = useReactToPrint({
    content: () => contentRef.current
  });

  const loadData = async () => {
    const people = await ApiHelper.get("/people", "MembershipApi");
    const formSubmissions = await ApiHelper.get("/formsubmissions/formId/" + props.formId, "MembershipApi")

    const csv: any[] = [];
    const summaryData: any = [];
    formSubmissions.forEach((formSubmission: any) => {
      const submittedBy = getPerson(people, formSubmission);
      const csvData: any = {};
      csvData["For"] = submittedBy?.name?.display || Locale.label("forms.formSubmissions.anon");
      formSubmission = setFormSubmissionData(people, formSubmission);
      formSubmission.questions.forEach((question: QuestionInterface) => {
        const answer = formSubmission.answers.find((answer: AnswerInterface) => answer.questionId === question.id) || null;
        const answerValue = answer?.value || "";
        if (question.fieldType === "Yes/No" && answer?.value) answer.value = yesNoMap[answer.value];
        csvData[question.title] = answerValue;
        formSubmission.csvData.push({ [question.title]: answerValue });
        if (question.fieldType === "Multiple Choice" || question.fieldType === "Yes/No" || question.fieldType === "Checkbox") {
          if (!summaryData.length) summaryData.push(setSummaryResultDefault(question, answer));
          else setSummaryResultData(summaryData, question, answer);
        }
      });
      csv.push(csvData);
    });
    setSummary(summaryData);
    setFormSubmissions(formSubmissions);
    setSummaryCsv(csv);


  }

  const setSummaryResultData = (summaryData: any, question: QuestionInterface, answer: AnswerInterface) => {
    const match = summaryData.find((result: any) => result.title === question.title);
    if (match) {
      match.values.forEach((resultValue: any) => {
        const key: string = Object.keys(resultValue)[0];
        if (question.fieldType === "Checkbox") {
          const splitAnswer = answer?.value?.split(",");
          if (splitAnswer?.indexOf(key) > -1) resultValue[key] = resultValue[key] + 1;
        } else {
          if (key === answer?.value) resultValue[key] = resultValue[key] + 1;
        }
      });
    }
    else summaryData.push(setSummaryResultDefault(question, answer));
  }

  const getPerson = (people:PersonInterface[], formSubmission: any) => {
    let result = people.find((person: PersonInterface) => person.id === formSubmission.submittedBy);
    if (formSubmission.contentType==="person") result = people.find((person: PersonInterface) => person.id === formSubmission.contentId);
    return result;
  }

  const setFormSubmissionData = (people: PersonInterface[], formSubmission: any) => {
    const submittedBy = getPerson(people, formSubmission);

    formSubmission.person = { name: submittedBy?.name?.display || Locale.label("forms.formSubmissions.anon"), id: submittedBy?.id || null };
    formSubmission.mappedQA = [];
    formSubmission.csvData = [];
    formSubmission.questions = formSubmission.questions.sort((a: QuestionInterface, b: QuestionInterface) => (a.title > b.title ? 1 : -1));
    return formSubmission;
  }

  const setSummaryResultDefault = (question: QuestionInterface, answer: AnswerInterface) => {
    const choices: any = [];
    const questionChoices = question.choices || yesNoDefault;
    questionChoices.forEach((choice: any) => {
      const choiceCount = { [choice.value]: 0, text: choice.text };
      if (question.fieldType === "Checkbox") {
        if (answer && answer?.value) {
          const splitAnswer = answer.value?.split(",");
          if (splitAnswer.indexOf(choice.value) > -1) choiceCount[choice.value] = 1;
        }
      } else {
        if (answer && answer?.value && choice.value === answer.value) choiceCount[choice.value] = 1;
      }
      choices.push(choiceCount);
    });
    return { title: question.title, values: choices };
  }

  const getResultCount = (summaryValues: any[]) => {
    const results: JSX.Element[] = [];
    summaryValues.forEach((sv: any, i: number) => {
      const key: string = Object.keys(sv)[0];
      results.push(<div key={sv.text + "-" + i}>{`${sv.text}: ${sv[key]}`}</div>);
    });
    return results;
  }

  const getSummary = () => {
    const results: JSX.Element[] = [];
    summary.forEach((s: any, i: number) => {
      results.push(
        <Grid size={{ xs: 12, md: 6 }} key={s.id + "-" + i}>
          <h4>{s.title}</h4>
          {getResultCount(s.values)}
        </Grid>
      );
    });
    return results;
  }

  const getTableHeader = () => {
    const result: JSX.Element[] = [];
    if (formSubmissions.length) {
      result.push(<TableCell key="submittedBy">{(formSubmissions[0].contentType==="person") ? Locale.label("forms.formSubmissions.subFor") : Locale.label("forms.formSubmissions.subBy") }</TableCell>);
      result.push(<TableCell key="submissionDate">{Locale.label("forms.formSubmissions.subDate")}</TableCell>);
      formSubmissions[0].questions.forEach((question: QuestionInterface) => result.push(<TableCell key={question.id}>{question.title}</TableCell>));
    }
    return result;
  }

  const getTableRows = () => {
    const rows: JSX.Element[] = [];
    formSubmissions.forEach((submission: any, i: number) => {
      rows.push(<TableRow key={i}>
        <TableCell key="personName"><a href={"/people/" + submission.person.id}>{submission.person.name}</a></TableCell>
        <TableCell key="subDate">{DateHelper.prettyDate(new Date(submission.submissionDate))}</TableCell>
        {getAnswers(submission)}
      </TableRow>);
    });
    return rows;
  }

  const getAnswers = (formSubmission: FormSubmissionInterface) => {
    const rows: JSX.Element[] = [];
    formSubmission.questions.forEach((question: QuestionInterface) => {
      const answer = formSubmission.answers.find((answer: AnswerInterface) => answer.questionId === question.id);
      rows.push(<TableCell key={question.id}>{answer?.value || "-"}</TableCell>);
    });
    return rows;
  }

  const getFormSubmissions = () => (
    <div style={{width: "100%", overflowX: "scroll"}}>
      <Table>
        <TableHead><TableRow key="header">{getTableHeader()}</TableRow></TableHead>
        <TableBody>{getTableRows()}</TableBody>
      </Table>
    </div>
  );

  const getEditLinks = () => {
    const formName = formSubmissions.length ? formSubmissions[0].form?.name + ".csv" : "form_submissions.csv";
    return (
      <>
        <ExportLink data={summaryCsv} spaceAfter={true} filename={formName} />
        <a aria-label="print-summary" href="about:blank" onClick={(e) => { e.preventDefault(); handleSummaryPrint(); }}><Icon>print</Icon></a>
      </>
    );
  }

  React.useEffect(() => { loadData() }, [props.formId]); //eslint-disable-line

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }} className="form-submission-summary">
        <div ref={contentRef} className="form-submission-summary">
          <DisplayBox headerText={Locale.label("forms.formSubmissions.subSum")} headerIcon="group" editContent={getEditLinks()}>
            <Grid container spacing={3}>{getSummary()}</Grid>
          </DisplayBox>
          <DisplayBox headerText={Locale.label("forms.formSubmissions.subRes")} headerIcon="group" help="chums/forms">
            {getFormSubmissions()}
          </DisplayBox>
        </div>
      </Grid>
    </Grid>
  );
}
