import React from "react";
import { Form } from "react-bootstrap"
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { ServiceInterface, InputBox, ApiHelper, CampusInterface, UniqueIdHelper } from "./";

const schema = yup.object().shape({
  name: yup.string().required("Service name is required"),
  campusId: yup.string().required("Please select a campus")
})

interface Props {
    service: ServiceInterface,
    updatedFunction: () => void
}

export const ServiceEdit: React.FC<Props> = (props) => {
  const [service, setService] = React.useState({} as ServiceInterface);
  const [campuses, setCampuses] = React.useState([] as CampusInterface[]);

  const handleSave = (data: ServiceInterface, { setSubmitting }: FormikHelpers<ServiceInterface>) => {
    let s = { ...data };
    if (UniqueIdHelper.isMissing(s.campusId)) s.campusId = campuses[0].id;
    ApiHelper.post("/services", [s], "AttendanceApi").then(() => {
      setSubmitting(false)
      props.updatedFunction()
    });
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this service?")) ApiHelper.delete("/services/" + service.id, "AttendanceApi").then(props.updatedFunction); }

  const loadData = React.useCallback(() => {
    ApiHelper.get("/campuses", "AttendanceApi").then(data => {
      setCampuses(data);
      if (data.length > 0) {
        if (UniqueIdHelper.isMissing(service?.campusId)) {
          let s = { ...props.service };
          s.campusId = data[0].id;
          setService(s);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.service]);

  const getCampusOptions = () => {
    let options = [];
    for (let i = 0; i < campuses.length; i++) options.push(<option value={campuses[i].id}>{campuses[i].name}</option>);
    return options;
  }

  React.useEffect(() => {
    setService(props.service);
    loadData();
  }, [props.service, loadData]);

  if (service === null || service.id === undefined) return null;
  const serviceCopy = {...service}
  delete serviceCopy.campusId
  const initialValues: ServiceInterface = { name: "", campusId: service?.campusId || campuses[0]?.id, ...serviceCopy }

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
          <InputBox id="serviceBox" data-cy="service-box" cancelFunction={props.updatedFunction} saveFunction={handleSubmit} deleteFunction={handleDelete} headerText={service.name} headerIcon="far fa-calendar-alt" isSubmitting={isSubmitting}>
            <Form.Group>
              <Form.Label htmlFor="campus">
                Campus
              </Form.Label>
              <Form.Control
                id="campus"
                name="campusId"
                as="select"
                value={values.campusId}
                onChange={handleChange}
                isInvalid={touched.campusId && !!errors.campusId}
              >
                {getCampusOptions()}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.campusId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="name">
                Service Name
              </Form.Label>
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
          </InputBox>
        </Form>
      )}
    </Formik>

  );
}
