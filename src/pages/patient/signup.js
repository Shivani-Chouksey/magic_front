import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { BaseUrl } from "../_app";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function SignupSignin() {
  const [formSwitch, setFormSwitch] = useState(false);
  const router = useRouter();
  const { pathname } = router;
  const [user,setUser]=useState({})

  const accountType = pathname.split("/")[1];
  const capitalizedAccountType = accountType.charAt(0).toUpperCase() + accountType.slice(1);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    surgeryHistory: "",
    age: "",
    illnessHistory: "",
    image: "",
    accountType: capitalizedAccountType,
  });

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
    accountType: capitalizedAccountType,
  });

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'signup') {
      setSignupData(prev => ({ ...prev, [name]: value }));
    } else {
      setSigninData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64URL = await convertImageToBase64URL(file);
        setSignupData(prev => ({ ...prev, image: base64URL }));
      } catch (error) {
        console.error("Error converting image to base64:", error);
        toast.error("Failed to process the image. Please try again.");
      }
    }
  };


// Helper function to set a cookie using pure JavaScript
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));  // Set expiration date
      expires = "; expires=" + date.toUTCString();
    }
    
    // Modify the cookie with SameSite and path attributes to make it visible
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }
  

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const data = formType === 'signup' ? signupData : signinData;
    const endpoint = formType === 'signup' ? 'signup' : 'signin';

    try {
      const response = await axios.post(`${BaseUrl}/user/${endpoint}`, data);
      toast.success(response.data.message);
    if(response.status===200){
        if (formType === 'signin') {
            setUser(response.user)
            console.log(response.data.user);
            
            setCookie('userId', response.data.user._id, 7);
            router.push(`/${accountType}`);
          } else {
            setFormSwitch(false); // Switch to sign in form after successful signup
          }
    }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const convertImageToBase64URL = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(imageFile);
    });
  };

  return (
    <div className="p-4 d-flex align-items-center justify-content-center">
      <div className="my-4">
        <h3 className="text-center my-4">
          Patient {formSwitch ? "Sign Up" : "Sign In"}
        </h3>

        <Form className="border p-4 rounded" onSubmit={(e) => handleSubmit(e, formSwitch ? 'signup' : 'signin')}>
          {formSwitch ? (
            <>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    value={signupData.name}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={signupData.email}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="number">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    name="number"
                    type="tel"
                    placeholder="Enter Number"
                    value={signupData.number}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="age">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    placeholder="Enter Age"
                    value={signupData.age}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="surgeryHistory" className="mb-3">
                <Form.Label>Surgery History</Form.Label>
                <Form.Control
                  name="surgeryHistory"
                  as="textarea"
                  rows={3}
                  placeholder="Enter Surgery History"
                  value={signupData.surgeryHistory}
                  onChange={(e) => handleInputChange(e, 'signup')}
                />
              </Form.Group>
              <Form.Group controlId="illnessHistory" className="mb-3">
                <Form.Label>Illness History</Form.Label>
                <Form.Control
                  name="illnessHistory"
                  as="textarea"
                  rows={3}
                  placeholder="Enter Illness History"
                  value={signupData.illnessHistory}
                  onChange={(e) => handleInputChange(e, 'signup')}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={signupData.password}
                  onChange={(e) => handleInputChange(e, 'signup')}
                  required
                />
              </Form.Group>
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Upload Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group controlId="signinEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={signinData.email}
                  onChange={(e) => handleInputChange(e, 'signin')}
                  required
                />
              </Form.Group>
              <Form.Group controlId="signinPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={signinData.password}
                  onChange={(e) => handleInputChange(e, 'signin')}
                  required
                />
              </Form.Group>
            </>
          )}

          <Row className="d-flex align-items-center justify-content-center">
            <Button variant="primary" type="submit" className="my-3">
              {formSwitch ? "Sign Up" : "Sign In"}
            </Button>
            <div>
              <span>
                {formSwitch
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Button
                  onClick={() => setFormSwitch((prev) => !prev)}
                  variant="link"
                  type="button"
                >
                  {formSwitch ? "Sign In" : "Sign Up"}
                </Button>
              </span>
            </div>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default SignupSignin;