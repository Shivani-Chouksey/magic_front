import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BaseUrl } from "../_app";

function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { user, loginStatus } = useSelector((state) => state.profile);

  // Function to get the value of a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const fetchUser = async () => {
    try {
      const response = await fetch(`${BaseUrl}/user/profile/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 600 }, // Revalidate every hour (10 min)
      });
      console.log("response", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("api data", data.user);
      setProfileData(data.user);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    // Retrieve token from cookie and update state
    const fetchedToken = getCookie("token");
    setToken(fetchedToken);

    // Redirect to login if no token is found
    if (!fetchedToken || !loginStatus) {
      router.push("/"); // Redirect to home (or login) page
      toast.error("Please Login First");
    } else {
      if(id){
        fetchUser();

      }
    }
  }, [router, id, loginStatus]);

  if (!token || !loginStatus) {
    return <p>Please login First. Redirecting to login...</p>;
  }

  return (
    <div>
      <Card className="m-4" style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title>Profile Detail</Card.Title>
          <p className="fw-bold p-0 m-0">
            Name:{" "}
            <span className="fw-normal">{profileData?.name || user?.name}</span>
          </p>
          <p className="fw-bold p-0 m-0">
            Email:{" "}
            <span className="fw-normal">
              {profileData?.email || user?.email}
            </span>
          </p>
          <p className="fw-bold p-0 m-0">
            Contact Number:{" "}
            <span className="fw-normal">
              {profileData?.number || user?.number}
            </span>
          </p>
          <p className="fw-bold p-0 m-0">
            Address:{" "}
            <span className="fw-normal">
              {profileData?.address || user?.address}
            </span>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserProfile;
