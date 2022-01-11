import React from "react";
import { DisplayBox, ImportHelper, ApiHelper, InputBox } from ".";
import { ImportGroupInterface, ImportGroupMemberInterface, ImportCampusInterface, ImportServiceInterface, ImportServiceTimeInterface, ImportGroupServiceTimeInterface, ImportPersonInterface, ImportHouseholdInterface, ImportVisitInterface, ImportSessionInterface, ImportVisitSessionInterface, ImportDonationBatchInterface, ImportDonationInterface, ImportFundInterface, ImportFundDonationInterface, ImportDataInterface, ImportFormsInterface, ImportQuestionsInterface, ImportFormSubmissions, ImportAnswerInterface } from "../../helpers/ImportHelper";

interface Props { importData: ImportDataInterface }

export const ImportStatus: React.FC<Props> = (props) => {
  const [importing, setImporting] = React.useState(false);
  const [status, setStatus] = React.useState<any>({});
  let progress: any = {};

  const runImport = async (keyName: string, code: () => void) => {
    setProgress(keyName, "running");
    await code();
    setProgress(keyName, "complete");
  }

  const importDonations = async (tmpPeople: ImportPersonInterface[]) => {
    let tmpFunds: ImportFundInterface[] = [...props.importData.funds];
    let tmpBatches: ImportDonationBatchInterface[] = [...props.importData.batches];
    let tmpDonations: ImportDonationInterface[] = [...props.importData.donations];

    await runImport("Funds", async () => {
      await ApiHelper.post("/funds", tmpFunds, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpFunds[i].id = result[i].id;
      });;
    });

    await runImport("Donation Batches", async () => {
      await ApiHelper.post("/donationbatches", tmpBatches, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpBatches[i].id = result[i].id;
      });;
    });

    await runImport("Donations", async () => {
      tmpDonations.forEach((d) => {
        d.batchId = ImportHelper.getByImportKey(tmpBatches, d.batchKey).id;
        d.personId = ImportHelper.getByImportKey(tmpPeople, d.personKey)?.id;
      });
      await ApiHelper.post("/donations", tmpDonations, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpDonations[i].id = result[i].id;
      });;
    });

    await runImport("Donation Funds", async () => {
      let tmpFundDonations: ImportFundDonationInterface[] = [...props.importData.fundDonations];
      tmpFundDonations.forEach((fd) => {
        fd.donationId = ImportHelper.getByImportKey(tmpDonations, fd.donationKey).id;
        fd.fundId = ImportHelper.getByImportKey(tmpFunds, fd.fundKey).id;
      });
      await ApiHelper.post("/funddonations", tmpFundDonations, "GivingApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpFundDonations[i].id = result[i].id;
      });;
    });
  }

  const importAttendance = async (tmpPeople: ImportPersonInterface[], tmpGroups: ImportGroupInterface[], tmpServices: ImportServiceInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
    let tmpSessions: ImportSessionInterface[] = [...props.importData.sessions];
    let tmpVisits: ImportVisitInterface[] = [...props.importData.visits];
    await runImport("Group Sessions", async () => {
      tmpSessions.forEach((s) => {
        s.groupId = ImportHelper.getByImportKey(tmpGroups, s.groupKey).id;
        s.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, s.serviceTimeKey).id;
      });
      await ApiHelper.post("/sessions", tmpSessions, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpSessions[i].id = result[i].id;
      });;
    });

    await runImport("Visits", async () => {
      tmpVisits.forEach((v) => {
        v.personId = ImportHelper.getByImportKey(tmpPeople, v.personKey).id;
        try {
          v.serviceId = ImportHelper.getByImportKey(tmpServices, v.serviceKey).id;
        } catch {
          v.groupId = ImportHelper.getByImportKey(tmpGroups, v.groupKey).id;
        }
      });
      await ApiHelper.post("/visits", tmpVisits, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpVisits[i].id = result[i].id;
      });;
    });

    await runImport("Group Attendance", async () => {
      let tmpVisitSessions: ImportVisitSessionInterface[] = [...props.importData.visitSessions];
      tmpVisitSessions.forEach((vs) => {
        vs.visitId = ImportHelper.getByImportKey(tmpVisits, vs.visitKey).id;
        vs.sessionId = ImportHelper.getByImportKey(tmpSessions, vs.sessionKey).id;
      });
      await ApiHelper.post("/visitsessions", tmpVisitSessions, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpVisitSessions[i].id = result[i].id;
      });;
    });
  }

  const importGroups = async (tmpPeople: ImportPersonInterface[], tmpServiceTimes: ImportServiceTimeInterface[]) => {
    let tmpGroups: ImportGroupInterface[] = [...props.importData.groups];
    let tmpTimes: ImportGroupServiceTimeInterface[] = [...props.importData.groupServiceTimes];
    let tmpMembers: ImportGroupMemberInterface[] = [...props.importData.groupMembers];

    await runImport("Groups", async () => {
      await ApiHelper.post("/groups", tmpGroups, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpGroups[i].id = result[i].id;
      });;
    });

    await runImport("Group Service Times", async () => {
      tmpTimes.forEach((gst) => {
        gst.groupId = ImportHelper.getByImportKey(tmpGroups, gst.groupKey).id
        gst.serviceTimeId = ImportHelper.getByImportKey(tmpServiceTimes, gst.serviceTimeKey).id
      });
      await ApiHelper.post("/groupservicetimes", tmpTimes, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpTimes[i].id = result[i].id;
      });;
    });

    await runImport("Group Members", async () => {
      tmpMembers.forEach((gm) => {
        gm.groupId = ImportHelper.getByImportKey(tmpGroups, gm.groupKey)?.id
        gm.personId = ImportHelper.getByImportKey(tmpPeople, gm.personKey)?.id
      });
      await ApiHelper.post("/groupmembers", tmpMembers, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpMembers[i].id = result[i].id;
      });;
    });

    return tmpGroups;
  }

  const importCampuses = async () => {
    let tmpCampuses: ImportCampusInterface[] = [...props.importData.campuses];
    let tmpServices: ImportServiceInterface[] = [...props.importData.services];
    let tmpServiceTimes: ImportServiceTimeInterface[] = [...props.importData.serviceTimes];

    await runImport("Campuses", async () => {
      await ApiHelper.post("/campuses", tmpCampuses, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpCampuses[i].id = result[i].id;
      });
    });

    await runImport("Services", async () => {
      tmpServices.forEach((s) => { s.campusId = ImportHelper.getByImportKey(tmpCampuses, s.campusKey).id });
      await ApiHelper.post("/services", tmpServices, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpServices[i].id = result[i].id;
      });;
    });

    await runImport("Service Times", async () => {
      tmpServiceTimes.forEach((st) => { st.serviceId = ImportHelper.getByImportKey(tmpServices, st.serviceKey).id });
      await ApiHelper.post("/servicetimes", tmpServiceTimes, "AttendanceApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpServiceTimes[i].id = result[i].id;
      });;
    });
    return { campuses: tmpCampuses, services: tmpServices, serviceTimes: tmpServiceTimes };
  }

  const importPeople = async () => {
    let tmpPeople: ImportPersonInterface[] = [...props.importData.people];
    let tmpHouseholds: ImportHouseholdInterface[] = [...props.importData.households];

    tmpPeople.forEach((p) => {
      if (p.birthDate !== undefined) p.birthDate = new Date(p.birthDate);
    });

    await runImport("Households", async () => {
      await ApiHelper.post("/households", tmpHouseholds, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpHouseholds[i].id = result[i].id;
      });
    });

    await runImport("People", async () => {

      tmpPeople.forEach((p) => {
        try {
          p.householdId = ImportHelper.getByImportKey(tmpHouseholds, p.householdKey).id;
          p.householdRole = "Other";
        } catch { }
      });

      await ApiHelper.post("/people", tmpPeople, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpPeople[i].id = result[i].id;
      });;
    });

    return tmpPeople;
  }

  const importForms = async (tmpPeople: ImportPersonInterface[]) => {
    let tmpForms: ImportFormsInterface[] = [...props.importData.forms];
    let tmpQuestions: ImportQuestionsInterface[] = [...props.importData.questions];
    let tmpFormSubmissions: ImportFormSubmissions[] = [...props.importData.formSubmissions];
    let tmpAnswers: ImportAnswerInterface[] = [...props.importData.answers];

    await runImport("Forms", async () => {
      await ApiHelper.post("/forms", tmpForms, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) {
          if (tmpForms[i]) {
            tmpForms[i].id = result[i]?.id;
          }
        }
      })
    })

    await runImport("Questions", async () => {
      tmpQuestions.forEach(q => {
        q.formId = ImportHelper.getByImportKey(tmpForms, q.formKey).id;
      })
      // Update with formId qs
      await ApiHelper.post("/questions", tmpQuestions, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpQuestions[i].id = result[i].id;
      })
    })

    await runImport("Form Submissions", async () => {
      tmpFormSubmissions.forEach(fs => {
        let formId = ImportHelper.getByImportKey(tmpForms, fs.formKey).id;;
        fs.formId = formId;
        fs.contentId = ImportHelper.getByImportKey(tmpPeople, fs.personKey).id;

        let questions: any[] = [];
        let answers: any[] = [];
        tmpQuestions.forEach(q => {
          if (q.formId === formId) {
            questions.push(q);

            tmpAnswers.forEach(a => {
              if (a.questionKey === q.questionKey) {
                answers.push({questionId: q.id, value: a.value});
              }
            })

          }
        })
        fs.questions = questions;
        fs.answers = answers;
      })
      await ApiHelper.post("/formsubmissions", tmpFormSubmissions, "MembershipApi").then(result => {
        for (let i = 0; i < result.length; i++) tmpFormSubmissions[i].id = result[i].id;
      })
    })

  }

  const handleImport = async () => {
    if (window.confirm("Are you sure you wish to load the list of people below into your database?")) {
      setImporting(true);
      let campusResult = await importCampuses();
      let tmpPeople = await importPeople();
      let tmpGroups = await importGroups(tmpPeople, campusResult.serviceTimes);
      await importAttendance(tmpPeople, tmpGroups, campusResult.services, campusResult.serviceTimes);
      await importDonations(tmpPeople);
      await importForms(tmpPeople);
    }
  }

  const setProgress = (name: string, status: string) => {
    progress[name] = status;
    setStatus({ ...progress });
  }

  const getProgress = (name: string) => {
    if (status[name] === undefined) return (<li className="pending" key={name}>{name}</li>);
    else return (<li className={status[name]} key={name}>{name}</li>);
  }

  if (importing) {
    let steps = ["Campuses", "Services", "Service Times", "Households", "People", "Groups", "Group Service Times", "Group Members", "Group Sessions", "Visits", "Group Attendance", "Funds", "Donation Batches", "Donations", "Donation Funds", "Forms", "Questions", "Form Submissions"];
    let stepsHtml: JSX.Element[] = [];
    steps.forEach((s) => stepsHtml.push(getProgress(s)));
    return (
      <DisplayBox headerText="Import" headerIcon="fas fa-upload">
                Importing content:
        <ul className="statusList">{stepsHtml}</ul>
        <p>This process may take some time.  It is important that you do not close your browser until it has finished.</p>
      </DisplayBox>
    );
  } else return (
    <InputBox headerText="Import" headerIcon="fas fa-upload" saveText="Import" saveFunction={handleImport}>
            Previewing:
      <ul className="statusList">
        <li>{props.importData.people.length} people</li>
        <li>{props.importData.groups.length} groups</li>
        <li>{props.importData.visitSessions.length} attendance records</li>
        <li>{props.importData.fundDonations.length} donations</li>
        <li>{props.importData.forms.length} forms</li>
      </ul>
                Please carefully review the preview data and if it looks good, click the Import button to start the import process.
    </InputBox>
  );

}

