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
      c.conditions = ArrayHelper.getAll(props.conditions, "conjunctionId", c.id);
    }
    return conjunctions;
  }

  const tree = buildTree(null);

  const getConditionMenu = () => (
    <Menu id="addMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
      <MenuItem onClick={() => { props.setEditConjunction({ automationId: props.automation.id, groupType: "and", parentId: parentId }) }}><Icon>account_tree</Icon> &nbsp; Add Conjunction</MenuItem>
      <MenuItem onClick={() => { props.setEditCondition({ conjunctionId: parentId, field: "dayOfWeek" }) }}><Icon>done</Icon> &nbsp; Add Condition</MenuItem>
    </Menu>
  );

  const getLevel = (conjunctions: ConjunctionInterface[], conditions: ConditionInterface[], level: number) => {
    const result: JSX.Element[] = [];
    conditions?.forEach(cd => {
      const cond = cd;
      result.push(<li>
        <span style={{ float: "right" }}><SmallButton icon="edit" onClick={() => { props.setEditCondition(cond); }} /></span>
        <Icon style={{ marginTop: 5, marginBottom: -5 }}>done</Icon> &nbsp; {cd.label}
      </li>)
    });
    conjunctions?.forEach(cj => {
      const conj = cj;
      const text = (cj.groupType === "or") ? (<i><u>Any</u> of these conditions are true</i>) : (<i><u>All</u> of these conditions are true</i>);
      result.push(<li>
        <span style={{ float: "right" }}>
          <SmallButton icon="add" onClick={(e) => { setMenuAnchor(e.currentTarget); setParentId(conj.id); console.log(conj.id) }} />
          <SmallButton icon="edit" onClick={() => { props.setEditConjunction(conj); }} />
        </span>
        <Icon style={{ marginTop: 5, marginBottom: -5 }}>account_tree</Icon> &nbsp; {text}
        {getConditionMenu()}
        {getLevel(cj.conjunctions, cj.conditions, level + 1)}
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
      {getLevel(tree, [], 0)}
    </>
  );
}
