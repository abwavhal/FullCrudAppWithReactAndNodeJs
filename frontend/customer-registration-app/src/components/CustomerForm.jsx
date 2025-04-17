import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const SUPPORTED_FORMATS = ["application/pdf", "application/msword"];

const schema = yup.object().shape({
  customerName: yup.string().required("Customer name is required"),
  aadhaar: yup
    .string()
    .matches(/^\d{12}$/, "Aadhaar must be a 12-digit number")
    .required(),
  email: yup.string().email("Invalid email").required(),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be a 10-digit number")
    .required(),
  address1: yup.string().required("Address Line 1 is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  gender: yup.string().required("Gender is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/\d/, "Must contain a number")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required(),
  document: yup
    .mixed()
    .required("A file is required")
    .test("fileSize", "File too large", (value) => {
      return value && value[0]?.size <= 2 * 1024 * 1024; // 2MB
    })
    .test(
      "fileType",
      "Unsupported File Format",
      (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)
    ),
});

export default function CustomerForm() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);

  const countryStateMap = {
    India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"],
    USA: ["California", "Texas", "New York", "Florida"],
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setStates(countryStateMap[country] || []);
    setValue("country", country); // Update the country value in the form
    setValue("state", ""); // Reset the state when country changes
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "document") {
        formData.append("document", data.document[0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate('/customers'); // 👈 go to table page
      }

      const result = await response.json();
      if (response.ok) {
        navigate('/customers'); // 👈 go to table page
      }

      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Customer Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input {...register("customerName")} className="form-control" />
          <div className="text-danger">{errors.customerName?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Aadhaar Number</label>
          <input {...register("aadhaar")} className="form-control" />
          <div className="text-danger">{errors.aadhaar?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" {...register("email")} className="form-control" />
          <div className="text-danger">{errors.email?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input {...register("phone")} className="form-control" />
          <div className="text-danger">{errors.phone?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 1</label>
          <input {...register("address1")} className="form-control" />
          <div className="text-danger">{errors.address1?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2</label>
          <input {...register("address2")} className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <select
            {...register("country")}
            className="form-select"
            onChange={handleCountryChange}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
          <div className="text-danger">{errors.country?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <select {...register("state")} className="form-select">
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <div className="text-danger">{errors.state?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select {...register("gender")} className="form-select">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div className="text-danger">{errors.gender?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            {...register("password")}
            className="form-control"
          />
          <div className="text-danger">{errors.password?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="form-control"
          />
          <div className="text-danger">{errors.confirmPassword?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Upload Document (PDF/DOC only, max 2MB)
          </label>
          <input
            type="file"
            {...register("document")}
            className="form-control"
          />
          <div className="text-danger">{errors.document?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
