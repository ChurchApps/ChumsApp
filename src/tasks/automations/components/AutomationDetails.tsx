import React from "react";
import { SmallButton } from "../../../appBase/components";
import { ActionInterface, ApiHelper, AutomationInterface, DisplayBox } from "../../components";
import { ActionEdit } from "./ActionEdit";
import { AutomationEdit } from "./AutomationEdit";

interface Props {
  automation: AutomationInterface,
  onChange: () => void
}

export const AutomationDetails = (props: Props) => {
  const [automation, setAutomation] = React.useState<AutomationInterface>(null);
  const [editDetails, setEditDetails] = React.useState(false);
  const [editAction, setEditAction] = React.useState<ActionInterface>(null);
  const [actions, setActions] = React.useState<ActionInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/actions/automation/" + props.automation.id, "DoingApi").then(a => setActions(a));
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
        result.push(<li>
          <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { setEditAction(action); }} /></span>
          Task: {d.title} - <i>{d.associatedWithLabel}</i></li>);
      }

    });
    return result;
  }

  React.useEffect(init, [props.automation]);

  if (editDetails) {
    return <AutomationEdit automation={automation} onCancel={() => { setEditDetails(false); }} onSave={(a: AutomationInterface) => { setEditDetails(false); setAutomation(a); props.onChange(); }} />
  } else if (editAction) {
    return <ActionEdit action={editAction} onCancel={() => setEditAction(null)} onSave={(a: ActionInterface) => { setEditAction(null); loadData(); }} />
  }
  else return (
    <DisplayBox headerIcon="settings_suggest" headerText="Automation Details" >
      <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { setEditDetails(true); }} /></span><b>Automation Details:</b>
      <hr />
      Name: {automation?.title}

      <br /><br />
      <span style={{ float: "right" }}><SmallButton icon="add" onClick={() => { setEditAction({ automationId: automation.id, actionType: "task" }) }} /></span><b>Actions:</b>
      <hr />
      <ul>
        {getActions()}
      </ul>

      <br />
      <span style={{ float: "right" }}><SmallButton icon="edit" /></span><b>Conditions:</b>
      <hr />
      <i><u>All</u> of these conditions are true</i>
      <blockquote>
        <ul>
          <li>Membership Status = 'Visitor'</li>
          <li><i><u>Any</u> of these conditions are true</i>
            <blockquote>
              <ul>
                <li>Has visited "101"</li>
                <li>Has visited "Meet and Greet"</li>
              </ul>
            </blockquote>
          </li>
        </ul>
      </blockquote>
    </DisplayBox>
  );
}
