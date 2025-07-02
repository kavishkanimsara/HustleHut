import axios from "axios";
import { useState } from "react";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";

const measurements = [
  "biceps",
  "calf",
  "chest",
  "forearm",
  "height",
  "hip",
  "neck",
  "shoulders",
  "weight",
  "waist",
  "thigh",
];

const ClientMeasurements = () => {
  const [userData, setUserData] = useState({
    biceps: "",
    calf: "",
    chest: "",
    forearm: "",
    height: "",
    hip: "",
    neck: "",
    shoulders: "",
    weight: "",
    waist: "",
    thigh: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addFigureData = async () => {
    setValidationErrors({});
    setLoading(true);

    await axios
      .post("/client/figure", userData)
      .then(() => {
        successToast("Figure data added successfully");
        setUserData({
          biceps: "",
          calf: "",
          chest: "",
          forearm: "",
          height: "",
          hip: "",
          neck: "",
          shoulders: "",
          weight: "",
          waist: "",
          thigh: "",
        });
      })
      .catch((err) => {
        if (err.response?.data?.error) errorToast(err.response.data.error);
        else if (err.response?.data?.errors)
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
    <div className="w-full px-4 py-6 xl:container">
      <h1 className="pb-5 text-center text-base font-semibold text-purple-100 sm:text-xl lg:text-2xl xl:pb-8">
        Add Your Measurements - centimeters(cm)
      </h1>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {measurements.map((measurement, index) => (
          <div
            key={index}
            className="rounded-md border border-slate-700 bg-slate-900 p-4 shadow-xl shadow-slate-700/10 drop-shadow-xl"
          >
            <label
              htmlFor={measurement}
              className="block text-base font-medium capitalize leading-6 text-purple-400 md:text-lg"
            >
              {measurement}
            </label>
            <input
              type="number"
              name={measurement}
              id={measurement}
              className="mt-2 w-full appearance-none border-0 border-b border-purple-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-purple-600 focus:outline-none focus:ring-0"
              placeholder="Enter values"
              value={userData[measurement]}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  [measurement]: e.target.value,
                })
              }
            />
            {validationErrors[measurement] && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {validationErrors[measurement]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center justify-center">
        <button
          onClick={addFigureData}
          className="inline-flex w-60 items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {loading && (
            <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
          )}
          Save
        </button>
      </div>
    </div>
  );
};

export default ClientMeasurements;
