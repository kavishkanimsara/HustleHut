import { useState } from "react";
import axios from "axios";
import { errorToast, successToast } from "../utils/toastify";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import { PiSpinnerBold } from "react-icons/pi";

const ContactInformation = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // clear errors
    setErrorMessage("");
    setValidationErrors({});

    // set loading to true
    setLoading(true);

    axios
      .post("/public/contact-us", formData)
      .then(() => {
        successToast("Message sent successfully");
        // clear form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch((err) => {
        if (err.response.data.error) setErrorMessage(err.response.data.error);
        else if (err.response.data.errors)
          setValidationErrors(
            transferZodErrors(err.response.data.errors).error,
          );
        else errorToast("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      <div className="mx-auto flex w-[98%] max-w-4xl flex-col py-20 md:flex-row">
        <div
          className="col-span-2 relative rounded-t-xl p-10 md:rounded-l-xl md:rounded-tr-none overflow-hidden"
        >
          <img
            src="/images/bg/bg.jpg" // ← Change this to your desired image path
            alt="Contact Background"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-purple-900/10"></div>
          <div className="relative z-10">
            <h2 className="relative mb-10 text-2xl font-bold text-purple-100">
              Contact Info
            </h2>
            <p className="border-b border-purple-700 py-8 font-bold text-purple-100">
              Phone Number
              <span className="block text-xs font-normal text-purple-300">
                0717251669
              </span>
            </p>
            <p className="border-b border-purple-700 py-8 font-bold text-purple-100">
              Email Address
              <span className="block text-xs font-normal text-purple-300">
                contact@HustleHut.com
              </span>
            </p>
            <p className="border-b border-purple-700 py-8 font-bold text-purple-100">
              Web Address
              <span className="block text-xs font-normal text-purple-300">
                https://HustleHut.com
              </span>
            </p>
          </div>
        </div>

        <div className="col-span-4 rounded-b-xl bg-slate-900 p-14 md:rounded-r-xl md:rounded-bl-none">
          <h2 className="mb-14 text-4xl font-bold text-purple-700">
            Getting Touch With Us
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <input
                  className={`peer block w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-0 ${validationErrors.firstName ? "border-red-500" : ""
                    }`}
                  aria-placeholder="First Name"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {validationErrors.firstName && (
                  <span className="text-xs text-red-500">
                    {validationErrors.firstName}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`peer block w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-0 ${validationErrors.lastName ? "border-red-500" : ""
                    }`}
                  aria-placeholder="Last Name"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {validationErrors.lastName && (
                  <span className="text-xs text-red-500">
                    {validationErrors.lastName}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <input
                  className={`peer block w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-0 ${validationErrors.email ? "border-red-500" : ""
                    }`}
                  aria-placeholder="Email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {validationErrors.email && (
                  <span className="text-xs text-red-500">
                    {validationErrors.email}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  className={`peer block w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-0 ${validationErrors.subject ? "border-red-500" : ""
                    }`}
                  aria-placeholder="Subject"
                  placeholder="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {validationErrors.subject && (
                  <span className="text-xs text-red-500">
                    {validationErrors.subject}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-6">
              <textarea
                className={`peer block w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-0 ${validationErrors.message ? "border-red-500" : ""
                  }`}
                placeholder="Write Your Message"
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {validationErrors.message && (
                <span className="text-xs text-red-500">
                  {validationErrors.message}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-col items-center justify-center">
              <button
                type="submit"
                className="flex w-full min-w-40 items-center justify-center gap-x-1 rounded-lg bg-purple-600 px-6 py-2 font-bold text-white transition-all hover:bg-purple-800"
              >
                {loading && (
                  <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                )}
                {loading ? "Sending..." : "Send Message"}
              </button>
              {/* error message */}
              {errorMessage && (
                <p className="mt-3 text-center text-sm font-medium text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;