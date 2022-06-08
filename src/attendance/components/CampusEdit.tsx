import React from "react";
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { Form } from "react-bootstrap"
import { CampusInterface, InputBox, ApiHelper } from "./";

const schema = yup.object().shape({
  name: yup.string().required("Campus name is required")
})

interface Props { campus: CampusInterface, updatedFunction: () => void }

export const CampusEdit: React.FC<Props> = (props) => {
  const [campus, setCampus] = React.useState({} as CampusInterface);

  const handleSave = (campus: CampusInterface, { setSubmitting }: FormikHelpers<CampusInterface>) => {
    ApiHelper.post("/campuses", [campus], "AttendanceApi").then(() => {
      setSubmitting(false)
      props.updatedFunction()
    });
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this campus?")) ApiHelper.delete("/campuses/" + campus.id, "AttendanceApi").then(props.updatedFunction); }

  React.useEffect(() => setCampus(props.campus), [props.campus]);

  if (campus === null || campus.id === undefined) return null;
  const initialValues: CampusInterface = { name: "", ...campus }

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
        <InputBox id="campusBox" data-cy="campus-box" cancelFunction={props.updatedFunction} saveFunction={handleSubmit} deleteFunction={props.campus?.id ? handleDelete : null} headerText={campus.name} headerIcon="church" isSubmitting={isSubmitting}>
          <Form.Group>
            <Form.Label htmlFor="campusName">Campus Name</Form.Label>
            <Form.Control
              id="campusName"
              type="text"
              name="name"
              className="form-control"
              value={values.name}
              onChange={handleChange}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </InputBox>
      )}

    </Formik>
  );
}
