import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../_app";
import { toast } from "react-toastify";
import { Button, Row, Col, Card, Container } from "react-bootstrap";
import { useRouter } from "next/router";

function PatientDashboard() {
  const [doctorList, setDoctorList] = useState([]);
const router=useRouter()
  const getAllDoctors = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}/user/doctor?accountType=Doctor`
      );
      setDoctorList(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <Container>
      <h3 className="my-4">Patient Dashboard</h3>
      <div>
        <h4>Doctor's List</h4>

        <Row xs={1} md={2} lg={3} className="g-4">
          {doctorList.map((doc, i) => (
            <Col key={doc._id || i}>
              <Card className="d-flex align-items-center justify-content-center p-3">
                <Card.Img
                  variant="top"
                  src={doc.image || "/placeholder-doctor.jpg"}
                  style={{ width: "100px", height: "100px" }}
                  alt={`Dr. ${doc.name}`}
                  className="rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-doctor.jpg";
                  }}
                />
                <Card.Body>
                  <h3>{doc.name}</h3>
                  <Card.Text>{doc.specialty}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`patient/consult/${doc._id}`)}
                  >
                    Consult
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default PatientDashboard;
