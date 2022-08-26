import React from "react";
import { SmallButton } from "../../../appBase/components";
import { AutomationInterface, DisplayBox } from "../../components";

interface Props {
  automation: AutomationInterface
}

export const AutomationDetails = (props: Props) => {
  const [automation, setAutomation] = React.useState<AutomationInterface>(null);
  const [errors, setErrors] = React.useState([]);


  return (
    <DisplayBox headerIcon="settings_suggest" headerText="Automation Details" >
      <span style={{ float: "right" }}><SmallButton icon="edit" /></span><b>Automation Details:</b>
      <hr />
      Name: First Automation

      <br /><br />
      <span style={{ float: "right" }}><SmallButton icon="edit" /></span><b>Actions:</b>
      <hr />
      <ul>
        <li>Task: Schedule Lunch with Pastor - <a href="about:blank">Greeting Team</a></li>
      </ul>

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
