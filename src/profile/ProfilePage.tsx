import React from "react";
import { Row, Col, FormGroup } from "react-bootstrap"
import { InputBox, ApiHelper, ErrorMessages } from "./components"

export const ProfilePage = () => {
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState([]);
  const [passwordVerify, setPasswordVerify] = React.useState<string>("");

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/users/updatePassword", { newPassword: password }, "AccessApi").then(() => {
        window.alert("Changes saved.");
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    switch (e.currentTarget.name) {
    case "password":
      setPassword(val);
      break;
    case "passwordVerify":
      setPasswordVerify(val);
      break;
    }
  }

  const validate = () => {
    let errors = [];
    if (password !== passwordVerify) errors.push("Passwords do not match.");
    if (password.length < 8) errors.push("Please enter a password that is at least 8 characters long.");
    setErrors(errors);
    return errors.length === 0;
  }

  return (
    <>
      <Row style={{ marginBottom: 25 }}>
        <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-user"></i> Edit Profile</h1></div>
      </Row>
      <Row>
        <Col md={8}>
          <ErrorMessages errors={errors} />

          <InputBox headerIcon="fas fa-user" headerText="Edit Profile" saveFunction={handleSave}>
            <Row>
              <Col>
                <FormGroup>
                  <label>Set Password</label>
                  <input type="password" name="password" value={password} onChange={handleChange} className="form-control" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label>Verify Password</label>
                  <input type="password" name="passwordVerify" value={passwordVerify} onChange={handleChange} className="form-control" />
                </FormGroup>
              </Col>
            </Row>
          </InputBox>
        </Col>
        <Col md={4}>

        </Col>
      </Row>
    </>
  );
}
