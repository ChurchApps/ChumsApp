import {
 FormControl, InputLabel, MenuItem, Select, TextField, Box, type SelectChangeEvent, Stack, Button 
} from "@mui/material";
import React, { memo, useCallback, useMemo } from "react";
import { PersonAdd } from "../../components";
import { ApiHelper, DateHelper, UniqueIdHelper, PersonHelper, Locale, FundDonations } from "@churchapps/apphelper";
import { type DonationInterface, type FundDonationInterface, type FundInterface, type PersonInterface } from "@churchapps/apphelper";

interface Props {
  donationId: string;
  batchId: string;
  funds: FundInterface[];
  updatedFunction: () => void;
}

export const DonationEdit = memo((props: Props) => {
  const [donation, setDonation] = React.useState<DonationInterface>({});
  const [fundDonations, setFundDonations] = React.useState<FundDonationInterface[]>([]);
  const [showSelectPerson, setShowSelectPerson] = React.useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
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
    }, [donation]);

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
    ApiHelper.post("/donations", [donation], "GivingApi").then((data) => {
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
      Promise.all(promises).then(() => props.updatedFunction());
    });
  }, [donation, fundDonations, props.updatedFunction]);

  const loadData = useCallback(() => {
    if (UniqueIdHelper.isMissing(props.donationId)) {
      setDonation({
        donationDate: new Date(),
        batchId: props.batchId,
        amount: 0,
        method: "Check",
      });
      const fd: FundDonationInterface = { amount: 0, fundId: props.funds[0]?.id };
      setFundDonations([fd]);
    } else {
      ApiHelper.get("/donations/" + props.donationId, "GivingApi").then((data) => populatePerson(data));
      ApiHelper.get("/funddonations?donationId=" + props.donationId, "GivingApi").then((data) => setFundDonations(data));
    }
  }, [props.donationId, props.batchId, props.funds]);

  const populatePerson = useCallback(async (data: DonationInterface) => {
    if (!UniqueIdHelper.isMissing(data.personId)) data.person = await ApiHelper.get("/people/" + data.personId.toString(), "MembershipApi");
    setDonation(data);
  }, []);

  const methodDetails = useMemo(() => {
    if (donation.method === "Cash") return null;
    const label = donation.method === "Check" ? Locale.label("donations.donationEdit.checkNum") : Locale.label("donations.donationEdit.lastDig");
    return <TextField fullWidth name="methodDetails" label={label} InputLabelProps={{ shrink: !!donation?.methodDetails }} value={donation.methodDetails || ""} onChange={handleChange} />;
  }, [donation.method, donation.methodDetails, handleChange]);

  const handlePersonAdd = useCallback((p: PersonInterface) => {
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
    }, [donation]);

  const handleFundDonationsChange = useCallback((fd: FundDonationInterface[]) => {
      setFundDonations(fd);
      let totalAmount = 0;
      for (let i = 0; i < fd.length; i++) totalAmount += fd[i].amount;
      if (totalAmount !== donation.amount) {
        const d = { ...donation };
        d.amount = totalAmount;
        setDonation(d);
      }
    }, [donation]);

  const handlePersonSelect = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowSelectPerson(true);
  }, []);

  const handleAnonymousSelect = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      handlePersonAdd(null);
    }, [handlePersonAdd]);

  const personSection = useMemo(() => {
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
      const personText = donation.person === undefined || donation.person === null ? Locale.label("donations.donationEdit.anon") : donation.person.name.display;
      return (
        <div>
          <a href="about:blank" className="text-decoration" data-cy="donating-person" onClick={handlePersonSelect}>
            {personText}
          </a>
        </div>
      );
    }
  }, [showSelectPerson, donation.person, handlePersonAdd, handlePersonSelect, handleAnonymousSelect]);

  React.useEffect(loadData, [loadData]);

  return (
    <Box id="donationBox" data-cy="donation-box">
      <Stack spacing={2}>
        <Box>
          <label>{Locale.label("common.person")}</label>
          {personSection}
        </Box>
        <TextField
          fullWidth
          label={Locale.label("donations.donationEdit.date")}
          type="date"
          name="date"
          value={DateHelper.formatHtml5Date(donation.donationDate) || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
            onKeyDown={handleKeyDown}
            data-testid="payment-method-select"
            aria-label="Payment method"
          >
            <MenuItem value="Check">{Locale.label("donations.donationEdit.check")}</MenuItem>
            <MenuItem value="Cash">{Locale.label("donations.donationEdit.cash")}</MenuItem>
            <MenuItem value="Card">{Locale.label("donations.donationEdit.card")}</MenuItem>
          </Select>
        </FormControl>
        {methodDetails}
        <FundDonations fundDonations={fundDonations} funds={props.funds} updatedFunction={handleFundDonationsChange} />
        <TextField
          fullWidth
          label={Locale.label("common.notes")}
          data-cy="note"
          name="notes"
          value={donation.notes || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          multiline
          data-testid="donation-notes-input"
          aria-label="Donation notes"
        />
        <Stack direction="row" spacing={1} justifyContent="end" sx={{ mt: 2 }}>
          <Button onClick={handleCancel} color="warning">
            {Locale.label("common.cancel")}
          </Button>
          {getDeleteFunction() && (
            <Button variant="outlined" onClick={getDeleteFunction()} color="error">
              {Locale.label("common.delete")}
            </Button>
          )}
          <Button variant="contained" onClick={handleSave} disableElevation>
            {Locale.label("common.save")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
});
