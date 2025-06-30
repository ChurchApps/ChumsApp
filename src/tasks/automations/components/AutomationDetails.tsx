import React from "react";
import { SmallButton, type ActionInterface, type AutomationInterface, type ConditionInterface, type ConjunctionInterface, Locale } from "@churchapps/apphelper";
import { ApiHelper, DisplayBox } from "@churchapps/apphelper";
import { ActionEdit } from "./ActionEdit";
import { AutomationEdit } from "./AutomationEdit";
import { ConditionDetails } from "./ConditionDetails";
import { ConjunctionEdit } from "./ConjunctionEdit";
import { ConditionEdit } from "./ConditionEdit";

interface Props {
  automation: AutomationInterface,
  onChange: () => void,
  onDelete?: () => void,
}

export const AutomationDetails = (props: Props) => {
  const [automation, setAutomation] = React.useState<AutomationInterface>(null);
  const [editDetails, setEditDetails] = React.useState(false);
  const [editAction, setEditAction] = React.useState<ActionInterface>(null);
  const [actions, setActions] = React.useState<ActionInterface[]>([]);
  const [conjunctions, setConjunctions] = React.useState<ConjunctionInterface[]>(null);
  const [editConjunction, setEditConjunction] = React.useState<ConjunctionInterface>(null);
  const [conditions, setConditions] = React.useState<ConditionInterface[]>(null);
  const [editCondition, setEditCondition] = React.useState<ConditionInterface>(null);

  const loadData = () => {
    ApiHelper.get("/actions/automation/" + props.automation.id, "DoingApi").then(a => setActions(a));
    ApiHelper.get("/conjunctions/automation/" + props.automation.id, "DoingApi").then(conj => setConjunctions(conj));
    ApiHelper.get("/conditions/automation/" + props.automation.id, "DoingApi").then(cond => setConditions(cond));
  }

  const init = () => {
    setAutomation(props.automation);
    loadData();
  }

  const getActions = () => {
    const result: JSX.Element[] = []
    actions.forEach(a => {
      if (a.actionType === "task") {
        const d: any = JSON.parse(a.actionData);
        const action = a;
        result.push(<li key={a.id}>
          <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { setEditAction(action); }} /></span>
          <b>{Locale.label("tasks.automationDetails.task")}:</b> {d.title} - <i>{d.assignedToLabel}</i></li>);
      }
    });
    return result;
  }

  React.useEffect(init, [props.automation]); // eslint-disable-line react-hooks/exhaustive-deps

  if (editDetails) {
    return <AutomationEdit automation={automation} onDelete={() => { setEditDetails(false); props.onDelete(); }} onCancel={() => { setEditDetails(false); }} onSave={(a: AutomationInterface) => { setEditDetails(false); setAutomation(a); props.onChange(); }} />
  } else if (editAction) {
    return <ActionEdit action={editAction} onCancel={() => setEditAction(null)} onSave={() => { setEditAction(null); loadData(); }} />
  } else if (editConjunction) {
    return <ConjunctionEdit conjunction={editConjunction} onCancel={() => setEditConjunction(null)} onSave={() => { setEditConjunction(null); loadData(); }} />
  } else if (editCondition) {
    return <ConditionEdit condition={editCondition} onCancel={() => setEditCondition(null)} onSave={() => { setEditCondition(null); loadData(); }} />
  }
  else return (
    <DisplayBox headerIcon="settings_suggest" headerText={Locale.label("tasks.automationDetails.auto")} help="chums/automations">
      <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { setEditDetails(true); }} /></span><b>{Locale.label("tasks.automationDetails.auto")}:</b>
      <hr />
      <div><b>{Locale.label("common.name")}:</b> {automation?.title}</div>
      <div><b>{Locale.label("tasks.automationDetails.rep")}:</b> {automation?.recurs}</div>
      <br />
      <span style={{ float: "right" }}><SmallButton icon="add" onClick={() => { setEditAction({ automationId: automation.id, actionType: "task" }) }} /></span><b>{Locale.label("tasks.automationDetails.acts")}:</b>
      <hr />
      <ul>
        {getActions()}
      </ul>

      <ConditionDetails automation={automation} conjunctions={conjunctions} conditions={conditions} setEditConjunction={setEditConjunction} setEditCondition={setEditCondition} />

    </DisplayBox>
  );
}
