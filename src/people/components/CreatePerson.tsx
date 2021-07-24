import React from "react"
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { Form, Row, Col, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { UserHelper, Permissions, NameInterface, PersonInterface, HouseholdInterface, ApiHelper } from "."

const schema = yup.object().shape({
  first: yup.string().required("Please enter a first name."),
  last: yup.string().required("Please enter a last name.")
})

export function CreatePerson() {
  const initialValues: NameInterface = { first: "", last: "" }
  const history = useHistory()

  function handleSubmit(name: NameInterface, helpers: FormikHelpers<NameInterface>) {
    let person = { name } as PersonInterface;
    let household = { name: name.last } as HouseholdInterface;
    ApiHelper.post("/households", [household], "MembershipApi").then(data => {
      household.id = data[0].id;
      person.householdId = household.id;
      ApiHelper.post("/people", [person], "MembershipApi").then(data => {
        person.id = data[0].id
        history.push("/people/" + person.id);
      }).finally(() => {
        helpers?.setSubmitting(false)
      });
    })
  }

  if (!UserHelper.checkAccess(Permissions.membershipApi.people.edit)) return null;
  return (
    <div>
      <p className="pl-1 mb-2 text-dark"><b>Add a New Person</b></p>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          isSubmitting
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col className="pr-0">
                <Form.Group>
                  <Form.Control
                    aria-label="firstName"
                    placeholder="First Name"
                    name="first"
                    value={values.first}
                    onChange={handleChange}
                    isInvalid={touched.first && !!errors.first}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.first}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col className="pr-0">
                <Form.Group>
                  <Form.Control
                    aria-label="lastName"
                    placeholder="Last Name"
                    name="last"
                    value={values.last}
                    onChange={handleChange}
                    isInvalid={touched.last && !!errors.last}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.last}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Button type="submit" variant="primary" disabled={isSubmitting}>Add</Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  )
}
