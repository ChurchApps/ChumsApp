import React from "react";
import { DisplayBox } from "../components";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Wrapper } from "../components/Wrapper";

export const ReportsPage = () => {
  console.log("report page")
  return (
    <Wrapper pageTitle="Reports">
      <h1><i className="fas fa-table"></i> Reports</h1>
      <Row>
        <Col lg={8}>
          <DisplayBox id="reportsBox" headerIcon="fas fa-table" headerText="Reports">
            <ul>
              <li><Link to="/reports/birthdays">Birthdays</Link></li>
              <li><Link to="/reports/attendanceTrend">Attendance Trend</Link></li>
              <li><Link to="/reports/groupAttendance">Group Attendance</Link></li>
              <li><Link to="/reports/dailyGroupAttendance">Daily Group Attendance</Link></li>
              <li><Link to="/reports/donationSummary">Donation Summary</Link></li>
            </ul>

          </DisplayBox>
        </Col>
      </Row>
    </Wrapper>
  );
}
