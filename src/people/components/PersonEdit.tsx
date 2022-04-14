import React, {useState, useRef} from "react";
import {PersonHelper, DateHelper, StateOptions, InputBox, ApiHelper, PersonInterface, UpdateHouseHold, Loading} from "."
import {Navigate} from "react-router-dom";
import {Row, Col, FormControl, FormGroup, FormLabel, Button, Form} from "react-bootstrap";
import * as yup from "yup"
import {Formik, FormikHelpers} from "formik"
import UserContext from "../../UserContext";

const schema = yup.object().shape({
  name: yup.object().shape({
    first: yup.string().required("First Name is required"),
    last: yup.string().required("Last Name is required")
  }),
  contactInfo: yup.object().shape({
    email: yup.string().optional().nullable().email("Please enter a valid email address."),
    mobilePhone: yup.string().optional().nullable().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid"),
    workPhone: yup.string().optional().nullable().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid"),
    homePhone: yup.string().optional().nullable().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid")
  })
})

interface Props {
  id?: string,
  updatedFunction: () => void,
  togglePhotoEditor: (show: boolean, inProgressEditPerson: PersonInterface) => void,
  person: PersonInterface,
  showMergeSearch: () => void
}

export function PersonEdit({id, updatedFunction, togglePhotoEditor, person, showMergeSearch}: Props) {
  const context = React.useContext(UserContext);
  const [updatedPerson, setUpdatedPerson] = useState<PersonInterface>({name: {}, contactInfo: {}})
  const [redirect, setRedirect] = useState("");
  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState<boolean>(false)
  const [text, setText] = useState("");
  const [members, setMembers] = useState<PersonInterface[]>(null);
  const formRef = useRef(null)

  const initialValues: PersonInterface = {
    name: {
      first: "",
      last: "",
      middle: "",
      nick: "",
      display: ""
    },
    contactInfo: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      homePhone: "",
      workPhone: "",
      mobilePhone: ""
    },
    membershipStatus: "",
    gender: "",
    birthDate: null,
    maritalStatus: "",
    ...person
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this person record?"))
      ApiHelper.delete("/people/" + initialValues.id.toString(), "MembershipApi").then(() => setRedirect("/people"));
  }

  async function handleSave(data: PersonInterface, {setSubmitting}: FormikHelpers<PersonInterface>) {
    const {contactInfo: contactFromProps} = person

    if (PersonHelper.getExpandedPersonObject(person).id === context.person.id) {
      context.setProfilePicture(person.photo || PersonHelper.getPhotoUrl(person))
    }

    if (members && members.length > 1 && PersonHelper.compareAddress(contactFromProps, data.contactInfo)) {
      setText(`You updated the address to ${PersonHelper.addressToString(data.contactInfo)} for ${data.name.display}.  Would you like to apply that to the entire ${data.name.last} family?`)
      setShowUpdateAddressModal(true)
      setUpdatedPerson({...data})
      return;
    }
    await updatePerson(data)
    setSubmitting(false)
  }

  function updatePerson(person: PersonInterface) {
    return ApiHelper.post("/people/", [person], "MembershipApi")
      .then(() => {
        updatedFunction();
      });
  }

  async function handleYes() {
    setShowUpdateAddressModal(false)
    await Promise.all(
      members.map(async member => {
        member.contactInfo = PersonHelper.changeOnlyAddress(member.contactInfo, updatedPerson.contactInfo)
        try {
          await ApiHelper.post("/people", [member], "MembershipApi");
        } catch (err) {
          console.log(`error in updating ${updatedPerson.name.display}"s address`);
        }
      })
    )
    updatedFunction()
  }

  function handleNo() {
    setShowUpdateAddressModal(false)
    updatePerson(updatedPerson)
  }

  function fetchMembers() {
    try {
      if (person.householdId != null) {
        ApiHelper.get("/people/household/" + person.householdId, "MembershipApi").then(data => {
          setMembers(data);
        });
      }
    } catch (err) {
      console.log(`Error occured in fetching household members`);
    }
  }

  function handlePhotoClick(e: React.MouseEvent) {
    e.preventDefault();
    const values = formRef.current.values
    togglePhotoEditor(true, values);
  }

  function formattedPhoneNumber(value: string) {
    value = value.replace(/[^0-9-]/g, "");
    value = value.replaceAll("-", "");

    if (value.length > 3 && value.length <= 6)
      value = value.slice(0, 3) + "-" + value.slice(3);
    else if (value.length > 6)
      value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);

    return value;
  }

  React.useEffect(fetchMembers, [person]);

  const editForm = (
    !person
      ? <Loading />
      : (
        <Formik
          validationSchema={schema}
          onSubmit={handleSave}
          initialValues={initialValues}
          enableReinitialize={true}
          innerRef={formRef}
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
              <InputBox headerIcon="fas fa-user" headerText="Personal Details" cancelFunction={updatedFunction} deleteFunction={handleDelete} saveFunction={handleSubmit} isSubmitting={isSubmitting} headerActionContent={<Button id="mergeButton" variant="primary" size="sm" onClick={showMergeSearch}>Merge</Button>}>
                <Row>
                  <Col sm={3} className="my-auto">
                    <a href="about:blank" className="d-block" onClick={handlePhotoClick}>
                      <img src={PersonHelper.getPhotoUrl(person)} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="avatar" />
                    </a>
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <FormLabel htmlFor="first">First Name</FormLabel>
                          <FormControl
                            name="name.first"
                            id="first"
                            value={values.name.first || ""}
                            onChange={handleChange}
                            isInvalid={touched.name?.first && !!errors.name?.first}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name?.first}
                          </Form.Control.Feedback>
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <FormLabel htmlFor="last">Last Name</FormLabel>
                          <FormControl
                            name="name.last"
                            id="last"
                            value={values.name.last || ""}
                            onChange={handleChange}
                            isInvalid={touched.name?.last && !!errors.name?.last}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name?.last}
                          </Form.Control.Feedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <FormLabel htmlFor="middle">Middle Name</FormLabel>
                          <FormControl
                            name="name.middle"
                            id="middle"
                            value={values.name.middle || ""}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl
                            type="text"
                            name="contactInfo.email"
                            id="email"
                            value={values.contactInfo.email || ""}
                            onChange={handleChange}
                            isInvalid={touched.contactInfo?.email && !!errors.contactInfo?.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.contactInfo?.email}
                          </Form.Control.Feedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="nick">Nickname</FormLabel>
                      <FormControl
                        name="name.nick"
                        id="nick"
                        value={values.name.nick || ""}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="membershipStatus">Membership Status</FormLabel>
                      <FormControl as="select" name="membershipStatus" id="membershipStatus" value={values.membershipStatus || ""} onChange={handleChange}>
                        <option value="Visitor">Visitor</option>
                        <option value="Member">Member</option>
                        <option value="Staff">Staff</option>
                      </FormControl>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="birthDate">Birthdate</FormLabel>
                      <FormControl type="date" name="birthDate" id="birthDate" value={DateHelper.formatHtml5Date(values?.birthDate)} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="gender">Gender</FormLabel>
                      <FormControl as="select" name="gender" id="gender" value={values?.gender || ""} onChange={handleChange}>
                        <option value="Unspecified">Unspecified</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </FormControl>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="maritalStatus">Marital Status</FormLabel>
                      <FormControl as="select" name="maritalStatus" id="maritalStatus" value={values?.maritalStatus || ""} onChange={handleChange}>
                        <option value="Unknown">Unknown</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </FormControl>
                    </FormGroup>
                  </Col>
                  <Col lg={4} md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="anniversary">Anniversary</FormLabel>
                      <FormControl type="date" name="anniversary" id="anniversary" value={DateHelper.formatHtml5Date(values?.anniversary)} onChange={handleChange} />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={9}>
                    <div className="section">Address</div>
                    <FormGroup>
                      <FormLabel htmlFor="address1">Line 1</FormLabel>
                      <FormControl name="contactInfo.address1" id="address1" value={values.contactInfo?.address1 || ""} onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel htmlFor="address2">Line 2</FormLabel>
                      <FormControl name="contactInfo.address2" id="address2" value={values.contactInfo?.address2 || ""} onChange={handleChange} />
                    </FormGroup>
                    <Row>
                      <Col xs={6}>
                        <FormGroup>
                          <FormLabel htmlFor="city">City</FormLabel>
                          <FormControl type="text" name="contactInfo.city" id="city" value={values.contactInfo?.city || ""} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                      <Col xs={3}>
                        <FormGroup>
                          <FormLabel htmlFor="state">State</FormLabel>
                          <FormControl as="select" name="contactInfo.state" id="state" value={values.contactInfo?.state || ""} onChange={handleChange}>
                            <StateOptions />
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col xs={3}>
                        <FormGroup>
                          <FormLabel htmlFor="zip">Zip</FormLabel>
                          <FormControl type="text" name="contactInfo.zip" id="zip" value={values.contactInfo?.zip || ""} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={3}>
                    <div className="section">Phone</div>
                    <FormGroup>
                      <FormLabel htmlFor="homePhone">Home</FormLabel>
                      <FormControl
                        type="text"
                        name="contactInfo.homePhone"
                        maxLength={12} id="homePhone"
                        value={values.contactInfo?.homePhone || ""}
                        onChange={e => {
                          e.target.value = formattedPhoneNumber(e.target.value)
                          handleChange(e)
                        }}
                        isInvalid={touched.contactInfo?.homePhone && !!errors.contactInfo?.homePhone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactInfo?.homePhone}
                      </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel htmlFor="workPhone">Work</FormLabel>
                      <FormControl
                        type="text"
                        name="contactInfo.workPhone"
                        maxLength={12}
                        id="workPhone"
                        value={values.contactInfo?.workPhone || ""}
                        onChange={e => {
                          e.target.value = formattedPhoneNumber(e.target.value)
                          handleChange(e)
                        }}
                        isInvalid={touched.contactInfo?.workPhone && !!errors.contactInfo?.workPhone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactInfo?.workPhone}
                      </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel htmlFor="mobilePhone">Mobile</FormLabel>
                      <FormControl
                        type="text"
                        name="contactInfo.mobilePhone"
                        maxLength={12} id="mobilePhone"
                        value={values.contactInfo?.mobilePhone || ""}
                        onChange={e => {
                          e.target.value = formattedPhoneNumber(e.target.value)
                          handleChange(e)
                        }}
                        isInvalid={touched.contactInfo?.mobilePhone && !!errors.contactInfo?.mobilePhone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactInfo?.mobilePhone}
                      </Form.Control.Feedback>
                    </FormGroup>
                  </Col>
                </Row>
              </InputBox>
            </Form>
          )}
        </Formik>
      )
  )

  if (redirect !== "") return <Navigate to={redirect} />
  else {
    return (
      <>
        <UpdateHouseHold show={showUpdateAddressModal} text={text} onHide={() => setShowUpdateAddressModal(false)} handleNo={handleNo} handleYes={handleYes} />
        {editForm}
      </>
    )
  }
}
