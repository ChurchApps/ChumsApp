import React, { useState } from "react";
import { ApiHelper, InputBox, QuestionInterface, ChoicesEdit, UniqueIdHelper } from ".";
import * as yup from "yup"
import { Formik } from "formik"
import { Form } from "react-bootstrap"

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  fieldType: yup.string().required("Type is required")
})

interface Props {
    questionId: string,
    formId: string,
    updatedFunction: () => void
}

export function FormQuestionEdit({ questionId, formId, updatedFunction }: Props) {
  const [question, setQuestion] = useState<QuestionInterface>({} as QuestionInterface);
  const initialValues: QuestionInterface = { title: "", fieldType: "Textbox", placeholder: "", description: "", choices: null, ...question }

  function loadData() {
    if (questionId) ApiHelper.get("/questions/" + questionId, "MembershipApi").then((data: QuestionInterface) => setQuestion(data));
    else setQuestion({ formId: formId, fieldType: "Textbox" } as QuestionInterface);
  }

  function handleSave(data: QuestionInterface) {
    ApiHelper.post("/questions", [data], "MembershipApi").then(() => updatedFunction());
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this question?")) {
      ApiHelper.delete("/questions/" + question.id, "MembershipApi").then(updatedFunction);
    }
  }

  React.useEffect(loadData, [questionId || formId]);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSave}
      initialValues={initialValues}
      enableReinitialize={true}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        isSubmitting
      }) => (
        <Form noValidate>
          <InputBox id="questionBox" headerIcon="fas fa-question" headerText="Edit Question" saveFunction={handleSubmit} cancelFunction={updatedFunction} isSubmitting={isSubmitting} deleteFunction={(!UniqueIdHelper.isMissing(questionId)) ? handleDelete : undefined}>
            <Form.Group>
              <Form.Label htmlFor="fieldType">Question Type</Form.Label>
              <Form.Control
                id="fieldType"
                as="select"
                name="fieldType"
                value={values.fieldType}
                onChange={handleChange}
              >
                <option value="Textbox">Textbox</option>
                <option value="Whole Number">Whole Number</option>
                <option value="Decimal">Decimal</option>
                <option value="Date">Date</option>
                <option value="Yes/No">Yes/No</option>
                <option value="Email">Email</option>
                <option value="Phone Number">Phone Number</option>
                <option value="Text Area">Text Area</option>
                <option value="Multiple Choice">Multiple Choice</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control
                id="title"
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                isInvalid={touched.title && !!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Form.Group>
            {
              values.fieldType === "Multiple Choice"
                ? <ChoicesEdit question={values} updatedFunction={setQuestion} />
                : (
                  <Form.Group>
                    <Form.Label>Placeholder (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="placeholder"
                      value={values.placeholder}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )
            }
          </InputBox>
        </Form>
      )}
    </Formik>
  );
}
