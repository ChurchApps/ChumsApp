import React from "react";
import { PersonInterface, ContactInfoInterface, NameInterface } from "..";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { EnvironmentHelper } from "../../../helpers"

interface Props {
  show: boolean;
  onHide: () => void;
  person1: PersonInterface;
  person2: PersonInterface;
  merge: (person: PersonInterface, personToRemove: PersonInterface) => void;
  mergeInProgress: boolean;
}

interface IConflicts {
  value: string;
  options: string[];
  selected: string;
}

enum SpecialKeys {
  CONTACT_INFO = "contactInfo",
  HOUSEHOLD_ID = "householdId",
  ID = "id",
  NAME = "name",
}

export const MergeModal: React.FC<Props> = (props) => {
  const [aggregatePerson, setAggregatePerson] = React.useState<PersonInterface>(
    null
  );
  const [conflicts, setConflicts] = React.useState<IConflicts[]>([]);
  const [error, setError] = React.useState<string>(null);

  const { person1, person2 } = props;

  const merge = () => {
    if (!person1 || !person2) {
      return;
    }

    const keys = Object.keys(person1) as Array<keyof PersonInterface>;
    const aggregate: any = {};
    const newConflicts: IConflicts[] = [];

    const determine = (
      basedOn: boolean,
      key: string,
      value1: any,
      value2: any,
      subKey?: string
    ) => {
      if (basedOn) {
        if (subKey) {
          aggregate[key][subKey] = value1 || value2;
          return;
        }
        aggregate[key] = value1 || value2;
        return;
      }

      newConflicts.push({
        value: subKey || key,
        options: [value1, value2],
        selected: ""
      });
    };

    keys.forEach((key) => {
      const value1 = person1[key];
      const value2 = person2[key];
      // TODO:: CONTACT_INFO & NAME are having almost identical code, lets have a function instead.
      switch (key) {
        case SpecialKeys.CONTACT_INFO:
          const contactKeys = Object.keys(person1.contactInfo) as Array<
            keyof ContactInfoInterface
          >;
          aggregate[SpecialKeys.CONTACT_INFO] = {};
          contactKeys.forEach((contactKey) => {
            const cv1 = person1.contactInfo[contactKey];
            const cv2 = person2.contactInfo[contactKey];
            const check = primitiveCompare(cv1, cv2);
            determine(check, key, cv1, cv2, contactKey);
          });
          break;
        case SpecialKeys.NAME:
          const nameKeys = Object.keys(person1.name) as Array<
            keyof NameInterface
          >;
          aggregate[SpecialKeys.NAME] = {};
          nameKeys.forEach((nameKey) => {
            const cv1 = person1.name[nameKey];
            const cv2 = person2.name[nameKey];
            const check = primitiveCompare(cv1, cv2);
            determine(check, key, cv1, cv2, nameKey);
          });
          break;
        case SpecialKeys.HOUSEHOLD_ID:
          aggregate.householdId = value1;
          break;
        case SpecialKeys.ID:
          aggregate.id = value1;
          break;
        default:
          const check = primitiveCompare(value1, value2);
          determine(check, key, value1, value2);
          break;
      }
    });
    setAggregatePerson(aggregate);
    setConflicts(newConflicts);
  };

  const primitiveCompare = (value1: any, value2: any): boolean => {
    if (!value2 || !value1 || value1 === value2) {
      return true;
    }
    return false;
  };

  const handleSelect = (
    propertyName: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const value = e.currentTarget.value;
    const conflictsCopy = conflicts.map((e) => {
      if (e.value === propertyName) {
        e.selected = value;
      }
      return e;
    });
    setConflicts(conflictsCopy);
  };

  const handleConfirm = () => {
    const test = conflicts.some((e) => e.selected === "");
    setError(null);
    if (test) {
      setError("Please select atleast 1 value for each field");
      return;
    }
    let person: PersonInterface = { ...aggregatePerson };
    const contactkeys = Object.keys(person1.contactInfo) as Array<
      keyof ContactInfoInterface
    >;
    const nameKeys = Object.keys(person1.name) as Array<keyof NameInterface>;

    conflicts.forEach((e) => {
      if (contactkeys.some((c) => c === e.value)) {
        person.contactInfo = {
          ...person.contactInfo,
          [e.value]: e.selected
        };
        return;
      }
      if (nameKeys.some((n) => n === e.value)) {
        person.name = {
          ...person.name,
          [e.value]: e.selected
        };
        return;
      }
      person = {
        ...person,
        [e.value]: e.selected
      };
    });
    setAggregatePerson(person);
    props.merge(person, person2);
  };

  React.useEffect(merge, [person1, person2]);

  const createConflictRows = () => conflicts.map((outer, i) => (
    <Form.Group as={Row} key={i}>
      <Form.Label as="legend" column sm={2}>
        {outer.value}
      </Form.Label>
      <Col sm={10}>
        {outer.options.map((name, index) => {
          const photoUrl = EnvironmentHelper.ContentRoot + name;
          const label = outer.value === "photo" ? (<img src={photoUrl} alt="profile" height="200px" width="200px" />) : name;
          return (
            <Form.Check
              key={index}
              type="radio"
              id={name}
              label={label}
              name={outer.value}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                handleSelect(outer.value, e)
              }
              value={name}
            />
          );
        })}
      </Col>
    </Form.Group>
  ));

  const { mergeInProgress } = props;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      data-cy="merge-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Would you like to merge {person1?.name.display} with{" "}
          {person2?.name.display}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {conflicts.length > 0 && (
          <>
            <p>Here are some fields conflicting fields: </p>
            <Container>{createConflictRows()}</Container>
            <span className="text-danger font-italic">{error}</span>
          </>
        )}
        {mergeInProgress && <p className="text-center font-italic mb-0">Merging records...</p>}
      </Modal.Body>
      <Modal.Footer bsPrefix="modal-footer justify-content-center">
        <Button
          variant="danger"
          onClick={props.onHide}
          disabled={mergeInProgress}
          data-cy="cancel-merge"
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleConfirm}
          disabled={mergeInProgress}
          data-cy="confirm-merge"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
