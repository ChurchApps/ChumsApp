import React from "react";
import { Row, Col, Button } from "react-bootstrap";

interface Props {
    id?: string,
    children?: React.ReactNode,
    headerIcon: string,
    headerText: string,
    saveText?: string,
    headerActionContent?: React.ReactNode;
    cancelFunction?: () => void;
    deleteFunction?: () => void;
    saveFunction: () => void;
    "data-cy"?: string;
}
export const InputBox: React.FC<Props> = (props) => {
    var saveText = "Save";
    if (props.saveText !== undefined) saveText = props.saveText;

    const handleCancel = (e: React.MouseEvent) => { e.preventDefault(); props.cancelFunction(); }
    const handleDelete = (e: React.MouseEvent) => { e.preventDefault(); props.deleteFunction(); }
    const handleSave = (e: React.MouseEvent) => { e.preventDefault(); props.saveFunction(); }

    var buttons = [];
    if (props.cancelFunction !== undefined) buttons.push(<Col key="cancel"><Button variant="warning" block onClick={handleCancel} >Cancel</Button></Col >);
    if (props.deleteFunction !== undefined) buttons.push(<Col key="delete"><Button id="delete" data-cy="delete-button" variant="danger" block onClick={handleDelete} >Delete</Button></Col>);
    if (props.saveFunction !== undefined) buttons.push(<Col key="save"><Button variant="success" data-cy="save-button" block onClick={handleSave}>{saveText}</Button></Col>);

    return (
        <div id={props.id} className="inputBox" data-cy={props["data-cy"]}>
            <div className="header" data-cy="header">
                <Row>
                    <Col xs={8}><i className={props.headerIcon}></i> {props.headerText}</Col>
                    <Col xs={4} style={{ textAlign: "right" }} >{props.headerActionContent}</Col>
                </Row>
            </div>
            <div className="content">{props.children}</div>
            <div className="footer"><Row>{buttons}</Row></div>
        </div>
    );
}

