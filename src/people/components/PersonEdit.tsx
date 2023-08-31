import React, { useState } from "react";
import { ChumsPersonHelper, UpdateHouseHold } from "."
import { PersonHelper, DateHelper, InputBox, ApiHelper, PersonInterface, Loading, ErrorMessages } from "@churchapps/apphelper"
import { Navigate } from "react-router-dom";
import UserContext from "../../UserContext";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"

interface Props {
  id?: string,
  updatedFunction: () => void,
  togglePhotoEditor: (show: boolean, inProgressEditPerson: PersonInterface) => void,
  person: PersonInterface,
  showMergeSearch: () => void
}

export function formattedPhoneNumber(value: string) {
  if (!value) return "";
  value = value.replace(/[^+0-9-]/g, "");
  value = value.replaceAll("-", "");
  let length = value.length - 10;
  if (value.length > 3 && value.length <= 6)
    value = value.slice(0, 3) + "-" + value.slice(3);
  else if (value.length > 6 && value.length < 11)
    value = value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
  else if (value.length > 10)
    value = value.slice(0, length) + "-" + value.slice(length, length + 3) + "-" + value.slice(length + 3, length + 6) + "-" + value.slice(length + 6);

  return value;
}

export function PersonEdit(props: Props) {
  const context = React.useContext(UserContext);
  const [redirect, setRedirect] = useState("");
  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState<boolean>(false)
  const [text, setText] = useState("");
  const [members, setMembers] = useState<PersonInterface[]>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [person, setPerson] = React.useState<PersonInterface>({
    name: { first: "", last: "", middle: "", nick: "", display: "" },
    contactInfo: { address1: "", address2: "", city: "", state: "", zip: "", email: "", homePhone: "", workPhone: "", mobilePhone: "" },
    membershipStatus: "", gender: "", birthDate: null, maritalStatus: "", nametagNotes: ""
  });

  //const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setErrors([]);
    const p = { ...person } as PersonInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "name.first": p.name.first = value; break;
      case "name.middle": p.name.middle = value; break;
      case "name.last": p.name.last = value; break;
      case "name.nick": p.name.nick = value; break;
      case "contactInfo.email": p.contactInfo.email = value; break;
      case "contactInfo.address1": p.contactInfo.address1 = value; break;
      case "contactInfo.address2": p.contactInfo.address2 = value; break;
      case "contactInfo.city": p.contactInfo.city = value; break;
      case "contactInfo.state": p.contactInfo.state = value; break;
      case "contactInfo.zip": p.contactInfo.zip = value; break;
      case "contactInfo.homePhone": p.contactInfo.homePhone = (value + 'x' + p.contactInfo.homePhone?.split('x')[1]); break;
      case "contactInfo.workPhone": p.contactInfo.workPhone = (value + 'x' + p.contactInfo.workPhone?.split('x')[1]); break;
      case "contactInfo.mobilePhone": p.contactInfo.mobilePhone = (value + 'x' + p.contactInfo.mobilePhone?.split('x')[1]); break;
      case "membershipStatus": p.membershipStatus = value; break;
      case "gender": p.gender = value; break;
      case "maritalStatus": p.maritalStatus = value; break;
      case "nametagNotes": p.nametagNotes = value; break;
      case "anniversary": p.anniversary = DateHelper.convertToDate(value); break;
      case "birthDate": p.birthDate = DateHelper.convertToDate(value); break;
      case "photo": p.photo = value; break;
    }
    setPerson(p);
  }

  function handleDelete() {
    if (window.confirm("Are you sure you wish to permanently delete this person record?"))
      ApiHelper.delete("/people/" + person.id.toString(), "MembershipApi").then(() => setRedirect("/people"));
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))
  const validatePhone = (phone: string) => (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)); //eslint-disable-line

  const validate = () => {
    const result = [];
    if (!person.name.first) result.push("First name is required");
    if (!person.name.last) result.push("Last name is required");
    if (person.contactInfo.email && !validateEmail(person.contactInfo.email)) result.push("Please enter a valid email address.");
    if (person.contactInfo.homePhone?.split('x')[0] && !validatePhone(person.contactInfo.homePhone?.split('x')[0].replaceAll("-", ""))) result.push("Please enter a valid home phone.");
    if (person.contactInfo.workPhone?.split('x')[0] && !validatePhone(person.contactInfo.workPhone?.split('x')[0].replaceAll("-", ""))) result.push("Please enter a valid work phone.");
    if (person.contactInfo.mobilePhone?.split('x')[0] && !validatePhone(person.contactInfo.mobilePhone?.split('x')[0].replaceAll("-", ""))) result.push("Please enter a valid mobile phone.");
    setErrors(result);
    return result.length === 0;
  }

  async function handleSave() {
    if (validate()) {
      setIsSubmitting(true)
      const p = JSON.parse(JSON.stringify({ ...person }));
      p.contactInfo.homePhone = p.contactInfo.homePhone?.split('x')[0] ? (p.contactInfo.homePhone.replaceAll("-", "").replace(/[^+0-9-x]/g, "")) : null;
      p.contactInfo.workPhone = p.contactInfo.workPhone?.split('x')[0] ? (p.contactInfo.workPhone.replaceAll("-", "").replace(/[^+0-9-x]/g, "")) : null;
      p.contactInfo.mobilePhone = p.contactInfo.mobilePhone?.split('x')[0] ? (p.contactInfo.mobilePhone.replaceAll("-", "").replace(/[^+0-9-x]/g, "")) : null;
      if (ChumsPersonHelper.getExpandedPersonObject(person).id === context.person?.id) context.setPerson(person);

      const { contactInfo: contactFromProps } = props.person

      if (members && members.length > 1 && PersonHelper.compareAddress(contactFromProps, person.contactInfo)) {
        setText(`You updated the address to ${PersonHelper.addressToString(person.contactInfo)} for ${person.name.display}.  Would you like to apply that to the entire ${person.name.last} family?`)
        setShowUpdateAddressModal(true)
        return;
      }

      await updatePerson(p);
    }
  }
  const handleChangeExtention = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = { ...person } as PersonInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "contactInfo.homePhone": p.contactInfo.homePhone = p.contactInfo.homePhone?.split('x')[0] + 'x' + value; break;
      case "contactInfo.workPhone": p.contactInfo.workPhone = p.contactInfo.workPhone?.split('x')[0] + 'x' + value; break;
      case "contactInfo.mobilePhone": p.contactInfo.mobilePhone = p.contactInfo.mobilePhone?.split('x')[0] + 'x' + value; break;
    }
    setPerson(p);
  }

  const updatePerson = async (p: PersonInterface) => {
    await ApiHelper.post("/people/", [p], "MembershipApi");
    props.updatedFunction();
    setIsSubmitting(false)
  }

  async function handleYes() {
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

  function handleNo() {
    setShowUpdateAddressModal(false)
    updatePerson(person)
  }

  function fetchMembers() {
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

  function handlePhotoClick(e: React.MouseEvent) {
    e.preventDefault();
    props.togglePhotoEditor(true, person);
  }

  React.useEffect(() => {
    const { homePhone, workPhone, mobilePhone } = props.person.contactInfo;
    setPerson({
      ...props.person, contactInfo:
      {
        ...props.person.contactInfo,
        homePhone: formattedPhoneNumber(homePhone?.split('x')[0]) + 'x' + (homePhone?.split('x')[1] ?? ''),
        workPhone: formattedPhoneNumber(workPhone?.split('x')[0]) + 'x' + (workPhone?.split('x')[1] ?? ''),
        mobilePhone: formattedPhoneNumber(mobilePhone?.split('x')[0]) + 'x' + (mobilePhone?.split('x')[1] ?? '')
      }
    });
    return () => {
      setPerson(null);
    }
  }, [props.person]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMembers, [props.person]);

  const editForm = (
    !person
      ? <Loading />
      : (
        <InputBox headerIcon="person" headerText="Personal Details" cancelFunction={props.updatedFunction} deleteFunction={handleDelete} saveFunction={handleSave} isSubmitting={isSubmitting} headerActionContent={<Button id="mergeButton" size="small" onClick={props.showMergeSearch}>Merge</Button>}>
          <ErrorMessages errors={errors} />
          <Grid container spacing={3}>
            <Grid item sm={3} className="my-auto">
              <a href="about:blank" onClick={handlePhotoClick}>
                <img src={PersonHelper.getPhotoUrl(person)} className="w-100 profilePic" id="imgPreview" alt="avatar" />
              </a>
            </Grid>
            <Grid item sm={1}>
            </Grid>
            <Grid item sm={8}>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <TextField fullWidth name="name.first" label="First Name" id="first" value={person.name.first || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField fullWidth name="name.middle" label="Middle Name" id="middle" value={person.name.middle || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField fullWidth name="name.last" label="Last Name" id="last" value={person.name.last || ""} onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField fullWidth name="contactInfo.email" label="Email" type="email" id="email" value={person.contactInfo.email || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField inputProps={{ maxLength: 20 }} fullWidth name="nametagNotes" label="Name Tag Notes" id="nametagnotes" value={person.nametagNotes || ""} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField fullWidth name="name.nick" id="nick" label="Nickname" value={person.name.nick || ""} onChange={handleChange} />
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="membershipStatus-label">Membership Status</InputLabel>
                <Select name="membershipStatus" id="membershipStatus" labelId="membershipStatus-label" label="Membership Status" value={person.membershipStatus || ""} onChange={handleChange}>
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Visitor">Visitor</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField fullWidth type="date" name="birthDate" id="birthDate" InputLabelProps={{ shrink: true }} label="Birthdate" value={DateHelper.formatHtml5Date(person.birthDate)} onChange={handleChange} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select name="gender" id="gender" labelId="gender-label" label="Gender" value={person.gender || ""} onChange={handleChange}>
                  <MenuItem value="Unspecified">Unspecified</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="maritalStatus-label">Marital Status</InputLabel>
                <Select name="maritalStatus" id="maritalStatus" label="Marital Status" labelId="maritalStatus-label" value={person.maritalStatus || ""} onChange={handleChange}>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField fullWidth type="date" name="anniversary" id="anniversary" InputLabelProps={{ shrink: true }} label="Anniversary" value={DateHelper.formatHtml5Date(person.anniversary)} onChange={handleChange} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={8}>
              <div className="section">Address</div>
              <TextField name="contactInfo.address1" id="address1" fullWidth label="Line 1" value={person.contactInfo?.address1 || ""} onChange={handleChange} />
              <TextField name="contactInfo.address2" id="address2" fullWidth label="Line 2" value={person.contactInfo?.address2 || ""} onChange={handleChange} />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField name="contactInfo.city" id="city" fullWidth label="City" value={person.contactInfo?.city || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={3}>
                  <TextField name="contactInfo.state" id="state" fullWidth label="State" value={person.contactInfo?.state || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={3}>
                  <TextField name="contactInfo.zip" id="zip" fullWidth label="Zip" value={person.contactInfo?.zip || ""} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={3}>
              <div className="section">Phone</div>
              <TextField fullWidth name="contactInfo.homePhone" id="homePhone" label="Home" value={person.contactInfo?.homePhone?.split('x')[0] || ""} onChange={handleChange} InputProps={{ inputProps: { maxLength: 15 } }} />
              <TextField fullWidth name="contactInfo.workPhone" id="workPhone" label="Work" value={person.contactInfo?.workPhone?.split('x')[0] || ""} onChange={handleChange} InputProps={{ inputProps: { maxLength: 15 } }} />
              <TextField fullWidth name="contactInfo.mobilePhone" id="mobilePhone" label="Mobile" value={person.contactInfo?.mobilePhone?.split('x')[0] || ""} onChange={handleChange} InputProps={{ inputProps: { maxLength: 15 } }} />
            </Grid>
            <Grid item md={1}>
              <div className="section">Extention</div>
              <TextField fullWidth name="contactInfo.homePhone" label="Home" value={person.contactInfo?.homePhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
              <TextField fullWidth name="contactInfo.workPhone" label="Work" value={person.contactInfo?.workPhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
              <TextField fullWidth name="contactInfo.mobilePhone" label="Mobile" value={person.contactInfo?.mobilePhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
            </Grid>
          </Grid>
        </InputBox>
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
