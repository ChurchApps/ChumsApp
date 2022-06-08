import React from "react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Form } from "react-bootstrap"
import { ApiHelper, GroupInterface, InputBox } from ".";

const schema = yup.object().shape({
  categoryName: yup.string().required("Category name is required"),
  name: yup.string().required("Group name is required")
})

interface Props { updatedFunction: () => void }

export const GroupAdd: React.FC<Props> = (props) => {
  const handleCancel = () => { props.updatedFunction(); };
  const handleAdd = (data: GroupInterface, { setSubmitting }: FormikHelpers<GroupInterface>) => {
    ApiHelper.post("/groups", [data], "MembershipApi").finally(() => {
      setSubmitting(false)
      props.updatedFunction()
    });
  };

  const initialValues: GroupInterface = { categoryName: "", name: "" }

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleAdd}
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
        <InputBox headerText="Group Members" headerIcon="group" cancelFunction={handleCancel} saveFunction={handleSubmit} saveText="Add Group" isSubmitting={isSubmitting}>
          <Form noValidate>
            <Form.Group>
              <Form.Label htmlFor="categoryName">
                Category Name
              </Form.Label>
              <Form.Control
                type="text"
                id="categoryName"
                name="categoryName"
                value={values.categoryName}
                onChange={handleChange}
                isInvalid={touched.categoryName && !!errors.categoryName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.categoryName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="groupName">
                Group Name
              </Form.Label>
              <Form.Control
                type="text"
                id="groupName"
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </InputBox>
      )}
    </Formik>

  );
}

