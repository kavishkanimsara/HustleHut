import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <section className="flex h-full min-h-screen flex-col">
      {/* navbar */}
      <Navbar />
      {/* flex grow */}
      <div className="flex flex-grow flex-col mt-24" />

      <div className="flex min-h-96 flex-col items-center justify-center">
        <h1 className="">You are not authorized to access this page.</h1>
        <Link
          to="/"
          className="mt-4 rounded-md bg-purple-600 px-3 py-2 text-purple-100 hover:bg-purple-700"
        >
          Go back to home
        </Link>
      </div>
      {/* flex grow */}
      <div className="flex flex-grow flex-col" />
      {/* footer */}
      <Footer />
    </section>
  );
};

export default Unauthorized;
