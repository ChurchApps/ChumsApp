import React from "react"
import { useNavigate } from "react-router-dom"
import { UserHelper, Permissions, PersonInterface, HouseholdInterface, ApiHelper } from "."
import { Button, Grid, TextField } from "@mui/material"
import { ErrorMessages } from "../../components"

export function CreatePerson() {
  const navigate = useNavigate()
  const [person, setPerson] = React.useState<PersonInterface>({ name: { first: "", last: "" }, contactInfo: {} });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = () => {
    const result = [];
    if (!person.name?.first) result.push("Please enter a first name.");
    if (!person.name?.last) result.push("Please enter a last name.");
    setErrors(result);
    return result.length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const p = { ...person } as PersonInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "first": p.name.first = value; break;
      case "last": p.name.last = value; break;
    }
    setPerson(p);
  }

  function handleSubmit() {
    let household = { name: person.name.last } as HouseholdInterface;
    if (validate()) {
      setIsSubmitting(true);
      ApiHelper.post("/households", [household], "MembershipApi").then(data => {
        household.id = data[0].id;
        person.householdId = household.id;
        ApiHelper.post("/people", [person], "MembershipApi").then(data => {
          person.id = data[0].id
          navigate("/people/" + person.id);
        }).finally(() => {
          setIsSubmitting(false);
        });
      });
    }
  }

  if (!UserHelper.checkAccess(Permissions.membershipApi.people.edit)) return null;
  return (
    <div>
      <p className="pl-1 mb-3 text-dark"><b>Add a New Person</b></p>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3} alignItems="center">
        <Grid item md={4} xs={12}>
          <TextField size="small" margin="none" fullWidth type="text" aria-label="firstName" label="First Name" name="first" value={person.name.first} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField size="small" margin="none" fullWidth type="text" aria-label="lastName" label="Last Name" name="last" value={person.name.last} onChange={handleChange} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit} />
        </Grid>
        <Grid item md={4} xs={12}>
          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} onClick={handleSubmit}>Add</Button>
        </Grid>
      </Grid>
    </div>
  )
}
