import React, { useState, useEffect } from "react";
import { FormSubmission, FormSubmissionEdit, FormSubmissionInterface, UserHelper, ApiHelper, Permissions } from "./";
import { Button } from "react-bootstrap";

interface Props {
    contentType: string,
    contentId: string,
    formSubmissions: FormSubmissionInterface[],
    updatedFunction: () => void
}

export const AssociatedForms: React.FC<Props> = (props) => {
  const [mode, setMode] = useState("display");
  const [editFormSubmissionId, setEditFormSubmissionId] = useState("");
  const [allForms, setAllForms] = useState(null);
  const [unsubmittedForms, setUnsubmittedForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");

  const handleEdit = (formSubmissionId: string) => { setMode("edit"); setEditFormSubmissionId(formSubmissionId); }

  const handleUpdate = () => {
    setMode("display");
    setSelectedFormId("");
    setEditFormSubmissionId("");
    props.updatedFunction();
  }

  const handleAdd = (formId: string) => {
    setMode("edit");
    setSelectedFormId(formId);
  }

  const getCards = () => {
    let cards: any[] = [];
    const submittedCards = getSubmittedCards() || []; // when there are no submitted cards, function will return undefined
    const unsubmittedCards = getUnsubmittedCards();
    cards.push(...submittedCards,...unsubmittedCards);
    return cards;
  }

  const getSubmittedCards = () => props.formSubmissions?.map(fs => (
    <div key={fs.id} className="card">
      <div className="card-header" id={"heading" + fs.id}>
        <div>
          <Button variant="link" data-toggle="collapse" data-target={"#collapse" + fs.id} aria-controls={"collapse" + fs.id}>{fs.form.name}</Button>
        </div>
      </div>
      <div id={"collapse" + fs.id} className="collapse" aria-labelledby={"heading" + fs.id} data-parent="#formSubmissionsAccordion">
        <div className="card-body"><FormSubmission formSubmissionId={fs.id} editFunction={handleEdit} /> </div>
      </div>
    </div>
  ))

  const getUnsubmittedCards = () => unsubmittedForms.map(uf => (
    <div key={uf.id} className="card">
      <div className="card-header" id={"heading" + uf.id}>
        <div className="addableForm">
          <button className="float-right text-success no-default-style" onClick={() => handleAdd(uf.id)}>
            <i className="fas fa-plus" />
          </button>
          <span>{uf.name}</span>
        </div>
      </div>
    </div>
  ))

  const determineUnsubmitted = () => {
    let unsubmitted = [];
    if (allForms !== undefined && allForms !== null && props !== null) {
      let sf = props.formSubmissions;
      if (sf !== undefined && sf !== null) {
        for (let i = 0; i < allForms.length; i++) {
          let exists = false;
          for (let j = 0; j < sf.length; j++) if (sf[j].formId === allForms[i].id) exists = true;
          if (!exists) unsubmitted.push(allForms[i]);
        }
      } else unsubmitted = allForms;
    }

    setUnsubmittedForms(unsubmitted);
  }

  useEffect(() => {
    ApiHelper.get("/forms?contentType=person", "MembershipApi").then(data => setAllForms(data));
  }, []);

  useEffect(determineUnsubmitted, [allForms, props]);
  //add unRestrictedFormId=""
  if (!UserHelper.checkAccess(Permissions.membershipApi.forms.access)) return <></>
  if (mode === "edit") return <FormSubmissionEdit formSubmissionId={editFormSubmissionId} updatedFunction={handleUpdate} addFormId={selectedFormId} contentType={props.contentType} contentId={props.contentId} />;
  else return <div className="accordion" id="formSubmissionsAccordion">{getCards()}</div>;
}
