import React, { useEffect } from "react";
import { DisplayBox, PersonInterface } from "@churchapps/apphelper";
import { AssignmentInterface, PlanInterface, PositionInterface, TimeInterface } from "../../helpers";

interface Props {
  plan: PlanInterface,
  positions: PositionInterface[],
  assignments: AssignmentInterface[],
  people: PersonInterface[],
  times: TimeInterface[]
}

export const PlanValidation = (props:Props) => {

  const [errors, setErrors] = React.useState<string[]>([]);

  const validatePoisitionsFilled = (issues:string[]) => {
    props.positions.forEach(p => {
      const assignments = props.assignments.filter(a => a.positionId === p.id);
      if (assignments.length < p.count) issues.push(p.name + " needs " + (p.count - assignments.length).toString() + " more people.");
    });
  }

  const checkPersonTimeConflicts = (person:PersonInterface, issues:string[]) => {
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
              issues.push(person.name.display + " has a time conflict between " + a.position.name + " and " + b.position.name + " at " + at.displayName + ".");
            }
          });
        });
      }
    }
  }

  const validateTimeConflicts = (issues:string[]) => {
    props.people.forEach(person => {
      checkPersonTimeConflicts(person, issues);
    });
  }

  const validate = () => {
    const result:string[] = [];
    validatePoisitionsFilled(result);
    validateTimeConflicts(result);
    setErrors(result);
    return result.length === 0;
  }

  useEffect(() => { validate(); }, [props.assignments, props.positions, props.people]);

  const getErrorList = () => {
    if (errors.length === 0) return <p>Plan is valid.</p>;
    else {
      const lines = errors.map((e, i) => (<li key={i}>{e}</li>));
      return <><b>Errors:</b><ul>{lines}</ul></>;
    }
  }


  return (<>
    <DisplayBox headerText="Validation" headerIcon="assignment">
      {getErrorList()}
    </DisplayBox>
  </>);
}

