import { ArrayHelper, CurrencyHelper, DateHelper } from "@churchapps/apphelper";
import { type DonationInterface, type FundDonationInterface, type FundInterface, type PersonInterface } from "@churchapps/helpers";
import React, { useContext, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UserContext from "../UserContext";

export const PrintDonationPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  let currYear = new Date().getFullYear();
  if (searchParams.get("prev") === "1") {
    currYear = currYear - 1;
  }
  const context = useContext(UserContext);

  const person = useQuery<PersonInterface>({
    queryKey: ["/people/" + params.personId, "MembershipApi"],
    placeholderData: undefined,
  });

  const funds = useQuery<FundInterface[]>({
    queryKey: ["/funds", "GivingApi"],
    placeholderData: [],
  });

  const allDonations = useQuery<DonationInterface[]>({
    queryKey: ["/donations?personId=" + params.personId, "GivingApi"],
    placeholderData: [],
  });

  const allFundDonations = useQuery<FundDonationInterface[]>({
    queryKey: ["/fundDonations?personId=" + params.personId, "GivingApi"],
    placeholderData: [],
  });

  const donations = useMemo(() => {
    return allDonations.data?.filter((don) => {
      const donationDate = new Date(don.donationDate);
      return donationDate.getFullYear() === currYear;
    }) || [];
  }, [allDonations.data, currYear]);

  const fundDonations = useMemo(() => {
    return allFundDonations.data?.filter((fundDonation) => donations.some((donation) => donation.id === fundDonation.donationId)) || [];
  }, [allFundDonations.data, donations]);

  useEffect(() => {
    if (person.data && funds.data && donations.length >= 0 && fundDonations.length >= 0) {
      setTimeout(() => {
        window.print();
        navigate(-1);
      }, 1500);
    }
  }, [person.data, funds.data, donations, fundDonations, navigate]);

  const getDate = () => {
    const date = DateHelper.prettyDate(new Date());
    const time = DateHelper.prettyTime(new Date());
    const dateTime = `${date} ${time}`;
    return dateTime;
  };

  const getTotalContributions = () => {
    let result = 0;
    fundDonations.forEach((d) => {
      const donation = ArrayHelper.getOne(donations, "id", d.donationId);
      if (donation) {
        result += d.amount;
      }
    });
    return CurrencyHelper.formatCurrency(result);
  };

  const getFundArray = () => {
    const result: any[] = [];
    fundDonations.forEach((fd) => {
      const fund = ArrayHelper.getOne(funds.data || [], "id", fd.fundId);
      const donation = ArrayHelper.getOne(donations, "id", fd.donationId);
      if (donation) {
        result.push({ fund: fund?.name, amount: fd.amount });
      }
    });
    return result;
  };

  const tableFundTotal = () => {
    const fundArray = getFundArray();
    const result: any[] = [];
    fundArray.forEach((fd) => {
      const existing = ArrayHelper.getOne(result, "fund", fd.fund);
      if (existing) {
        existing.total += fd.amount;
      } else {
        result.push({ fund: fd.fund, total: fd.amount });
      }
    });
    const tableValues: React.ReactElement[] = [];

    result.forEach((tv) => {
      tableValues.push(<tr style={{ height: "24px" }}>
          <td
            style={{
              borderBottom: "2px solid #1976D2",
              borderRight: "2px solid #1976D2",
              borderCollapse: "collapse",
              textAlign: "left",
              width: "70%",
              paddingLeft: "5px",
            }}
          >
            {tv.fund}
          </td>
          <td
            style={{
              borderBottom: "2px solid #1976D2",
              borderLeft: "2px solid #1976D2",
              borderCollapse: "collapse",
              textAlign: "right",
              width: "30%",
              paddingRight: "5px",
            }}
          >
            {CurrencyHelper.formatCurrency(tv.total)}
          </td>
        </tr>);
    });
    return tableValues;
  };

  const tableDonations = () => {
    const result: React.ReactElement[] = [];
    fundDonations.forEach((fd) => {
      const donation = ArrayHelper.getOne(donations, "id", fd.donationId);
      const fund = ArrayHelper.getOne(funds.data || [], "id", fd.fundId);
      if (donation) {
        result.push(<tr style={{ height: "28px" }}>
            <td
              style={{
                borderBottom: "2px solid #1976D2",
                borderRight: "2px solid #1976D2",
                borderCollapse: "collapse",
                textAlign: "left",
                width: "20%",
                paddingLeft: "5px",
              }}
            >
              {DateHelper.prettyDate(donation?.donationDate).toString()}
            </td>
            <td
              style={{
                borderBottom: "2px solid #1976D2",
                borderRight: "2px solid #1976D2",
                borderCollapse: "collapse",
                textAlign: "left",
                width: "15%",
                paddingLeft: "5px",
              }}
            >
              {donation?.method}
            </td>
            <td
              style={{
                borderBottom: "2px solid #1976D2",
                borderRight: "2px solid #1976D2",
                borderCollapse: "collapse",
                textAlign: "left",
                width: "45%",
                paddingLeft: "5px",
              }}
            >
              {fund?.name}
            </td>
            <td
              style={{
                borderBottom: "2px solid #1976D2",
                borderLeft: "2px solid #1976D2",
                borderCollapse: "collapse",
                textAlign: "right",
                width: "20%",
                paddingRight: "5px",
              }}
            >
              {CurrencyHelper.formatCurrency(fd.amount)}
            </td>
          </tr>);
      }
    });
    return result;
  };


  return (
    <>
      <div
        style={{
          margin: "0px",
          padding: "0px",
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <div
          style={{
            margin: "0px",
            padding: "0px",
            borderTop: "24px solid #1976D2",
            width: "100%",
          }}
        ></div>

        <div style={{ margin: "0px", padding: "0px", width: "100%" }}>
          <h1>{currYear} Annual Giving Statement</h1>
          <p>Period: Jan 1 - Dec 31, {currYear}</p>
          <p>Issued: {getDate()}</p>
        </div>
        <div
          style={{
            margin: "0px",
            padding: "0px",
            borderTop: "2px solid #1976D2",
            width: "80%",
          }}
        ></div>

        <div style={{ display: "flex" }}>
          {/* Donor */}
          <div style={{ width: "50%" }}>
            <h1>{person.data?.name?.display}</h1>
            <p>{person.data?.contactInfo?.address1}</p>
            <p>{person.data?.contactInfo?.address2}</p>
            <p>{person.data?.contactInfo?.mobilePhone}</p>
            <p>{person.data?.contactInfo?.email}</p>
          </div>
          {/* Church */}
          <div style={{ width: "50%" }}>
            <h1>{context.userChurch?.church?.name}</h1>
            <p>{context.userChurch?.church?.address1}</p>
            <p>{context.userChurch?.church?.address2}</p>
            <p>
              {context.userChurch?.church?.city}, {context.userChurch?.church?.country}, {context.userChurch?.church?.zip}
            </p>
          </div>
        </div>
        <div
          style={{
            margin: "0px",
            padding: "0px",
            borderTop: "2px solid #1976D2",
            width: "80%",
          }}
        ></div>

        <div>
          <h1>Statement Summary:</h1>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <h2>Total Contributions:</h2>
              <div
                style={{
                  height: "80px",
                  lineHeight: "80px",
                  width: "80%",
                  textAlign: "center",
                  border: "4px solid #1976D2",
                  fontSize: "40px",
                }}
              >
                {getTotalContributions()}
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <h2>Funds:</h2>
              {/* Table Start */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ height: "24px" }}>
                  <tr>
                    <th
                      style={{
                        borderBottom: "2px solid #1976D2",
                        borderCollapse: "collapse",
                        textAlign: "left",
                        width: "70%",
                        paddingLeft: "5px",
                      }}
                    >
                      Fund
                    </th>
                    <th
                      style={{
                        borderBottom: "2px solid #1976D2",
                        borderCollapse: "collapse",
                        textAlign: "right",
                        width: "30%",
                        paddingRight: "5px",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>{tableFundTotal()}</tbody>
              </table>
              {/* Table End */}
            </div>
          </div>
        </div>

        <div>
          <h1>Contribution Details:</h1>
          {/* Table Start */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ height: "28px" }}>
              <tr>
                <th
                  style={{
                    borderBottom: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    width: "15%",
                    paddingLeft: "5px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    width: "15%",
                    paddingLeft: "5px",
                  }}
                >
                  Method
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    width: "50%",
                    paddingLeft: "5px",
                  }}
                >
                  Fund
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "right",
                    width: "20%",
                    paddingRight: "5px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {tableDonations()}
              <tr style={{ height: "28px" }}>
                <td
                  style={{
                    borderTop: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    width: "15%",
                    paddingLeft: "5px",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    width: "15%",
                    paddingLeft: "5px",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "right",
                    width: "50%",
                    paddingRight: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Total Contributions:
                </td>
                <td
                  style={{
                    borderTop: "2px solid #1976D2",
                    borderCollapse: "collapse",
                    textAlign: "right",
                    width: "20%",
                    paddingRight: "5px",
                    fontWeight: "bold",
                  }}
                >
                  {getTotalContributions()}
                </td>
              </tr>
            </tbody>
          </table>
          {/* Table End */}
        </div>
      </div>
    </>
  );
};
