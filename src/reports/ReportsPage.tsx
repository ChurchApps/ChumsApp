import React from "react";
import { DisplayBox } from "../components";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export const ReportsPage = () => {
  console.log("report page")
  return (
    <>
      <h1><i className="fas fa-table"></i> Reports</h1>
      <Row>
        <Col lg={8}>
          <DisplayBox id="reportsBox" headerIcon="fas fa-table" headerText="Reports">
            <ul>
              <li><Link to="/reports/birthdays">Birthdays</Link></li>
              <li><Link to="/reports/dailyGroupAttendance">Daily Group Attendance</Link></li>
            </ul>

          </DisplayBox>
        </Col>
      </Row>
    </>
  );
}
