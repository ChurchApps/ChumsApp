import React from "react";
import "./Login.css";
import { ApiHelper } from "../helpers";
import { ErrorMessages, } from "../components";
import { ResetPasswordRequestInterface, ResetPasswordResponseInterface } from "../interfaces";
import { Button } from "react-bootstrap";


export const ForgotPage: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [errors, setErrors] = React.useState([]);
    const [successMessage, setSuccessMessage] = React.useState<React.ReactElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(null); } }
    const validate = () => {
        var errors = [];
        if (email === "") errors.push("Please enter your email address.");
        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = (e: React.MouseEvent) => {
        if (e !== null) e.preventDefault();
        if (validate()) reset(email);
    }

    const reset = (email: string) => {
        const resetUrl = window.location.href.replace(window.location.pathname, "") + "/login?auth={auth}";

        var req: ResetPasswordRequestInterface = {
            userEmail: email,
            fromEmail: "support@livecs.org",
            subject: "Live Church Solutions Password Reset",
            body: "Please click here to reset your password: <a href=\"" + resetUrl + "\">" + resetUrl + "</a>"
        };

        ApiHelper.postAnonymous("/users/forgot", req, "AccessApi").then((resp: ResetPasswordResponseInterface) => {
            if (resp.emailed) {
                setErrors([]);
                setSuccessMessage(<div className="alert alert-success" role="alert">Password reset email sent</div>);
            } else {
                setErrors(["We could not find an account with this email address"]);
                setSuccessMessage(<></>);
            }
        });
    }

    return (
        <div className="smallCenterBlock">
            <ErrorMessages errors={errors} />
            {successMessage}
            <div id="loginBox">
                <h2>Reset Password</h2>
                <p>Enter your email address to request a password reset.</p>
                <input name="email" type="text" className="form-control" value={email} onChange={e => { e.preventDefault(); setEmail(e.currentTarget.value) }} placeholder="Email address" onKeyDown={handleKeyDown} />
                <Button size="lg" variant="primary" block onClick={handleSubmit}>Reset</Button>
                <br />
                <div className="text-right"><a href="/#register">Register</a> &nbsp; | &nbsp;<a href="/login">Login</a>&nbsp;</div>
            </div>
        </div>
    );


}