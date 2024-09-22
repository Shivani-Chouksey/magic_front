import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BaseUrl } from '../../_app'; // Ensure this path is correct
import { useRouter } from 'next/router';

function ConsultForm() {
    const router=useRouter();
    const {consultForm}=router.query;

       // Helper function to get a cookie by name using pure JavaScript
function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';'); // Split cookies into individual key-value pairs
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i];
      while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length); // Remove leading spaces
      if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length); // Return value of the cookie
    }
    return null; // Return null if the cookie is not found
  }

  const userId = getCookie('userId');
  console.log("userId",userId);


    const [formData, setFormData] = useState({
        currentIllnessHistory: "",
        recentSurgery: "",
        diabetesStatus: "",
        anyAllergies: "",
        other: "",
        doctorId:consultForm,
        userId  
    });

   console.log("ConsultForm",consultForm);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value : value
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BaseUrl}/user/consult`, formData);
            toast.success("Consultation form submitted successfully!");
            console.log("Consultation form data ",response);
            
            // Reset form or redirect user as needed
            setFormData({
                currentIllnessHistory: "",
                recentSurgery: "",
                diabetesStatus: "",
                anyAllergies: "",
                other: ""
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit consultation form");
        }
    };

    return (
        <Container className="my-5">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Consultation Form</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="currentIllnessHistory">
                                    <Form.Label>Current Illness History</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="currentIllnessHistory"
                                        value={formData.currentIllnessHistory}
                                        onChange={handleInputChange}
                                        placeholder="Describe your current illness"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="recentSurgery">
                                    <Form.Label>Recent Surgery</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="recentSurgery"
                                        value={formData.recentSurgery}
                                        onChange={handleInputChange}
                                        placeholder="Any recent surgeries?"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="diabetesStatus">
                                    <Form.Label>Diabetes Status</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Diabetic"
                                            name="diabetesStatus"
                                            value="diabetic"
                                            checked={formData.diabetesStatus === "diabetic"}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Non-Diabetic"
                                            name="diabetesStatus"
                                            value="non-diabetic"
                                            checked={formData.diabetesStatus === "non-diabetic"}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="anyAllergies">
                                    <Form.Label>Any Allergies</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="anyAllergies"
                                        value={formData.anyAllergies}
                                        onChange={handleInputChange}
                                        placeholder="List any allergies"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="other">
                            <Form.Label>Other Information</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="other"
                                value={formData.other}
                                onChange={handleInputChange}
                                placeholder="Any other relevant information"
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="primary" type="submit" size="lg">
                                Submit Consultation Form
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ConsultForm;