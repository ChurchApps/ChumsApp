import React, { useCallback, useState } from "react";
import { PersonHelper, Helper, StateOptions, InputBox, ApiHelper, PersonInterface, UpdateHouseHold, ErrorMessages, ValidateHelper } from "."
import { Redirect } from "react-router-dom";
import { Row, Col, FormControl, FormGroup, FormLabel, Button } from "react-bootstrap";

interface Props {
    id?: string,
    updatedFunction: (person: PersonInterface) => void,
    togglePhotoEditor: (show: boolean) => void,
    person: PersonInterface,
    photoUrl: string,
    showMergeSearch: () => void
}

export const PersonEdit: React.FC<Props> = (props) => {
    const [person, setPerson] = useState<PersonInterface>({} as PersonInterface);
    const [redirect, setRedirect] = useState("");
    const [showUpdateAddressModal, setShowUpdateAddressModal] = useState<boolean>(false)
    const [text, setText] = useState("");
    const [members, setMembers] = useState<PersonInterface[]>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        var p = { ...person };
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
  
        if(value.length > 3 && value.length <= 6) 
          value = value.slice(0,3) + "-" + value.slice(3);
        else if(value.length > 6) 
          value = value.slice(0,3) + "-" + value.slice(3,6) + "-" + value.slice(6);
        
        return value;
    }

    const handleCancel = () => props.updatedFunction(person);

    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to permanently delete this person record?"))
            ApiHelper.delete("/people/" + person.id.toString(), "MembershipApi").then(() => setRedirect("/people"));
    }

    const handleSave = () => {
        let errors: string[] = [];
        const { name: { first, last }, contactInfo: contactFromState, birthDate } = person;

        if (!first) errors.push('First name is required');
        if (!last) errors.push('Last name is requried');
        if (contactFromState.email && !ValidateHelper.email(contactFromState.email)) errors.push('Enter a valid email address');
        if (birthDate && birthDate > new Date()) errors.push('Enter a valid birth date');

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
                var p = { ...person };
                p.id = data[0];
                p.name.display = PersonHelper.getDisplayName(p.name.first, p.name.last, p.name.nick);
                setPerson(p);
                props.updatedFunction(p);
            });
    }

    const getPhoto = () => {
        if (props.person) {
            var url = (props.photoUrl === null) ? PersonHelper.getPhotoUrl(props.person) : props.photoUrl;
            return (<a href="about:blank" className="d-block" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.togglePhotoEditor(true) }}>
                <img src={url} className="img-fluid profilePic d-block mx-auto" id="imgPreview" alt="avatar" />
            </a>);
        } else return;
    }


    const personChanged = useCallback(() => {
        const personDeepCopy: PersonInterface = {
            ...props.person,
            contactInfo: {
                ...props.person.contactInfo
            },
            name: {
                ...props.person.name
            }
        }
        setPerson(personDeepCopy)
    }, [props.person]);
    const photoUrlChanged = useCallback(() => {
        if (props.photoUrl !== null) {
            var p: PersonInterface = { ...person };
            p.photo = props.photoUrl;
            setPerson(p);
        }
    }, [props.photoUrl, person]);

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
        props.updatedFunction(person)
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

    React.useEffect(personChanged, [props.person]);
    React.useEffect(photoUrlChanged, [props.photoUrl]);
    React.useEffect(fetchMembers, [props.person])

    if (redirect !== "") return <Redirect to={redirect} />
    else {
        return (
            <>
                <UpdateHouseHold show={showUpdateAddressModal} text={text} onHide={() => setShowUpdateAddressModal(false)} handleNo={handleNo} handleYes={handleYes} />
                <InputBox id={props.id} data-cy="person-details-box" headerIcon="fas fa-user" headerText="Personal Details" cancelFunction={handleCancel} deleteFunction={handleDelete} saveFunction={handleSave} headerActionContent={<Button id="mergeButton" data-cy="merge-button" variant="primary" size="sm" onClick={handleMerge}>Merge</Button>} >
                    <Row>
                        <Col sm={3} className="my-auto">{getPhoto()}</Col>
                        <Col sm={9}>
                            <Row>
                                <Col lg={6}>
                                    <FormGroup>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl name="firstName" data-cy="firstname" value={person?.name?.first || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>
                                </Col>
                                <Col lg={6}>
                                    <FormGroup>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl name="lastName" data-cy="lastname" value={person?.name?.last || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                 <Col lg={6}>
                                    <FormGroup>
                                        <FormLabel>Middle Name</FormLabel>
                                        <FormControl name="middleName" data-cy="middle-name" value={person?.name?.middle || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>
                                </Col>
                                <Col lg={6}>
                                    <FormGroup>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl type="text" name="email" data-cy="email" value={person?.contactInfo?.email || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>                                    
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={4} md={4}>
                            <FormGroup>
                                <FormLabel>Nickname</FormLabel>
                                <FormControl name="nickName" data-cy="nickname" value={person?.name?.nick || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                        </Col>
                        <Col lg={4} md={4}>
                            <FormGroup>
                                <FormLabel>Membership Status</FormLabel>
                                <FormControl as="select" name="membershipStatus" data-cy="member-ship-status" value={person?.membershipStatus || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                                    <option value="Visitor">Visitor</option>
                                    <option value="Member">Member</option>
                                    <option value="Staff">Staff</option>
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col lg={4} md={4}>
                            <FormGroup>
                                <FormLabel>Birthdate</FormLabel>
                                <FormControl type="date" name="birthDate" data-cy="birthdate" value={Helper.formatHtml5Date(person?.birthDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={4} md={4}>
                            <FormGroup>
                                <FormLabel>Gender</FormLabel>
                                <FormControl as="select" name="gender" data-cy="gender" value={person?.gender || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                                    <option value="Unspecified">Unspecified</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </FormControl>
                            </FormGroup>
                        </Col>
                        <Col lg={4} md={4}>
                            <FormGroup>
                                <FormLabel>Marital Status</FormLabel>
                                <FormControl as="select" name="maritalStatus" data-cy="marital-status" value={person?.maritalStatus || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
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
                                <FormLabel>Anniversary</FormLabel>
                                <FormControl type="date" name="anniversary" data-cy="anniversary" value={Helper.formatHtml5Date(person?.anniversary)} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                        </Col>
                    </Row>



                    <Row>
                        <Col md={9}>
                            <div className="section">Address</div>
                            <FormGroup>
                                <FormLabel>Line 1</FormLabel>
                                <FormControl name="address1" data-cy="address1" value={person?.contactInfo?.address1 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Line 2</FormLabel>
                                <FormControl name="address2" data-cy="address2" value={person?.contactInfo?.address2 || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                            <Row>
                                <Col xs={6}>
                                    <FormGroup>
                                        <FormLabel>City</FormLabel>
                                        <FormControl type="text" name="city" data-cy="city" value={person?.contactInfo?.city || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>
                                </Col>
                                <Col xs={3}>
                                    <FormGroup>
                                        <FormLabel>State</FormLabel>
                                        <FormControl as="select" name="state" data-cy="state" value={person?.contactInfo?.state || ""} onChange={handleChange} onKeyDown={handleKeyDown}>
                                            <StateOptions />
                                        </FormControl>
                                    </FormGroup>
                                </Col>
                                <Col xs={3}>
                                    <FormGroup>
                                        <FormLabel>Zip</FormLabel>
                                        <FormControl type="text" name="zip" data-cy="zip" value={person?.contactInfo?.zip || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <div className="section">Phone</div>
                            <FormGroup>
                                <FormLabel>Home</FormLabel>
                                <FormControl type="text" name="homePhone" maxLength={12} data-cy="homePhone" value={person?.contactInfo?.homePhone || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Work</FormLabel>
                                <FormControl type="text" name="workPhone" maxLength={12} data-cy="workPhone" value={person?.contactInfo?.workPhone || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl type="text" name="mobilePhone" maxLength={12} data-cy="mobilePhone" value={person?.contactInfo?.mobilePhone || ""} onChange={handleChange} onKeyDown={handleKeyDown} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <ErrorMessages errors={errors} />
                </InputBox>
            </>
        )
    }
}
