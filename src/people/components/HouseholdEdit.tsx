import React, { ChangeEvent } from "react"
import { InputBox, PersonAdd, PersonHelper, ApiHelper, HouseholdInterface, PersonInterface, UpdateHouseHold } from "."
import { Table, Form } from "react-bootstrap"
import * as yup from "yup"
import { Formik, FormikHelpers } from "formik"
import { Icon } from "@mui/material"

const schema = yup.object().shape({
  name: yup.string().required("Household name is required")
})

interface Props { updatedFunction: () => void, household: HouseholdInterface, members: PersonInterface[], person: PersonInterface }

export function HouseholdEdit({ updatedFunction, household, members: currentMembers, person: currentPerson }: Props) {
  const [members, setMembers] = React.useState<PersonInterface[]>([...currentMembers]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showUpdateAddressModal, setShowUpdateAddressModal] = React.useState<boolean>(false)
  const [text, setText] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<PersonInterface>(null)
  const initialValues: HouseholdInterface = { name: "", ...household }

  function handleRemove(index: number) {
    let m = [...members];
    m.splice(index, 1);
    setMembers(m);
  }

  function handleChangeRole(e: ChangeEvent<HTMLSelectElement>, index: number) {
    let m = [...members];
    m[index].householdRole = e.currentTarget.value;
    setMembers(m);
  }

  function handlePersonAdd(person: PersonInterface) {
    setSelectedPerson(person);
    if (!PersonHelper.checkAddressAvailabilty(person)) {
      addPerson(person);
      return;
    }
    setText(`Would you like to update ${person.name.first}"s address to match ${currentPerson.name.first}"s (${PersonHelper.addressToString(currentPerson.contactInfo)})?`);
    setShowUpdateAddressModal(true);
  }

  function addPerson(person?: PersonInterface) {
    const addPerson: PersonInterface = person || selectedPerson;
    addPerson.householdId = household.id;
    addPerson.householdRole = "Other";
    let m = [...members];
    m.push(addPerson);
    setMembers(m);
  }

  function handleSave(values: HouseholdInterface, { setSubmitting }: FormikHelpers<HouseholdInterface>) {
    let promises = [];
    promises.push(ApiHelper.post("/households", [values], "MembershipApi"));
    promises.push(ApiHelper.post("/people/household/" + values.id, members, "MembershipApi"));
    Promise.all(promises).then(() => updatedFunction()).finally(() => setSubmitting(false));
  }

  function handleNo() {
    setShowUpdateAddressModal(false);
    addPerson();
  }

  async function handleYes() {
    setShowUpdateAddressModal(false);
    selectedPerson.contactInfo = PersonHelper.changeOnlyAddress(selectedPerson.contactInfo, currentPerson.contactInfo);
    try {
      await ApiHelper.post("/people", [selectedPerson], "MembershipApi");
    } catch (err) {
      console.log(`error in updating ${selectedPerson.name.display}"s address`);
    }
    addPerson();
  }

  const rows = members.map((m, index) => (
    <tr key={m.id}>
      <td><img src={PersonHelper.getPhotoUrl(m)} alt="avatar" /></td>
      <td>
        {m.name.display}
        <select value={m.householdRole || ""} aria-label="role" onChange={(e) => handleChangeRole(e, index)} className="form-control form-control-sm">
          <option value="Head">Head</option>
          <option value="Spouse">Spouse</option>
          <option value="Child">Child</option>
          <option value="Other">Other</option>
        </select>
      </td>
      <td><button onClick={() => handleRemove(index)} className="text-danger no-default-style"><Icon>person_remove</Icon> Remove</button></td>
    </tr>
  ))

  let personAdd = (showAdd) ? <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} person={currentPerson} /> : null;
  return (
    <>
      <UpdateHouseHold show={showUpdateAddressModal} onHide={() => setShowUpdateAddressModal(false)} handleNo={handleNo} handleYes={handleYes} text={text} />
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
          <InputBox id="householdBox" headerIcon="group" headerText={values.name + " Household"} isSubmitting={isSubmitting} saveFunction={handleSubmit} cancelFunction={updatedFunction}>
            <Form noValidate>
              <Form.Group>
                <Form.Label htmlFor="name">Household Name</Form.Label>
                <Form.Control
                  name="name"
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
            <Table size="sm" id="householdMemberTable">
              <tbody>
                {rows}
                <tr><td></td><td></td><td><button className="text-success no-default-style" aria-label="addMember" onClick={() => setShowAdd(true)}> <Icon>person_add</Icon> Add</button></td></tr>
              </tbody>
            </Table>
            {personAdd}
          </InputBox>
        )}
      </Formik>
    </>
  );
}
