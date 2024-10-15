import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Toast } from "react-bootstrap";
import { BaseUrl } from "./_app";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { setLoginStatus, setUser } from "@/redux/slices/profileSlice";
import io from "socket.io-client";

function SignupSignin() {
  const [formSwitch, setFormSwitch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { pathname } = router;

  // State for register and login data
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  // Socket.IO real-time notification for new user registration
  useEffect(() => {
  

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  console.log("showNotification", showNotification);

  // Function to toggle password visibility
  const passwordIconChange = () => setShowPassword(!showPassword);

  // Input handler for login/register
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "signup") {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSigninData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Separate login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BaseUrl}/user/login`, signinData);
      console.log(response);

      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        dispatch(setLoginStatus(response.data.loginStatus));
        toast.success(response.data.message || "Login successful!");
        setCookie("token", response.data.token, 7);
        setSigninData({
          email: "",
          password: "",
        });
        router.push(`/profile/${response.data.user._id}`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      toast.error(errorMessage);
    }
  };

  // Separate register handler
  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/user/register`, signupData);
      if (response.status === 201) {
        const socket = io(BaseUrl);

        socket.on("user_registered", (data) => {
          console.log("data inside socket", data);
    
        // Set the new user data received from the backend
          if (data.user) {
            toast.success(newUser && `${newUser.name} just joined!`);
            setNewUser(data.user);
          }
          // setShowNotification(true); // Show the notification
        });
        // toast.success("Registration successful! Please log in.");
        setFormSwitch(true); // Switch to login form after successful registration
        setSignupData({
          name: "",
          email: "",
          number: "",
          password: "",
          confirmPassword: "",
        });
      }
    }catch (error) {
      const errorMessages =
        error.response?.status === 400
          ? (error.response.data.errors || []).join(", ") || "Validation failed."
          : error.response?.data?.message || "An error occurred during registration.";
      
      toast.error(errorMessages);
    }
  };

  // Helper to set cookies
  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
  };

  return (
    <div className="p-4 d-flex align-items-center justify-content-center">
      <div className="my-2">
      
        <h3 className="text-center">{formSwitch ? "Sign In" : "Sign Up"}</h3>
        
        <Form
          className="border p-4 rounded shadow-lg"
          onSubmit={formSwitch ? handleLogin : handleRegister}
        >
          {formSwitch ? (
            <>
              <Form.Group controlId="signinEmail" className="mb-3 ">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={signinData.email}
                  onChange={(e) => handleInputChange(e, "signin")}
                  required
                />
              </Form.Group>

             <Row>
             <Form.Label>Password</Form.Label>
             <InputGroup className="mb-3">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={signinData.password}
                  onChange={(e) => handleInputChange(e, "signin")}
                  required
                />
                <InputGroup.Text onClick={passwordIconChange}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </InputGroup.Text>
              </InputGroup>
             </Row>
            </>
          ) : (
            <>
              <Row className="mb-2">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    value={signupData.name}
                    onChange={(e) => handleInputChange(e, "signup")}
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
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                </Form.Group>
              </Row>

              <Row  className="mb-2">
                <Form.Group as={Col} controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    type="text"
                    placeholder="Enter Address"
                    value={signupData.address}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                </Form.Group>
              </Row>
              <Row  className="mb-2">
                <Form.Group as={Col} controlId="number">
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    name="number"
                    type="tel"
                    placeholder="Enter Number"
                    value={signupData.number}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                </Form.Group>
              </Row>
            

              <Row>
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={signupData.password}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                  <InputGroup.Text onClick={passwordIconChange}>
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
              </Row>

              <Row>
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                  <InputGroup.Text onClick={passwordIconChange}>
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
              </Row>
            </>
          )}

          <Row className="d-flex align-items-center justify-content-center">
            <Button variant="primary" type="submit" className="my-3">
              {formSwitch ? "Sign In" : "Sign Up"}
            </Button>
            <div>
              <span>
                {formSwitch
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Button
                  onClick={() => setFormSwitch((prev) => !prev)}
                  variant="link"
                  type="button"
                >
                  {formSwitch ? "Sign Up" : "Sign In"}
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
