import { Icon, Menu, MenuItem } from "@mui/material";
import React from "react";
import { SmallButton } from "../../../appBase/components";
import { ArrayHelper, AutomationInterface, ConditionInterface, ConjunctionInterface } from "../../components";

interface Props {
  automation: AutomationInterface,
  conjunctions: ConjunctionInterface[],
  conditions: ConditionInterface[],
  setEditConjunction: (conjunction: ConjunctionInterface) => void
  setEditCondition: (condition: ConditionInterface) => void
}

export const ConditionDetails = (props: Props) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | any>(null);
  const [parentId, setParentId] = React.useState<string>(null);

  const buildTree = (parentId: string) => {
    const conjunctions: ConjunctionInterface[] = ArrayHelper.getAll(props.conjunctions, "parentId", parentId)
    for (let c of conjunctions) {
      c.conjunctions = buildTree(c.id);
      c.conditions = ArrayHelper.getAll(props.conditions, "conjunctionId", parentId);
    }
    return conjunctions;
  }

  const tree = buildTree(null);

  const getConditionMenu = () => {
    return (
      <Menu id="addMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
        <MenuItem onClick={() => { props.setEditConjunction({ automationId: props.automation.id, groupType: "and", parentId: parentId }) }} ><Icon>account_tree</Icon> &nbsp; Add Conjunction</MenuItem>
        <MenuItem onClick={() => { props.setEditCondition({ conjunctionId: parentId, field: "dayOfWeek" }) }}  ><Icon>done</Icon> &nbsp; Add Condition</MenuItem>
      </Menu>

    );
  };

  const getLevel = (conjunctions: ConjunctionInterface[], level: number) => {
    const result: JSX.Element[] = [];
    conjunctions?.forEach(cj => {
      const conj = cj;
      const text = (cj.groupType === "or") ? (<i><u>Any</u> of these conditions are true</i>) : (<i><u>All</u> of these conditions are true</i>);
      result.push(<li>
        <span style={{ float: "right" }}><SmallButton icon="add" onClick={(e) => { setMenuAnchor(e.currentTarget); setParentId(conj.id); }} /></span>
        {text}
        {getConditionMenu()}
        {getLevel(cj.conjunctions, level + 1)}
      </li>);
    })

    if (result.length > 0) {
      return (level === 0) ? (<ul>{result}</ul>) : (<ul style={{ marginTop: 10, marginLeft: 20 }}>{result}</ul>)
    }
    else return <></>;
  }

  return (
    <>
      <br />
      <span style={{ float: "right" }}><SmallButton icon="add" onClick={() => { props.setEditConjunction({ automationId: props.automation.id, groupType: "and" }) }} /></span><b>Conditions:</b>

      <hr />

      {getLevel(tree, 0)}



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
    </>
  );
}
