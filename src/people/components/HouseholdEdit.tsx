import React, { ChangeEvent } from "react"
import { InputBox, PersonAdd, PersonHelper, ApiHelper, HouseholdInterface, PersonInterface, UpdateHouseHold, ErrorMessages } from "."
import { Icon, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material"

interface Props { updatedFunction: () => void, household: HouseholdInterface, currentMembers: PersonInterface[], currentPerson: PersonInterface }

export function HouseholdEdit(props: Props) {
  const [members, setMembers] = React.useState<PersonInterface[]>([...props.currentMembers]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showUpdateAddressModal, setShowUpdateAddressModal] = React.useState<boolean>(false)
  const [text, setText] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<PersonInterface>(null)
  const [household, setHousehold] = React.useState<HouseholdInterface>({ name: "" });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleRemove(index: number) {
    let m = [...members];
    m.splice(index, 1);
    setMembers(m);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const h = { ...household } as HouseholdInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name": h.name = value; break;
    }
    setHousehold(h);
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
    setText(`Would you like to update ${person.name.first}"s address to match ${props.currentPerson.name.first}"s (${PersonHelper.addressToString(props.currentPerson.contactInfo)})?`);
    setShowUpdateAddressModal(true);
  }

  function addPerson(person?: PersonInterface) {
    const addPerson: PersonInterface = person || selectedPerson;
    addPerson.householdId = props.household.id;
    addPerson.householdRole = "Other";
    let m = [...members];
    m.push(addPerson);
    setMembers(m);
  }

  const validate = () => {
    const result = [];
    if (!household.name) result.push("Please provide a household name.");
    setErrors(result);
    return result.length === 0;
  }

  function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      let promises = [];
      promises.push(ApiHelper.post("/households", [household], "MembershipApi"));
      promises.push(ApiHelper.post("/people/household/" + household.id, members, "MembershipApi"));
      Promise.all(promises).then(() => props.updatedFunction()).finally(() => setIsSubmitting(false));
    }
  }

  function handleNo() {
    setShowUpdateAddressModal(false);
    addPerson();
  }

  async function handleYes() {
    setShowUpdateAddressModal(false);
    selectedPerson.contactInfo = PersonHelper.changeOnlyAddress(selectedPerson.contactInfo, props.currentPerson.contactInfo);
    try {
      await ApiHelper.post("/people", [selectedPerson], "MembershipApi");
    } catch (err) {
      console.log(`error in updating ${selectedPerson.name.display}"s address`);
    }
    addPerson();
  }

  const rows = members.map((m, index) => (
    <TableRow key={m.id}>
      <TableCell><img src={PersonHelper.getPhotoUrl(m)} alt="avatar" /></TableCell>
      <TableCell>
        {m.name.display}
        <select value={m.householdRole || ""} aria-label="role" onChange={(e) => handleChangeRole(e, index)} className="form-control form-control-sm">
          <option value="Head">Head</option>
          <option value="Spouse">Spouse</option>
          <option value="Child">Child</option>
          <option value="Other">Other</option>
        </select>
      </TableCell>
      <TableCell><button onClick={() => handleRemove(index)} className="text-danger no-default-style"><Icon>person_remove</Icon> Remove</button></TableCell>
    </TableRow>
  ))

  React.useEffect(() => { setHousehold(props.household) }, [props.household]);

  let personAdd = (showAdd) ? <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} person={props.currentPerson} /> : null;
  return (
    <>
      <UpdateHouseHold show={showUpdateAddressModal} onHide={() => setShowUpdateAddressModal(false)} handleNo={handleNo} handleYes={handleYes} text={text} />
      <InputBox id="householdBox" headerIcon="group" headerText={household?.name + " Household"} isSubmitting={isSubmitting} saveFunction={handleSave} cancelFunction={props.updatedFunction}>
        <ErrorMessages errors={errors} />
        <TextField fullWidth name="name" id="name" type="text" value={household?.name} onChange={handleChange} label="Household Name" />
        <Table size="small" id="householdMemberTable">
          <TableBody>
            {rows}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <button className="text-success no-default-style" aria-label="addMember" onClick={() => setShowAdd(true)}> <Icon>person_add</Icon> Add</button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {personAdd}
      </InputBox>
    </>
  );
}
