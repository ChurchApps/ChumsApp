import React from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean;
  onHide: () => void;
  handleNo: () => void;
  handleYes: () => void;
  text: string;
}

export const UpdateHouseHold: React.FC<Props> = (props) => (
  <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
          Update Address
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        {props.text}
      </p>
    </Modal.Body>
    <Modal.Footer bsPrefix="modal-footer justify-content-center">
      <Button onClick={props.handleNo} variant="secondary" data-cy="no-button">No</Button>
      <Button onClick={props.handleYes} variant="primary" data-cy="yes-button">Yes</Button>
    </Modal.Footer>
  </Modal>
);
