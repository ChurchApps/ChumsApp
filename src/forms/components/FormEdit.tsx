import React, { useState } from "react";
import { ApiHelper, InputBox, FormInterface } from ".";
import * as yup from "yup"
import { Formik } from "formik"
import { Form } from "react-bootstrap"

const schema = yup.object().shape({
  name: yup.string().required("Form name is required")
})

interface Props { formId: string, updatedFunction: () => void }

export function FormEdit({ formId, updatedFunction }: Props) {
  const [form, setForm] = useState<FormInterface>({} as FormInterface);
  const [showRestrictedOption, setShowRestrictedOption] = useState<boolean>(false);
  const initialValues: FormInterface = { name: "", contentType: "person", ...form }

  function loadData() {
    if (formId) {
      ApiHelper.get("/forms/" + formId, "MembershipApi").then((data: FormInterface) => setForm(data));
    }
  }

  function handleSave(data: FormInterface) {
    ApiHelper.post("/forms", [data], "MembershipApi")
      .then(() => {
        updatedFunction()
      })
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this form?")) {
      ApiHelper.delete("/forms/" + form.id, "MembershipApi")
        .then(() => updatedFunction());
    }
  }

  React.useEffect(loadData, [formId]);

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
          <InputBox id="formBox" headerIcon="fas fa-align-left" headerText="Edit Form" saveFunction={handleSubmit} isSubmitting={isSubmitting} cancelFunction={updatedFunction} deleteFunction={(formId) ? handleDelete : undefined}>
            <Form.Group>
              <Form.Label htmlFor="name">Form Name</Form.Label>
              <Form.Control
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={e => {
                  handleChange(e);
                  if (e.currentTarget.value === "form") setShowRestrictedOption(true);
                }}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Associate With</Form.Label>
              <Form.Control
                as="select"
                name="contentType"
                value={values.contentType}
                onChange={handleChange}
              >
                <option value="person">People</option>
                <option value="form">Stand Alone</option>
              </Form.Control>
            </Form.Group>
            { showRestrictedOption &&
              <Form.Group>
                <Form.Label>Form Access</Form.Label>
                <Form.Control
                  as="select"
                  name="restricted"
                  value={values.restricted?.toString() || "false"}
                  onChange={handleChange}
                >
                  <option value="false">Public</option>
                  <option value="true">Restrict</option>
                </Form.Control>
              </Form.Group>
            }
          </InputBox>
        </Form>
      )}
    </Formik>
  );
}
