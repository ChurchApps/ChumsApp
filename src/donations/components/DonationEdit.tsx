import { FormControl, InputLabel, MenuItem, Select, TextField, Box, Button, Typography, type SelectChangeEvent } from "@mui/material";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { PersonAdd } from "../../components";
import { ApiHelper, DateHelper, UniqueIdHelper, PersonHelper, Locale, InputBox } from "@churchapps/apphelper";
import { FundDonations } from "./FundDonations";
import { type DonationInterface, type FundDonationInterface, type FundInterface, type PersonInterface } from "@churchapps/helpers";

interface Props {
  donationId: string;
  batchId: string;
  funds: FundInterface[];
  updatedFunction: () => void;
  defaultValues?: {
    personId: string;
    person: PersonInterface | null;
    donationDate: Date;
    method: string;
    methodDetails: string;
    notes: string;
    fundDonations: FundDonationInterface[];
  };
  setDefaultValues?: (values: any) => void;
  defaultsSet?: boolean;
  setDefaultsSet?: (value: boolean) => void;
}

export const DonationEdit = memo((props: Props) => {
  const [donation, setDonation] = React.useState<DonationInterface>({});
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
  const [showSelectPerson, setShowSelectPerson] = React.useState(false);
  const [editingDefaults, setEditingDefaults] = React.useState(false);

  // Use props for default values if provided, otherwise use local defaults
  const defaultValues = props.defaultValues || {
    personId: "",
    person: null as PersonInterface | null,
    donationDate: new Date(),
    method: "Check",
    methodDetails: "",
    notes: "",
    fundDonations: [{ amount: 0, fundId: "" }] as FundDonationInterface[]
  };

  const setDefaultValues = props.setDefaultValues || (() => {});
  const defaultsSet = props.defaultsSet || false;
  const setDefaultsSet = props.setDefaultsSet || (() => {});

  // Temporary values while editing defaults
  const [tempDefaultValues, setTempDefaultValues] = React.useState(defaultValues);

  // Refs for form fields
  const dateRef = useRef<HTMLInputElement>(null);
  const methodRef = useRef<HTMLInputElement>(null);
  const methodDetailsRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLInputElement>(null);

  const handleDateKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      methodRef.current?.focus();
    }
  }, []);

  const handleMethodKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (donation.method === "Cash") {
        // Skip to fund donations if cash (no method details)
        // The FundDonations component will handle its own focus
      } else {
        methodDetailsRef.current?.focus();
      }
    }
  }, [donation.method]);

  const handleMethodDetailsKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Focus will move to the first amount field in FundDonations
    }
  }, []);

  // Moved handleSave before handleNotesKeyDown to resolve dependency

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
      if (editingDefaults) {
        const temp = { ...tempDefaultValues };
        const value = e.target.value;
        switch (e.target.name) {
          case "notes":
            temp.notes = value;
            break;
          case "date":
            temp.donationDate = new Date(value);
            break;
          case "method":
            temp.method = value;
            break;
          case "methodDetails":
            temp.methodDetails = value;
            break;
        }
        setTempDefaultValues(temp);
      } else {
        const d = { ...donation } as DonationInterface;
        const value = e.target.value;
        switch (e.target.name) {
          case "notes":
            d.notes = value;
            break;
          case "date":
            d.donationDate = new Date(value);
            break;
          case "method":
            d.method = value;
            break;
          case "methodDetails":
            d.methodDetails = value;
            break;
        }
        setDonation(d);
      }
    },
    [donation, editingDefaults, tempDefaultValues]
  );

  const handleCancel = useCallback(() => {
    props.updatedFunction();
  }, [props.updatedFunction]);

  const handleDelete = useCallback(() => {
    ApiHelper.delete("/donations/" + donation.id, "GivingApi").then(() => {
      props.updatedFunction();
    });
  }, [donation.id, props.updatedFunction]);

  const getDeleteFunction = useCallback(() => (UniqueIdHelper.isMissing(props.donationId) ? undefined : handleDelete), [props.donationId, handleDelete]);

  const handleSave = useCallback(() => {
    const donationToSave = {
      ...donation,
      donationDate: donation.donationDate ? DateHelper.formatHtml5Date(donation.donationDate) : null,
    };
    ApiHelper.post("/donations", [donationToSave], "GivingApi").then((data) => {
      const id = data[0].id;
      const promises = [];
      const fDonations = [...fundDonations];
      for (let i = fDonations.length - 1; i >= 0; i--) {
        const fd = fundDonations[i];
        if (fd.amount === undefined || fd.amount === 0) {
          if (!UniqueIdHelper.isMissing(fd.id)) promises.push(ApiHelper.delete("/funddonations/" + fd.id, "GivingApi"));
          fDonations.splice(i, 1);
        } else fd.donationId = id;
      }
      if (fDonations.length > 0) promises.push(ApiHelper.post("/funddonations", fDonations, "GivingApi"));
      Promise.all(promises).then(() => {
        // Reset form to defaults after successful save
        if (defaultsSet) {
          setDonation({
            ...defaultValues,
            batchId: props.batchId,
            amount: defaultValues.fundDonations.reduce((sum, fd) => sum + fd.amount, 0)
          });
          setFundDonations([...defaultValues.fundDonations.map(fd => ({...fd, fundId: fd.fundId || props.funds[0]?.id}))]);
        } else {
          setDonation({
            donationDate: new Date(),
            batchId: props.batchId,
            amount: 0,
            method: "Check",
          });
          const fd: FundDonationInterface = { amount: 0, fundId: props.funds[0]?.id };
          setFundDonations([fd]);
        }
        props.updatedFunction();
      });
    });
  }, [donation, fundDonations, props.updatedFunction, defaultsSet, defaultValues, props.batchId, props.funds]);

  const handleNotesKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  const loadData = useCallback(() => {
    if (UniqueIdHelper.isMissing(props.donationId)) {
      // Use default values if they've been set, otherwise use original defaults
      if (defaultsSet && !editingDefaults) {
        setDonation({
          ...defaultValues,
          batchId: props.batchId,
          amount: defaultValues.fundDonations.reduce((sum, fd) => sum + fd.amount, 0)
        });
        setFundDonations([...defaultValues.fundDonations.map(fd => ({...fd, fundId: fd.fundId || props.funds[0]?.id}))]);
      } else {
        setDonation({
          donationDate: new Date(),
          batchId: props.batchId,
          amount: 0,
          method: "Check",
        });
        const fd: FundDonationInterface = { amount: 0, fundId: props.funds[0]?.id };
        setFundDonations([fd]);
      }
    } else {
      ApiHelper.get("/donations/" + props.donationId, "GivingApi").then((data) => populatePerson(data));
      ApiHelper.get("/funddonations?donationId=" + props.donationId, "GivingApi").then((data) => setFundDonations(data));
    }
  }, [props.donationId, props.batchId, props.funds, defaultsSet, defaultValues, editingDefaults]);

  const populatePerson = useCallback(async (data: DonationInterface) => {
    if (!UniqueIdHelper.isMissing(data.personId)) data.person = await ApiHelper.get("/people/" + data.personId.toString(), "MembershipApi");
    if (data.donationDate) data.donationDate = new Date(data.donationDate.split("T")[0] + "T00:00:00");
    setDonation(data);
  }, []);

  const methodDetails = useMemo(() => {
    const currentMethod = editingDefaults ? tempDefaultValues.method : donation.method;
    const currentMethodDetails = editingDefaults ? tempDefaultValues.methodDetails : donation.methodDetails;
    if (currentMethod === "Cash") return null;
    const label = currentMethod === "Check" ? Locale.label("donations.donationEdit.checkNum") : Locale.label("donations.donationEdit.lastDig");
    return <TextField fullWidth name="methodDetails" label={label} InputLabelProps={{ shrink: !!currentMethodDetails }} value={currentMethodDetails || ""} onChange={handleChange} onKeyDown={editingDefaults ? undefined : handleMethodDetailsKeyDown} inputRef={editingDefaults ? undefined : methodDetailsRef} />;
  }, [donation.method, donation.methodDetails, tempDefaultValues.method, tempDefaultValues.methodDetails, editingDefaults, handleChange, handleMethodDetailsKeyDown]);

  const handlePersonAdd = useCallback(
    (p: PersonInterface) => {
      if (editingDefaults) {
        const temp = { ...tempDefaultValues };
        if (p === null) {
          temp.person = null;
          temp.personId = "";
        } else {
          temp.person = p;
          temp.personId = p.id;
        }
        setTempDefaultValues(temp);
        setShowSelectPerson(false);
      } else {
        const d = { ...donation } as DonationInterface;
        if (p === null) {
          d.person = null;
          d.personId = "";
        } else {
          d.person = p;
          d.personId = p.id;
        }
        setDonation(d);
        setShowSelectPerson(false);
      }
    },
    [donation, editingDefaults, tempDefaultValues]
  );

  const handleFundDonationsChange = useCallback(
    (fd: FundDonationInterface[]) => {
      if (editingDefaults) {
        const temp = { ...tempDefaultValues };
        temp.fundDonations = fd;
        setTempDefaultValues(temp);
      } else {
        setFundDonations(fd);
        let totalAmount = 0;
        for (let i = 0; i < fd.length; i++) totalAmount += fd[i].amount;
        if (totalAmount !== donation.amount) {
          const d = { ...donation };
          d.amount = totalAmount;
          setDonation(d);
        }
      }
    },
    [donation, editingDefaults, tempDefaultValues]
  );

  const handleLastFundFieldEnter = useCallback(() => {
    notesRef.current?.focus();
  }, []);

  const handlePersonSelect = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowSelectPerson(true);
  }, []);

  const handleAnonymousSelect = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handlePersonAdd(null);
    },
    [handlePersonAdd]
  );

  const personSection = useMemo(() => {
    const currentPerson = editingDefaults ? tempDefaultValues.person : donation.person;
    if (showSelectPerson) {
      return (
        <>
          <PersonAdd getPhotoUrl={PersonHelper.getPhotoUrl} addFunction={handlePersonAdd} />
          <hr />
          <a href="about:blank" className="text-decoration" onClick={handleAnonymousSelect}>
            {Locale.label("donations.donationEdit.anon")}
          </a>
        </>
      );
    } else {
      const personText = currentPerson === undefined || currentPerson === null ? Locale.label("donations.donationEdit.anon") : currentPerson.name.display;
      return (
        <div>
          <a href="about:blank" className="text-decoration" data-cy="donating-person" onClick={handlePersonSelect}>
            {personText}
          </a>
        </div>
      );
    }
  }, [showSelectPerson, donation.person, tempDefaultValues.person, editingDefaults, handlePersonAdd, handlePersonSelect, handleAnonymousSelect]);

  const handleEditDefaults = useCallback(() => {
    setEditingDefaults(true);
    // Copy current values to temp defaults
    // If defaults have been set already, use them, otherwise use current donation values
    if (defaultsSet) {
      setTempDefaultValues({...defaultValues});
    } else {
      setTempDefaultValues({
        personId: donation.personId || "",
        person: donation.person || null,
        donationDate: donation.donationDate || new Date(),
        method: donation.method || "Check",
        methodDetails: donation.methodDetails || "",
        notes: donation.notes || "",
        fundDonations: [...fundDonations]
      });
    }
  }, [donation, fundDonations, defaultValues, defaultsSet]);

  const handleSaveDefaults = useCallback(() => {
    setDefaultValues({...tempDefaultValues});
    setDefaultsSet(true);
    setEditingDefaults(false);
    // Apply defaults to current donation
    setDonation({
      ...donation,
      ...tempDefaultValues,
      batchId: donation.batchId,
      id: donation.id,
      amount: tempDefaultValues.fundDonations.reduce((sum, fd) => sum + fd.amount, 0)
    });
    setFundDonations([...tempDefaultValues.fundDonations]);
  }, [tempDefaultValues, donation, setDefaultValues, setDefaultsSet]);

  const handleCancelDefaults = useCallback(() => {
    setEditingDefaults(false);
    setTempDefaultValues({...defaultValues});
  }, [defaultValues]);

  const handleResetDefaults = useCallback(() => {
    const originalDefaults = {
      personId: "",
      person: null,
      donationDate: new Date(),
      method: "Check" as string,
      methodDetails: "",
      notes: "",
      fundDonations: [{ amount: 0, fundId: props.funds[0]?.id }] as FundDonationInterface[]
    };
    setTempDefaultValues(originalDefaults);
  }, [props.funds]);

  // Update temp defaults when defaultValues change from props
  React.useEffect(() => {
    if (!editingDefaults) {
      setTempDefaultValues(defaultValues);
    }
  }, [defaultValues, editingDefaults]);

  React.useEffect(loadData, [loadData]);

  if (editingDefaults) {
    return (
      <InputBox
        id="donationBox"
        headerIcon="attach_money"
        headerText="Edit Donation Defaults"
        help="chums/donations">
        <Box>
          <label>{Locale.label("common.name")}</label>
          {personSection}
        </Box>
        <TextField
          fullWidth
          label={Locale.label("donations.donationEdit.date")}
          type="date"
          name="date"
          value={DateHelper.formatHtml5Date(tempDefaultValues.donationDate) || ""}
          onChange={handleChange}
          data-testid="donation-date-input"
          aria-label="Donation date"
        />
        <FormControl fullWidth>
          <InputLabel id="method">{Locale.label("donations.donationEdit.method")}</InputLabel>
          <Select
            name="method"
            labelId="method"
            label={Locale.label("donations.donationEdit.method")}
            value={tempDefaultValues.method || ""}
            onChange={handleChange}
            data-testid="payment-method-select"
            aria-label="Payment method">
            <MenuItem value="Check">{Locale.label("donations.donationEdit.check")}</MenuItem>
            <MenuItem value="Cash">{Locale.label("donations.donationEdit.cash")}</MenuItem>
            <MenuItem value="Card">{Locale.label("donations.donationEdit.card")}</MenuItem>
          </Select>
        </FormControl>
        {methodDetails}
        <label>{Locale.label("donations.funds.fund")}</label>
        <FundDonations fundDonations={tempDefaultValues.fundDonations} funds={props.funds} updatedFunction={handleFundDonationsChange} />
        <TextField
          fullWidth
          label={Locale.label("common.notes")}
          data-cy="note"
          name="notes"
          value={tempDefaultValues.notes || ""}
          onChange={handleChange}
          multiline
          data-testid="donation-notes-input"
          aria-label="Donation notes"
        />
        <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: 1, mt: 2 }}>
          <Button variant="contained" onClick={handleSaveDefaults}>Save Defaults</Button>
          <Button color="warning" onClick={handleResetDefaults}>Reset to Original</Button>
          <Button color="error" onClick={handleCancelDefaults}>Cancel</Button>
        </Box>
      </InputBox>
    );
  }

  return (
    <InputBox
      id="donationBox"
      headerIcon="attach_money"
      headerText={Locale.label("common.edit")}
      cancelFunction={UniqueIdHelper.isMissing(props.donationId) ? undefined : handleCancel}
      deleteFunction={getDeleteFunction()}
      saveFunction={UniqueIdHelper.isMissing(props.donationId) ? undefined : handleSave}
      help="chums/donations">
      <Box>
        <label>{Locale.label("common.name")}</label>
        {personSection}
      </Box>
      <TextField
        fullWidth
        label={Locale.label("donations.donationEdit.date")}
        type="date"
        name="date"
        value={DateHelper.formatHtml5Date(donation.donationDate) || ""}
        onChange={handleChange}
        onKeyDown={handleDateKeyDown}
        inputRef={dateRef}
        data-testid="donation-date-input"
        aria-label="Donation date"
      />
      <FormControl fullWidth>
        <InputLabel id="method">{Locale.label("donations.donationEdit.method")}</InputLabel>
        <Select
          name="method"
          labelId="method"
          label={Locale.label("donations.donationEdit.method")}
          value={donation.method || ""}
          onChange={handleChange}
          onKeyDown={handleMethodKeyDown}
          inputRef={methodRef}
          data-testid="payment-method-select"
          aria-label="Payment method">
          <MenuItem value="Check">{Locale.label("donations.donationEdit.check")}</MenuItem>
          <MenuItem value="Cash">{Locale.label("donations.donationEdit.cash")}</MenuItem>
          <MenuItem value="Card">{Locale.label("donations.donationEdit.card")}</MenuItem>
        </Select>
      </FormControl>
      {methodDetails}
      <label>{Locale.label("donations.funds.fund")}</label>
      <FundDonations fundDonations={fundDonations} funds={props.funds} updatedFunction={handleFundDonationsChange} onLastFieldEnter={handleLastFundFieldEnter} />
      <TextField
        fullWidth
        label={Locale.label("common.notes")}
        data-cy="note"
        name="notes"
        value={donation.notes || ""}
        onChange={handleChange}
        onKeyDown={handleNotesKeyDown}
        inputRef={notesRef}
        multiline
        data-testid="donation-notes-input"
        aria-label="Donation notes"
      />
      {UniqueIdHelper.isMissing(props.donationId) && (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <Button onClick={handleCancel} color="warning" sx={{ "&:focus": { outline: "none" } }}>{Locale.label("common.cancel")}</Button>
          <Button color="primary" onClick={handleEditDefaults}>Edit Donation Defaults</Button>
          <Button type="button" variant="contained" disableElevation aria-label="Save" onClick={handleSave} sx={{ "&:focus": { outline: "none" } }}>{Locale.label("common.save")}</Button>
        </Box>
      )}
    </InputBox>
  );
});
