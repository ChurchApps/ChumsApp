import React from "react";
import { AnswerInterface, QuestionInterface } from "./";
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, TextField } from "@mui/material";

interface Props {
    answer: AnswerInterface
    question: QuestionInterface,
    changeFunction: (questionId: string, value: string) => void
}

export const QuestionEdit: React.FC<Props> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    props.changeFunction(props.question.id, e.target.value);
  }
  let q = props.question;

  if (q.fieldType === "Heading") return <h5>{q.title}</h5>;
  else {
    let input = null;
    let choiceOptions = [];
    if (q.choices !== undefined && q.choices !== null) {
      for (let i = 0; i < q.choices.length; i++) choiceOptions.push(<MenuItem key={i} value={q.choices[i].value}>{q.choices[i].text}</MenuItem>);
    }

    let answerValue = (props.answer === null) ? "" : props.answer.value
    switch (q.fieldType) {
      case "Textbox": input = <TextField fullWidth label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      case "Multiple Choice": {
        input = (
          <FormControl fullWidth>
            <InputLabel>{q.title}</InputLabel>
            <Select fullWidth label={q.title} value={answerValue} onChange={handleChange}>{choiceOptions}</Select>
          </FormControl>);
        break;
      }
      case "Yes/No": {
        input = (
          <FormControl fullWidth>
            <InputLabel>{q.title}</InputLabel>
            <Select fullWidth label={q.title} value={answerValue} onChange={handleChange}>
              <MenuItem value="False">No</MenuItem>
              <MenuItem value="True">Yes</MenuItem>
            </Select>
          </FormControl>);
        break;
      }
      case "Whole Number":
      case "Decimal":
        input = <TextField fullWidth type="number" label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />;
        break;
      case "Date": input = <TextField fullWidth type="date" InputLabelProps={{shrink: true}} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      case "Phone Number": input = <TextField fullWidth type="number" label={q.title} placeholder="555-555-5555" value={answerValue} onChange={handleChange} />; break;
      case "Email": input = <TextField fullWidth type="email" label={q.title} placeholder="john@doe.com" value={answerValue} onChange={handleChange} />; break;
      case "Text Area": input = <TextField fullWidth multiline rows={4} label={q.title} placeholder={q.placeholder} value={answerValue} onChange={handleChange} />; break;
      default: return null;
    }
    return input;
  }

}

