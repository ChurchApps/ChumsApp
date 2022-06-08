import React from "react";
import { Form } from "react-bootstrap"
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { ServiceTimeInterface, ServiceInterface, InputBox, ApiHelper } from "./";

const schema = yup.object().shape({
  name: yup.string().required("Service time is required"),
  serviceId: yup.string().required("Please select a service")
})

interface Props {
  serviceTime: ServiceTimeInterface,
  updatedFunction: () => void
}

export const ServiceTimeEdit: React.FC<Props> = (props) => {
  const [serviceTime, setServiceTime] = React.useState({} as ServiceTimeInterface);
  const [services, setServices] = React.useState([] as ServiceInterface[]);

  const handleSave = (data: ServiceTimeInterface, { setSubmitting }: FormikHelpers<ServiceTimeInterface>) => {
    ApiHelper.post("/servicetimes", [data], "AttendanceApi").then(() => {
      setSubmitting(false)
      props.updatedFunction()
    });
  }
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this service time?")) ApiHelper.delete("/servicetimes/" + serviceTime.id, "AttendanceApi").then(props.updatedFunction); }

  const loadData = React.useCallback(() => {
    ApiHelper.get("/services", "AttendanceApi").then(data => {
      setServices(data);
      if (data.length > 0) {
        let st = { ...props.serviceTime };
        st.serviceId = data[0].id;
        setServiceTime(st);
      }
    });
  }, [props.serviceTime]);

  const getServiceOptions = () => {
    let options = [];
    for (let i = 0; i < services.length; i++) options.push(<option value={services[i].id}>{services[i].name}</option>);
    return options;
  }

  React.useEffect(() => {
    setServiceTime(props.serviceTime);
    loadData();
  }, [props.serviceTime, loadData]);

  const serviceTimeCopy = { ...serviceTime }
  delete serviceTimeCopy.serviceId
  const initialValues: ServiceTimeInterface = { name: "", serviceId: serviceTime?.serviceId || services[0]?.id, ...serviceTimeCopy }

  if (serviceTime === null || serviceTime.id === undefined) return null;
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
          <InputBox id="serviceTimeBox" data-cy="service-time-box" cancelFunction={props.updatedFunction} saveFunction={handleSubmit} deleteFunction={props.serviceTime?.id ? handleDelete : null} headerText={serviceTime.name} isSubmitting={isSubmitting} headerIcon="schedule">
            <Form.Group>
              <Form.Label htmlFor="service">Service</Form.Label>
              <Form.Control
                id="service"
                name="serviceId"
                as="select"
                value={values.serviceId}
                onChange={handleChange}
                isInvalid={touched.serviceId && !!errors.serviceId}
              >
                {getServiceOptions()}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.serviceId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="name">Service Time Name</Form.Label>
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
