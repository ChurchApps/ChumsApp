import React from "react";
import { ApiHelper, DisplayBox, ErrorMessages, UserHelper, type PersonInterface } from "@churchapps/apphelper";
import { Button, TextField, Typography } from "@mui/material";
import { ChumsPersonHelper } from "../../helpers";

interface Props {
  updateSearchResults: (people: PersonInterface[]) => void;
}

export const AISearch = (props: Props) => {
  const [text, setText] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await ApiHelper.post("/query/members", { text: text, subDomain: UserHelper.currentUserChurch.church.subDomain || "", siteUrl: window.location.host || "" }, "MembershipApi");
      props.updateSearchResults(response?.map((p: PersonInterface) => ChumsPersonHelper.getExpandedPersonObject(p)));
    } catch (error) {
      setErrors([error as string]);
    } finally {
      setIsLoading(false);
      setText("");
    }
  };

  return (
    <DisplayBox headerText="AI Search" headerIcon="person_search">
      <ErrorMessages errors={errors} />
      <TextField
        fullWidth
        multiline
        minRows={4}
        maxRows={6}
        placeholder="Show me men over 30 with birthdays in July"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <Typography sx={{ fontSize: "12px", fontStyle: "italic", my: 1 }}>
        Examples:
        <br />
        - Show me men over 30 with birthdays in July.
        <br />- Show me women who are married.
      </Typography>
      <Button fullWidth variant="contained" onClick={handleSearch} disabled={isLoading || !text || text === ""}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </DisplayBox>
  );
};
