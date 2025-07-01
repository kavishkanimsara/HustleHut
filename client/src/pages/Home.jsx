import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import FAQ from "../components/FAQ";
import Title from "../components/Title";
import Footer from "../components/Footer";
import HeaderCard from "../components/cards/HeaderCard";
import ContactInformation from "../components/ContactInformation";

const Home = () => {
  return (
    <div>
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Header Card */}
      <HeaderCard
        title={
          "To revolutionize the fitness industry and empower individuals worldwide to prioritize their health and well-being."
        }
        text={""}
      />

      {/* About Section with Background Image and Dark Overlay */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-20"
        style={{ backgroundImage: "url('/images/bg/h2.jpg')" }} // <- Change path if needed
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Content over image */}
        <div className="relative z-10 px-4">
          {/* Title */}
          <Title title="Who We Are?" />

          {/* About Content */}
          <div className="flex justify-center p-8 text-justify">
            <p className="hover:scale-103 max-w-6xl transform rounded-xl border border-purple-200/30 bg-white/5 p-16 text-purple-200 shadow-xl shadow-purple-500/30 drop-shadow-2xl duration-300 hover:shadow-violet-500/30">
              At HustleHut, we recognize the growing complexities gym centers face in managing their operations and delivering high-quality fitness experiences. From manual tracking of member progress to fragmented scheduling systems and inefficient communication, the lack of a centralized platform often leads to frustration for members, trainers, and administrators alike. Members struggle to monitor their fitness journeys and access personalized training, while trainers lack the tools to effectively support and guide their clients. Meanwhile, gym administrators are overwhelmed with manual data handling, delayed feedback loops, and scheduling issues that reduce operational efficiency.

              Driven by these challenges, we set out to create a comprehensive web-based gym management system designed to bring clarity, structure, and empowerment to every role within the fitness ecosystem. Our platform provides tailored features for each user: members can track BMI, weight, and progress with ease, book training sessions, manage their subscriptions, and receive customized fitness plans. Trainers can view assigned member profiles, deliver timely, data-driven feedback, and manage class schedules seamlessly. Administrators gain full oversight of the system — including real-time updates on payments, staff schedules, and user management — all from a single dashboard.

              With integrated communication tools, injury tracking, and secure data backups, this digital platform creates a connected and efficient environment where gyms thrive and clients feel supported every step of the way. At HustleHut, we re not just solving problems — we re revolutionizing the way fitness centers operate, making health and wellness more accessible, efficient, and personalized for everyone involved.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ - Title */}
      <Title title="Frequently Asked Questions" />

      {/* FAQ - Content */}
      <div className="flex justify-center py-8">
        <FAQ />
      </div>

      {/* Contact Info */}
      <ContactInformation />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
