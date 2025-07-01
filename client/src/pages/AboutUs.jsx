import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeaderCard from "../components/cards/HeaderCard";
import Title from "../components/Title";
import Feature from "../components/Features";
import FAQ from "../components/FAQ";
import { features } from "../data/features.json";

const AboutUS = () => {
  return (
    <section>
      {/* navigation */}
      <Navbar />
      {/* main title  */}
      <HeaderCard title="About Us" />

      {/* about title */}
      <Title title="Who We Are?" />
      {/* about content */}
      <div className="flex justify-center p-8 pt-0 text-justify">
        <p className="max-w-6xl text-purple-200 bg-white/5 rounded-xl transform hover:scale-103 duration-300 border border-purple-200/30 shadow-xl drop-shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/30 p-16">
          At HustleHut, we believe that everyone deserves access to personalized fitness training and consistent workout routines, regardless of their geographical location. Motivated by the challenges individuals face in prioritizing their health and fitness amidst busy schedules and accessibility barriers, we set out to create a solution that bridges the gap between convenience and personalized training.

          Our team of dedicated professionals — including certified personal trainers and skilled software developers — has worked tirelessly to build a user-friendly platform that empowers individuals to take control of their fitness journey. By leveraging web-based technology, we aim to provide a convenient and accessible solution for people living in rural or remote areas to engage in remote bodybuilding and personal workout training.

          HustleHut represents a paradigm shift in the fitness industry, offering a unique blend of personalized coaching, progress tracking, and community engagement. Innovative features such as the ability to select a coach based on your preferences and expertise, along with seamless remote consultation sessions, ensure continuous support and motivation.

          Join us in our mission to revolutionize the fitness experience and empower individuals across the globe to prioritize their health and well-being. Together, lets build a healthier, stronger, and more connected world.
        </p>
      </div>

      {/* features title */}
      <Title title="Our Features" />
      {/* Features content*/}
      <div className="flex justify-center w-full items-center gap-8 py-10 flex-wrap">
        {features.map((feature, index) => (
          <Feature
            className={
              "w-full h-full max-w-sm p-4 border border-purple-300 shadow-xl drop-shadow-2xl shadow-purple-500/30 rounded-lg"
            }

            key={index}
            title={feature.title}
            text={feature.content}
          />
        ))}
      </div>

      {/* FAQ title */}
      <Title title="Frequently Asked Questions" />
      {/* FAQ content */}
      <div className="py-8 flex justify-center">
        <FAQ />
      </div>

      {/* footer */}
      <Footer />
    </section>
  );
};

export default AboutUS;
