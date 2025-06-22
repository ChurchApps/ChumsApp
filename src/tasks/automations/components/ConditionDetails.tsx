import { Icon, Menu, MenuItem } from "@mui/material";
import React from "react";
import { SmallButton, AutomationInterface, ConditionInterface, ConjunctionInterface, Locale } from "@churchapps/apphelper";
import { ArrayHelper } from "@churchapps/apphelper";

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
    for (const c of conjunctions) {
      c.conjunctions = buildTree(c.id);
      c.conditions = ArrayHelper.getAll(props.conditions, "conjunctionId", c.id);
    }
    return conjunctions;
  }

  const tree = buildTree(null);

  const getConditionMenu = () => (
    <Menu id="addMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "addMenuButton" }}>
      <MenuItem onClick={() => { props.setEditConjunction({ automationId: props.automation.id, groupType: "and", parentId: parentId }) }}><Icon>account_tree</Icon> &nbsp; {Locale.label("tasks.conditionDetails.addConj")}</MenuItem>
      <MenuItem onClick={() => { props.setEditCondition({ conjunctionId: parentId, field: "dayOfWeek" }) }}><Icon>done</Icon> &nbsp; {Locale.label("tasks.conditionDetails.addCon")}</MenuItem>
    </Menu>
  );

  const getLevel = (conjunctions: ConjunctionInterface[], conditions: ConditionInterface[], level: number) => {
    const result: JSX.Element[] = [];

    // Render conditions
    conditions?.forEach(condition => {
      result.push(
        <li key={condition.id}>
          <span style={{ float: "right" }}>
            <SmallButton icon="edit" onClick={() => props.setEditCondition(condition)} data-testid={`edit-condition-button-${condition.id}`} ariaLabel="Edit condition" />
          </span>
          <Icon style={{ marginTop: 5, marginBottom: -5 }}>done</Icon> &nbsp; {condition.label}
        </li>
      );
    });

    // Render conjunctions
    conjunctions?.forEach(conjunction => {
      const text = conjunction.groupType === "or"
        ? <i><u>{Locale.label("tasks.conditionDetails.any")}</u> {Locale.label("tasks.conditionDetails.trueCon")}</i>
        : <i><u>{Locale.label("tasks.conditionDetails.all")}</u> {Locale.label("tasks.conditionDetails.trueCon")}</i>;

      result.push(
        <li key={conjunction.id}>
          <span style={{ float: "right" }}>
            <SmallButton icon="add" onClick={(e) => { setMenuAnchor(e.currentTarget); setParentId(conjunction.id); }} data-testid={`add-conjunction-button-${conjunction.id}`} ariaLabel="Add conjunction" />
            <SmallButton icon="edit" onClick={() => props.setEditConjunction(conjunction)} data-testid={`edit-conjunction-button-${conjunction.id}`} ariaLabel="Edit conjunction" />
          </span>
          <Icon style={{ marginTop: 5, marginBottom: -5 }}>account_tree</Icon> &nbsp; {text}
          {getConditionMenu()}
          {getLevel(conjunction.conjunctions, conjunction.conditions, level + 1)}
        </li>
      );
    });

    if (result.length === 0) return null;

    return level === 0
      ? <ul>{result}</ul>
      : <ul style={{ marginTop: 10, marginLeft: 20 }}>{result}</ul>;
  };

  return (
    <>
      <br />
      <span style={{ float: "right" }}>
        <SmallButton
          icon="add"
          data-testid="add-automation-condition-button"
          ariaLabel="Add condition"
          onClick={() => props.setEditConjunction({ automationId: props.automation.id, groupType: "and" })}
        />
      </span>
      <b>{Locale.label("tasks.conditionDetails.con")}</b>
      <hr />
      {getLevel(tree, [], 0)}
    </>
  );
}
