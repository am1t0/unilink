import React, { useState } from "react";
import RegisterPage1 from "./RegisterPage1";
import RegisterPage2 from "./RegisterPage2";
import "../../../style/common/mode.css";

const HandlePages = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (data) => {
    const completeData = { ...formData, ...data };
    console.log("Complete Registration Data:", completeData);

    try {
      const response = await fetch("http://localhost:4000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("User registered successfully:", result);
      } else {
        console.error("Error registering user:", result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      {step === 1 ? (
        <RegisterPage1 handleNext={handleNext} />
      ) : (
        <RegisterPage2
          formData={formData}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default HandlePages;
