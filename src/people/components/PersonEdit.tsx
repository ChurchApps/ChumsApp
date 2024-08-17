import React, { useState } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { ChumsPersonHelper, UpdateHouseHold } from "."
import { PersonHelper, DateHelper, InputBox, ApiHelper, PersonInterface, Loading, ErrorMessages, Locale } from "@churchapps/apphelper"
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
  value = value.split("x")[0];
  value = value.replaceAll(" ", "-")
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
  const [phoneHasError, setPhoneHasError] = React.useState({ homePhone: false, workPhone: false, mobilePhone: false });

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

  const handlePhoneChange = (value: string, field: "homePhone" | "workPhone" | "mobilePhone") => {
    setPhoneHasError((prevState) => ({...prevState, [field]: !matchIsValidTel(value)}));
    const p: PersonInterface = {...person};
    p.contactInfo[field] = value;
    setPerson(p);
  }

  function handleDelete() {
    if (window.confirm(Locale.label("people.personEdit.confirmMsg")))
      ApiHelper.delete("/people/" + person.id.toString(), "MembershipApi").then(() => setRedirect("/people"));
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const validate = () => {
    const result = [];
    if (!person.name.first) result.push(Locale.label("people.personEdit.firstReq"));
    if (!person.name.last) result.push(Locale.label("people.personEdit.lastReq"));
    if (person.contactInfo.email && !validateEmail(person.contactInfo.email)) result.push(Locale.label("people.personEdit.valEmail"));
    setErrors(result);
    return result.length === 0;
  }

  async function handleSave() {
    if (validate()) {
      setIsSubmitting(true)
      const p = JSON.parse(JSON.stringify({ ...person }));
      p.contactInfo.homePhone = (p.contactInfo.homePhone?.length <= 4) ? null : p.contactInfo.homePhone;
      p.contactInfo.workPhone = (p.contactInfo.workPhone?.length <= 4) ? null : p.contactInfo.workPhone;
      p.contactInfo.mobilePhone = (p.contactInfo.mobilePhone?.length <= 4) ? null : p.contactInfo.mobilePhone;
      if (ChumsPersonHelper.getExpandedPersonObject(person).id === context.person?.id) context.setPerson(person);

      const { contactInfo: contactFromProps } = props.person

      if (members && members.length > 1 && PersonHelper.compareAddress(contactFromProps, person.contactInfo)) {
        setText(`${Locale.label("people.personEdit.upAddress")} ${PersonHelper.addressToString(person.contactInfo)} ${Locale.label("people.personEdit.for")} ${person.name.display}.  ${Locale.label("people.personEdit.applyQuestion")} ${person.name.last} ${Locale.label("people.personEdit.family")}?`)
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
    setPerson({
      ...props.person
    });
    return () => {
      setPerson(null);
    }
  }, [props.person]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchMembers, [props.person]);

  const ariaLabel = {
    "aria-label" : "phone-number"
  }

  const ariaDesc = {
    "aria-describedby": "errorMsg",
    "aria-labelledby": "tel-label errorMsg"
  }

  const editForm = (
    !person
      ? <Loading />
      : (
        <InputBox headerIcon="person" headerText={Locale.label("people.personEdit.persDet")} cancelFunction={props.updatedFunction} deleteFunction={handleDelete} saveFunction={handleSave} isSubmitting={isSubmitting} headerActionContent={<Button id="mergeButton" size="small" onClick={props.showMergeSearch}>{Locale.label("people.personEdit.merge")}</Button>}>
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
                  <TextField fullWidth name="name.first" label={Locale.label("person.firstName")} id="first" value={person.name.first || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField fullWidth name="name.middle" label={Locale.label("person.middleName")} id="middle" value={person.name.middle || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField fullWidth name="name.last" label={Locale.label("person.lastName")} id="last" value={person.name.last || ""} onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField fullWidth name="contactInfo.email" label={Locale.label("person.email")} type="email" id="email" value={person.contactInfo.email || ""} onChange={handleChange} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField inputProps={{ maxLength: 20 }} fullWidth name="nametagNotes" label={Locale.label("people.personEdit.nameNote")} id="nametagnotes" value={person.nametagNotes || ""} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <TextField fullWidth name="name.nick" id="nick" label={Locale.label("person.nickName")} value={person.name.nick || ""} onChange={handleChange} />
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="membershipStatus-label">{Locale.label("person.membershipStatus")}</InputLabel>
                <Select name="membershipStatus" id="membershipStatus" labelId="membershipStatus-label" label={Locale.label("person.membershipStatus")} value={person.membershipStatus || ""} onChange={handleChange}>
                  <MenuItem value="Visitor">{Locale.label("person.visitor")}</MenuItem>
                  <MenuItem value="Regular Attendee">{Locale.label("person.regularAttendee")}</MenuItem>
                  <MenuItem value="Member">{Locale.label("person.member")}</MenuItem>
                  <MenuItem value="Staff">{Locale.label("person.staff")}</MenuItem>
                  <MenuItem value="Inactive">{Locale.label("person.inactive")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField fullWidth type="date" name="birthDate" id="birthDate" InputLabelProps={{ shrink: true }} label={Locale.label("person.birthDate")} value={DateHelper.formatHtml5Date(person.birthDate)} onChange={handleChange} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">{Locale.label("person.gender")}</InputLabel>
                <Select name="gender" id="gender" labelId="gender-label" label={Locale.label("person.gender")} value={person.gender || ""} onChange={handleChange}>
                  <MenuItem value="Unspecified">{Locale.label("person.unspecified")}</MenuItem>
                  <MenuItem value="Male">{Locale.label("person.male")}</MenuItem>
                  <MenuItem value="Female">{Locale.label("person.female")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="maritalStatus-label">{Locale.label("person.maritalStatus")}</InputLabel>
                <Select name="maritalStatus" id="maritalStatus" label={Locale.label("people.personEdit.maritalStatus")} labelId="maritalStatus-label" value={person.maritalStatus || ""} onChange={handleChange}>
                  <MenuItem value="Unknown">{Locale.label("person.unknown")}</MenuItem>
                  <MenuItem value="Single">{Locale.label("person.single")}</MenuItem>
                  <MenuItem value="Married">{Locale.label("person.married")}</MenuItem>
                  <MenuItem value="Divorced">{Locale.label("person.divorced")}</MenuItem>
                  <MenuItem value="Widowed">{Locale.label("person.widowed")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField fullWidth type="date" name="anniversary" id="anniversary" InputLabelProps={{ shrink: true }} label={Locale.label("person.anniversary")} value={DateHelper.formatHtml5Date(person.anniversary)} onChange={handleChange} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={8}>
              <div className="section">{Locale.label("person.address")}</div>
              <TextField name="contactInfo.address1" id="address1" fullWidth label={Locale.label("person.line1")} value={person.contactInfo?.address1 || ""} onChange={handleChange} />
              <TextField name="contactInfo.address2" id="address2" fullWidth label={Locale.label("person.line2")} value={person.contactInfo?.address2 || ""} onChange={handleChange} />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField name="contactInfo.city" id="city" fullWidth label={Locale.label("person.city")} value={person.contactInfo?.city || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={3}>
                  <TextField name="contactInfo.state" id="state" fullWidth label={Locale.label("person.state")} value={person.contactInfo?.state || ""} onChange={handleChange} />
                </Grid>
                <Grid item xs={3}>
                  <TextField name="contactInfo.zip" id="zip" fullWidth label={Locale.label("person.zip")} value={person.contactInfo?.zip || ""} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={3}>
              <div className="section">{Locale.label("person.phone")}</div>
              <MuiTelInput fullWidth name="contactInfo.homePhone" id="homePhone" label={Locale.label("people.personEdit.home")} value={person.contactInfo?.homePhone} onChange={(value) => handlePhoneChange(value, "homePhone")}
                defaultCountry="US" focusOnSelectCountry inputProps={ariaDesc} error={phoneHasError.homePhone} MenuProps={ariaLabel} helperText={<div id="errorMsg">{phoneHasError.homePhone && <p style={{ margin: 0, color: "#d32f2f" }}>{Locale.label("people.personEdit.invalForm")}</p>}</div>}
              />
              <MuiTelInput fullWidth name="contactInfo.workPhone" id="workPhone" label={Locale.label("people.personEdit.work")} value={person.contactInfo?.workPhone} onChange={(value) => handlePhoneChange(value, "workPhone")}
                defaultCountry="US" focusOnSelectCountry inputProps={ariaDesc} error={phoneHasError.workPhone} MenuProps={ariaLabel} helperText={<div id="errorMsg">{phoneHasError.workPhone && <p style={{ margin: 0, color: "#d32f2f" }}>{Locale.label("people.personEdit.invalForm")}</p>}</div>}
              />
              <MuiTelInput fullWidth name="contactInfo.mobilePhone" id="mobilePhone" label={Locale.label("people.personEdit.mobile")} value={person.contactInfo?.mobilePhone} onChange={(value) => handlePhoneChange(value, "mobilePhone")}
                defaultCountry="US" focusOnSelectCountry inputProps={ariaDesc} error={phoneHasError.mobilePhone} MenuProps={ariaLabel} helperText={<div id="errorMsg">{phoneHasError.mobilePhone && <p style={{ margin: 0, color: "#d32f2f" }}>{Locale.label("people.personEdit.invalForm")}</p>}</div>}
              />
            </Grid>
            <Grid item md={1}>
              <div className="section">{Locale.label("people.personEdit.exten")}</div>
              <TextField fullWidth name="contactInfo.homePhone" label={Locale.label("people.personEdit.home")} value={person.contactInfo?.homePhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
              <TextField fullWidth name="contactInfo.workPhone" label={Locale.label("people.personEdit.work")} value={person.contactInfo?.workPhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
              <TextField fullWidth name="contactInfo.mobilePhone" label={Locale.label("people.personEdit.mobile")} value={person.contactInfo?.mobilePhone?.split('x')[1] || ""} onChange={handleChangeExtention} InputProps={{ inputProps: { maxLength: 4 } }} />
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
