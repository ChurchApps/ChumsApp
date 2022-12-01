import React, { useState, useCallback, useEffect } from "react";
import { InputBox, RoleInterface } from "."
import { ApiHelper, RoleMemberInterface, UserHelper, LoadCreateUserRequestInterface, PersonInterface, HouseholdInterface, AssociatePerson, ErrorMessages, UserInterface, UserChurchInterface } from "./";
import { TextField } from "@mui/material";

interface Props {
  role: RoleInterface,
  updatedFunction: () => void,
  selectedUser: string,
  roleMembers: RoleMemberInterface[];
}

const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

export const UserAdd = (props: Props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [fetchedUser, setFetchedUser] = useState<UserInterface>(null);
  const [errors, setErrors] = useState([]);
  const [linkedPerson, setLinkedPerson] = useState<PersonInterface>(null)
  const [selectedPerson, setSelectedPerson] = useState<PersonInterface>(null);
  const [showEmailField, setShowEmailField] = useState<boolean>(false);
  const [showNameFields, setShowNameFields] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const saveExistingUser = async () => {
    if (validate()) {
      await ApiHelper.post(`/users/setDisplayName`, { firstName, lastName, userId: fetchedUser.id }, "MembershipApi");
      try {
        await ApiHelper.post(`/users/updateEmail`, { email, userId: fetchedUser.id }, "MembershipApi");
        const person = { ...linkedPerson };
        person.contactInfo.email = email;
        person.name.first = firstName;
        person.name.last = lastName;
        await ApiHelper.post("/people", [person], "MembershipApi");
        props.updatedFunction();
      } catch {
        setErrors(["Cannot save. Another user already exists for this email address."])
      }
    }
  }

  const saveNewUser = async () => {
    if (validate()) {
      const user = await createUserAndToGroup(firstName, lastName, email);
      const person = await createPerson(user.id);
      await linkUserAndPerson(user.id, person.id)
      props.updatedFunction();
    }
  }

  const saveUserFromPerson = async () => {
    if (showEmailField && !validateEmail(email)) {
      setErrors(["Please enter a valid Email"]);
      return;
    }
    if (!selectedPerson) return;
    const { first, last } = selectedPerson.name;
    const userEmail = showEmailField ? email : selectedPerson.contactInfo.email;
    const user = await createUserAndToGroup(first, last, userEmail);
    try {
      await linkUserAndPerson(user.id, selectedPerson.id);

      if (showEmailField) {
        const person = { ...selectedPerson };
        person.contactInfo.email = email;
        await ApiHelper.post("/people", [person], "MembershipApi");
      }
    } catch {
      setErrors(["The user account for this email is associated with a different person."]);
    }

    props.updatedFunction();
  }

  const handleSave = async () => {
    if (editMode) saveExistingUser();
    else if (showNameFields) saveNewUser();
    else saveUserFromPerson();
  }

  const validate = () => {
    const warnings: string[] = [];
    if (!firstName) warnings.push("Please enter firstname");
    if (!lastName) warnings.push("Please enter lastname");
    if (!validateEmail(email)) warnings.push("Enter a valid Email");
    setErrors(warnings);
    return warnings.length === 0;
  }

  const linkUserAndPerson = async (userId: string, personId: string) => {
    await ApiHelper.post(`/userchurch?userId=${userId}`, { personId }, "MembershipApi");
  }

  const createUserAndToGroup = async (firstName: string, lastName: string, userEmail: string) => {
    const userPayload: LoadCreateUserRequestInterface = { firstName, lastName, userEmail };
    const user: UserInterface = await ApiHelper.post("/users/loadOrCreate", userPayload, "MembershipApi");
    const roleMember: RoleMemberInterface = { userId: user.id, roleId: props.role.id, churchId: UserHelper.currentChurch.id };
    await ApiHelper.post("/rolemembers/", [roleMember], "MembershipApi");

    return user;
  }

  const createPerson = async (userId: string) => {
    const house: HouseholdInterface = { name: lastName };
    const households = await ApiHelper.post("/households", [house], "MembershipApi")

    const personRecord: PersonInterface = { householdId: households[0].id, name: { first: firstName, last: lastName }, userId, contactInfo: { email } }
    const person: PersonInterface[] = await ApiHelper.post("/people", [personRecord], "MembershipApi")

    return person[0];
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    const val = e.currentTarget.value;
    switch (e.currentTarget.name) {
      case "email":
        setEmail(val);
        break;
      case "firstName":
        setFirstName(val);
        break;
      case "lastName":
        setLastName(val);
    }
  }

  const handleAssociatePerson = (person: PersonInterface) => {
    setSelectedPerson(person);

    if (!person.contactInfo.email) {
      setShowEmailField(true);
    }
  }

  const CreateNewUser = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowNameFields(true);
    setShowEmailField(true);
  }

  const handleSearchStatus = useCallback((value: boolean) => {
    setHasSearched(value);
  }, [])

  useEffect(() => {
    (async () => {
      if (props.selectedUser) {
        setEditMode(true);
        const user: UserInterface = await ApiHelper.post("/users/loadOrCreate", { userId: props.selectedUser }, "MembershipApi");
        setFetchedUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        try {
          const userChurch: UserChurchInterface = await ApiHelper.get(`/userchurch/userid/${user.id}`, "MembershipApi");
          const person = await ApiHelper.get(`/people/${userChurch.personId}`, "MembershipApi");
          setLinkedPerson(person)
        } catch {
          setLinkedPerson(null);
        }
      }
    })()
  }, [props.selectedUser]);

  const message = (!showNameFields && !editMode && hasSearched) && (<span>Don't have a user account? <a href="about:blank" onClick={CreateNewUser}>Create New User</a></span>);
  const nameField = (showNameFields || editMode) && (
    <>
      <TextField fullWidth name="firstName" label="First Name" value={firstName} onChange={handleChange} />
      <TextField fullWidth name="lastName" label="Last Name" value={lastName} onChange={handleChange} />
    </>
  )
  const emailField = (showEmailField || editMode) && (
    <TextField type="email" fullWidth name="email" label="Email" value={email} onChange={handleChange} />
  )

  return (
    <InputBox headerIcon="lock" headerText={"Add to " + props.role.name} saveFunction={handleSave} cancelFunction={props.updatedFunction}>
      <ErrorMessages errors={errors} />
      {
        (!showNameFields || editMode) && (
          <AssociatePerson
            person={selectedPerson || linkedPerson}
            handleAssociatePerson={handleAssociatePerson}
            searchStatus={handleSearchStatus}
            filterList={props.roleMembers.map(rm => rm.personId)}
            onChangeClick={() => setShowEmailField(false)}
            showChangeOption={!editMode}
          />
        )
      }
      {nameField}
      {emailField}
      {message}
    </InputBox>
  );
}
