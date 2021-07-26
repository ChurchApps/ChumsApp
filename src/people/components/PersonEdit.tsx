import React, { useCallback, useState } from "react";
import { PersonHelper, DateHelper, StateOptions, InputBox, ApiHelper, PersonInterface, UpdateHouseHold, ErrorMessages, ValidateHelper, Loading } from "."
import { Redirect } from "react-router-dom";
import { Row, Col, FormControl, FormGroup, FormLabel, Button, Form } from "react-bootstrap";
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"

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
  togglePhotoEditor: (show: boolean) => void,
  person: PersonInterface,
  showMergeSearch: () => void
}

export function PersonEdit(props: Props) {
  const [person, setPerson] = useState<PersonInterface>({} as PersonInterface);
  const [redirect, setRedirect] = useState("");
  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState<boolean>(false)
  const [text, setText] = useState("");
  const [members, setMembers] = useState<PersonInterface[]>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let p = { ...person };
    const key = e.currentTarget.name;
    const val = e.currentTarget.value;
    switch (key) {
      case "firstName": p.name.first = val; break;
      case "middleName": p.name.middle = val; break;
      case "lastName": p.name.last = val; break;
      case "nickName": p.name.nick = val; break;
      case "membershipStatus": p.membershipStatus = val; break;
      case "gender": p.gender = val; break;
      case "birthDate":
        if (val === "") p.birthDate = null; else p.birthDate = new Date(val);
        break;
      case "maritalStatus": p.maritalStatus = val; break;
      case "anniversary":
        if (val === "") p.anniversary = null; else p.anniversary = new Date(val);
        break;
      case "address1": p.contactInfo.address1 = val; break;
      case "address2": p.contactInfo.address2 = val; break;
      case "city": p.contactInfo.city = val; break;
      case "state": p.contactInfo.state = val; break;
      case "zip": p.contactInfo.zip = val; break;
      case "homePhone": p.contactInfo.homePhone = formattedPhoneNumber(val); break;
      case "workPhone": p.contactInfo.workPhone = formattedPhoneNumber(val); break;
      case "mobilePhone": p.contactInfo.mobilePhone = formattedPhoneNumber(val); break;
      case "email": p.contactInfo.email = val; break;
    }
    setPerson(p);
  }

  const formattedPhoneNumber = (value: string) => {
    value = value.replace(/[^0-9-]/g, "");
    value = value.replaceAll("-", "");

    if (value.length > 3 && value.length <= 6)
      value = value.slice(0, 3) + "-" + value.slice(3);
    else if (value.length > 6)
      value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);

    return value;
  }

  const handleCancel = () => props.updatedFunction();

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this person record?"))
      ApiHelper.delete("/people/" + person.id.toString(), "MembershipApi").then(() => setRedirect("/people"));
  }

  const handleSave = () => {
    let errors: string[] = [];
    const { name: { first, last }, contactInfo: contactFromState, birthDate } = person;

    if (!first.trim()) {
      errors.push("First name is required");
    } else person.name.first = first.trim();
    if (!last.trim()) {
      errors.push("Last name is requried");
    } else person.name.last = last.trim();
    if (contactFromState.email && !ValidateHelper.email(contactFromState.email)) errors.push("Enter a valid email address");
    if (birthDate && birthDate > new Date()) errors.push("Enter a valid birth date");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const { contactInfo: contactFromProps } = props.person
    if (members && members.length > 1 && PersonHelper.compareAddress(contactFromProps, contactFromState)) {
      setText(`You updated the address to ${PersonHelper.addressToString(contactFromState)} for ${person.name.display}.  Would you like to apply that to the entire ${person.name.last} family?`)
      setShowUpdateAddressModal(true)
      return;
    }
    updatePerson(person)
  }

  const updatePerson = (person: PersonInterface) => {
    ApiHelper.post("/people/", [person], "MembershipApi")
      .then(data => {
        let p = { ...person };
        p.id = data[0];
        p.name.display = PersonHelper.getDisplayName(p.name.first, p.name.last, p.name.nick);
        setPerson(p);
        props.updatedFunction();
      });
  }

  const personChanged = useCallback(() => {
    const personDeepCopy: PersonInterface = {
      ...props.person,
      contactInfo: {
        ...props.person?.contactInfo
      },
      name: {
        ...props.person?.name
      }
    }
    setPerson(personDeepCopy)
  }, [props.person]);

  const handleYes = async () => {
    setShowUpdateAddressModal(false)
    await Promise.all(
      members.map(async member => {
        member.contactInfo = PersonHelper.changeOnlyAddress(member.contactInfo, person.contactInfo)
        try {
          await ApiHelper.post("/people", [member], "MembershipApi");
        } catch (err) {
          console.log(`error in updating ${person.name.display}"s address`);
        }
      })

    )
    props.updatedFunction()
  }

  const handleNo = () => {
    setShowUpdateAddressModal(false)
    updatePerson(person)
  }

  const fetchMembers = () => {
    try {
      if (props.person.householdId != null) {
        ApiHelper.get("/people/household/" + props.person.householdId, "MembershipApi").then(data => {
          setMembers(data);
        });
      }
    } catch (err) {
      console.log(`Error occured in fetching household members`);
    }
  }

  const handleMerge = () => {
    props.showMergeSearch();
  }

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.togglePhotoEditor(true);
  }

  React.useEffect(personChanged, [props.person]);
  React.useEffect(fetchMembers, [props.person]);

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
    ...props.person
  }
  const editForm = (
    !person
      ? <Loading />
      : (
        <Formik
          validationSchema={schema}
          onSubmit={console.log}
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
            <InputBox headerIcon="fas fa-user" headerText="Personal Details" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSubmit} isSubmitting={isSubmitting} headerActionContent={<Button id="mergeButton" variant="primary" size="sm" onClick={handleMerge}>Merge</Button>}>
              <Row>
                <Col sm={3} className="my-auto">
                  <a href="about:blank" className="d-block" onClick={handlePhotoClick}>
                    <img src={PersonHelper.getPhotoUrl(props.person)} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="avatar" />
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
                          onKeyDown={handleKeyDown}
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
                          onKeyDown={handleKeyDown}
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
                          onKeyDown={handleKeyDown}
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
                          onKeyDown={handleKeyDown}
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
                      onKeyDown={handleKeyDown}
                    />
                  </FormGroup>
                </Col>
                <Col lg={4} md={4}>
                  <FormGroup>
                    <FormLabel htmlFor="membershipStatus">Membership Status</FormLabel>
                    <FormControl as="select" name="membershipStatus" id="membershipStatus" value={values.membershipStatus || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                      <option value="Visitor">Visitor</option>
                      <option value="Member">Member</option>
                      <option value="Staff">Staff</option>
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={4} md={4}>
                  <FormGroup>
                    <FormLabel htmlFor="birthDate">Birthdate</FormLabel>
                    <FormControl type="date" name="birthDate" id="birthDate" value={DateHelper.formatHtml5Date(values?.birthDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col lg={4} md={4}>
                  <FormGroup>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <FormControl as="select" name="gender" id="gender" value={values?.gender || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                      <option value="Unspecified">Unspecified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </FormControl>
                  </FormGroup>
                </Col>
                <Col lg={4} md={4}>
                  <FormGroup>
                    <FormLabel htmlFor="maritalStatus">Marital Status</FormLabel>
                    <FormControl as="select" name="maritalStatus" id="maritalStatus" value={values?.maritalStatus || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
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
                    <FormControl type="date" name="anniversary" id="anniversary" value={DateHelper.formatHtml5Date(values?.anniversary)} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={9}>
                  <div className="section">Address</div>
                  <FormGroup>
                    <FormLabel htmlFor="address1">Line 1</FormLabel>
                    <FormControl name="contactInfo.address1" id="address1" value={values.contactInfo?.address1 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel htmlFor="address2">Line 2</FormLabel>
                    <FormControl name="contactInfo.address2" id="address2" value={values.contactInfo?.address2 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                  </FormGroup>
                  <Row>
                    <Col xs={6}>
                      <FormGroup>
                        <FormLabel htmlFor="city">City</FormLabel>
                        <FormControl type="text" name="contactInfo.city" id="city" value={values.contactInfo?.city || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={3}>
                      <FormGroup>
                        <FormLabel htmlFor="state">State</FormLabel>
                        <FormControl as="select" name="contactInfo.state" id="state" value={values.contactInfo?.state || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                          <StateOptions />
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col xs={3}>
                      <FormGroup>
                        <FormLabel htmlFor="zip">Zip</FormLabel>
                        <FormControl type="text" name="contactInfo.zip" id="zip" value={values.contactInfo?.zip || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
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
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
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
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
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
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      isInvalid={touched.contactInfo?.mobilePhone && !!errors.contactInfo?.mobilePhone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactInfo?.mobilePhone}
                    </Form.Control.Feedback>
                  </FormGroup>
                </Col>
              </Row>
            </InputBox>
          )}
        </Formik>
      )
  )

  if (redirect !== "") return <Redirect to={redirect} />
  else {
    return (
      <>
        <UpdateHouseHold show={showUpdateAddressModal} text={text} onHide={() => setShowUpdateAddressModal(false)} handleNo={handleNo} handleYes={handleYes} />
        {editForm}
      </>
    )
  }
}
