import React, { useEffect } from "react";
import { ArrayHelper, AssignmentInterface, DateHelper, DisplayBox, PersonInterface, PlanInterface, PositionInterface, TimeInterface } from "@churchapps/apphelper";
import { BlockoutDateInterface } from "../../helpers";

interface Props {
  plan: PlanInterface,
  positions: PositionInterface[],
  assignments: AssignmentInterface[],
  people: PersonInterface[],
  times: TimeInterface[],
  blockoutDates: BlockoutDateInterface[]
}

export const PlanValidation = (props:Props) => {

  const [errors, setErrors] = React.useState<JSX.Element[]>([]);


  const validateBlockout = (issues:JSX.Element[]) => {
    const conflicts: {person:PersonInterface, blockout:BlockoutDateInterface}[] = [];
    props.people.forEach(person => {
      const assignments:AssignmentInterface[] = ArrayHelper.getAll(props.assignments, "personId", person.id);
      if (person.id==="bTrK6d0kvF6") console.log("ASSIGNMENTS", assignments)
      const positionIds = ArrayHelper.getIds(assignments, "positionId");
      const positions:PositionInterface[] = ArrayHelper.getAllArray(props.positions, "id", positionIds);
      if (person.id==="bTrK6d0kvF6") console.log("POSITIONS", positions)

      const times:TimeInterface[] = [];
      positions.forEach(p => {
        const posTimes = props.times.filter(t => t.teams.indexOf(p.categoryName)>-1);
        if (person.id==="bTrK6d0kvF6") console.log("TIMES", posTimes, p, props.times);
        times.push(...posTimes);
      });

      const blockouts:BlockoutDateInterface[] = ArrayHelper.getAll(props.blockoutDates, "personId", person.id);
      blockouts.forEach(b => {
        console.log("CHECKING BLOCKOUT", b, times)
        let conflict = false;
        times.forEach(t => {
          if (new Date(b.startDate) < new Date(t.endTime) && new Date(b.endDate) > new Date(t.startTime)) conflict = true;
        });
        if (conflict) conflicts.push({person, blockout:b});
      });
    });

    conflicts.forEach(c => {
      issues.push(<><b>{c.person.name.display}:</b> Blockout date conflict of {DateHelper.prettyDate(new Date(c.blockout.startDate))} to {DateHelper.prettyDate(new Date(c.blockout.endDate))}.</>);
    });
  }

  const validatePoisitionsFilled = (issues:JSX.Element[]) => {
    props.positions.forEach(p => {
      const assignments = props.assignments.filter(a => a.positionId === p.id);
      if (assignments.length < p.count) {
        const needed = p.count - assignments.length;
        issues.push(<><b>{p.name}:</b> {needed} more {(needed===1) ? "person" : "people"} needed.</>);
      }
    });
  }

  const checkPersonTimeConflicts = (person:PersonInterface, issues:JSX.Element[]) => {
    const assignments = props.assignments.filter(a => a.personId === person.id);
    const duties:{position:PositionInterface, times:TimeInterface[]}[] = [];
    assignments.forEach(a => {
      const position = props.positions.find(p => p.id === a.positionId);
      if (position) {
        const posTimes = props.times.filter(t => t.teams.indexOf(position.categoryName)>-1);
        duties.push({position, times:posTimes});
      }
    });

    for (let i = 0; i < duties.length; i++) {
      for (let j = i+1; j < duties.length; j++) {
        const a = duties[i];
        const b = duties[j];
        a.times.forEach(at => {
          b.times.forEach(bt => {
            if (at.startTime < bt.endTime && at.endTime > bt.startTime) {
              issues.push(<><b>{person.name.display}:</b> Time conflict between {a.position.name} and {b.position.name} during {at.displayName}.</>);
            }
          });
        });
      }
    }
  }

  const validateTimeConflicts = (issues:JSX.Element[]) => {
    props.people.forEach(person => {
      checkPersonTimeConflicts(person, issues);
    });
  }

  const validate = () => {
    const result:JSX.Element[] = [];
    validatePoisitionsFilled(result);
    validateTimeConflicts(result);
    validateBlockout(result);
    setErrors(result);
    return result.length === 0;
  }

  useEffect(() => { validate(); }, [props.assignments, props.positions, props.people]);

  const getErrorList = () => {
    if (errors.length === 0) return <p>Plan is valid.</p>;
    else {
      const lines = errors.map((e, i) => (<li key={i}>{e}</li>));
      return <ul>{lines}</ul>;
    }
  }


  return (<>
    <DisplayBox headerText="Validation" headerIcon="assignment">
      {getErrorList()}
    </DisplayBox>
  </>);
}

