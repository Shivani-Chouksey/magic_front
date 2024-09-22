import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BaseUrl } from "../_app";
import { Button, Form, Modal, Table } from "react-bootstrap";

function Index() {
  const [allConsult, setAllConsult] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    careTaken: '',
    medicines: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = (consult) => {
    setSelectedConsult(consult);
    setShow(true);
  };

  const getAllData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/user/consult`);
      console.log("response", response);
      setAllConsult(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch consultations");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({ ...prescriptionData, [name]: value });
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    if (!selectedConsult) return;

    try {
      const updatedConsult = {
        ...selectedConsult,
        prescription: prescriptionData, // Add prescription data to consult
      };

      const response = await axios.patch(`${BaseUrl}/user/consult/${selectedConsult._id}`, updatedConsult);
      toast.success(response.data.message);
      setShow(false);
      setPrescriptionData({ careTaken: '', medicines: '' }); // Reset the form
      getAllData(); // Refresh the consultations list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update consultation");
    }
  };

  const handlePrint = (consult) => {
  
    const printContent = `
      <h2>Prescription for Patient</h2>
      <p><strong>Care to be taken:</strong> ${consult.careTaken}</p>
      <p><strong>Medicines:</strong> ${consult.medicines}</p>
      <p><strong>current Illness History:</strong> ${consult.currentIllnessHistory}</p>
      <p><strong>any Allergies:</strong> ${consult.anyAllergies}</p>
      <p><strong>other:</strong> ${consult.other}</p>
      <p><strong>recent Surgery:</strong> ${consult.recentSurgery}</p>
    `;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div className="p-4">
      <h3>Consultations List</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Any Allergies</th>
            <th>Current Illness History</th>
            <th>Other</th>
            <th>Recent Surgery</th>
            <th>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {allConsult.map((consult, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{consult.anyAllergies}</td>
              <td>{consult.currentIllnessHistory}</td>
              <td>{consult.other}</td>
              <td>{consult.recentSurgery}</td>
              <td className="d-flex ">
    <Button  className="me-2"  onClick={() => handlePrint(consult)}>Print Prescription</Button>
    <Button onClick={() => handleShow(consult)}>Add Prescription</Button>
</td>

            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPrescription}>
            <Form.Group className="mb-3" controlId="careTaken">
              <Form.Label>Care to be taken</Form.Label>
              <Form.Control
                type="text"
                name="careTaken"
                placeholder="Care to be taken"
                value={prescriptionData.careTaken}
                onChange={handleInputChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="medicines">
              <Form.Label>Medicines</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="medicines"
                value={prescriptionData.medicines}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Index;
