import React, { useState } from "react";
import { ApiHelper, InputBox, FormInterface, DateHelper } from ".";
import * as yup from "yup"
import { Formik } from "formik"
import { Form } from "react-bootstrap"

const schema = yup.object().shape({
  name: yup.string().required("Form name is required")
})

interface Props { formId: string, updatedFunction: () => void }

export function FormEdit({ formId, updatedFunction }: Props) {
  const [form, setForm] = useState<FormInterface>({} as FormInterface);
  const [standAloneForm, setStandAloneForm] = useState<boolean>(false);
  const [showDates, setShowDates] = useState<boolean>(false);
  const initialValues: FormInterface = { name: "", contentType: "person", ...form }

  function loadData() {
    if (formId) {
      ApiHelper.get("/forms/" + formId, "MembershipApi").then((data: FormInterface) => {
        if (data.restricted !== undefined && data.contentType === "form") setStandAloneForm(true);
        setForm(data);
        setShowDates(!!data.accessEndTime);
      });
    }
  }

  function handleSave(data: FormInterface) {
    data.restricted = (data.restricted?.toString() === "true");
    data.accessStartTime = showDates ? DateHelper.convertDatePickerFormat(data.accessStartTime) : null;
    data.accessEndTime = showDates ? DateHelper.convertDatePickerFormat(data.accessEndTime) : null;
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
                onChange={handleChange}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            { !formId
              && <Form.Group>
                <Form.Label>Associate With</Form.Label>
                <Form.Control
                  as="select"
                  name="contentType"
                  value={values.contentType}
                  onChange={e => {
                    handleChange(e);
                    if (e.currentTarget.value === "form") setStandAloneForm(true);
                  }}
                >
                  <option value="person">People</option>
                  <option value="form">Stand Alone</option>
                </Form.Control>
              </Form.Group>
            }
            { standAloneForm
              && <>
                <Form.Group>
                  <Form.Label>Form Access</Form.Label>
                  <Form.Control
                    as="select"
                    name="restricted"
                    value={values.restricted?.toString() || "false"}
                    onChange={handleChange}
                  >
                    <option value="false">Public</option>
                    <option value="true">Restricted</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    checked={showDates}
                    name="limit"
                    label="Set Form Availability Timeframe"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => setShowDates(e.currentTarget.checked)}
                  />
                </Form.Group>
              </>
            }
            { showDates
              && <>
                <Form.Group>
                  <Form.Label>Availability Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="accessStartTime"
                    max={DateHelper.formatHtml5Date(values.accessEndTime)}
                    value={DateHelper.formatHtml5Date(values.accessStartTime)}
                    onChange={handleChange}
                  >
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Availability End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="accessEndTime"
                    min={new Date(values.accessStartTime) > new Date() ? DateHelper.formatHtml5Date(values.accessStartTime) : DateHelper.formatHtml5Date(new Date())}
                    value={DateHelper.formatHtml5Date(values.accessEndTime)}
                    onChange={handleChange}
                  >
                  </Form.Control>
                </Form.Group>
              </>
            }
          </InputBox>
        </Form>
      )}
    </Formik>
  );
}
