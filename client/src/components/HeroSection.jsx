import Button from "./button/Button";

const HeroSection = () => {
  return (
    <div className="">
      <div className="h-[100vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/bg/bg.jpg"
          alt="webEase-hero-image"
          className="absolute inset-0 w-full h-full object-cover"
        />




        <div className="h-full pt-16 flex flex-col-reverse xl:flex-row items-center justify-center xl:max-w-[1140px] z-10">
          <div className="w-3/4 md:w-1/2 flex flex-col items-start">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-white bg-clip-text text-transparent to-purple-600 font-medium pb-4 2xl:pb-8">
              Ignite Your Power, Transform Your Fitness Path{" "}
              <span className="font-bold text-purple-500">HustleHut</span>
            </h1>



            <h1 className="md:text-lg 2xl:text-xl text-purple-400 font-base pb-8 pr-8 2xl:pb-8">
              Uncover artisan-crafted pieces designed to inspire and elevate
              your everyday moments.
            </h1>
            <Button
              btnText="Apply Coach"
              border="2px solid"
              borderColor="rgb(251, 60, 238)"
              backgroundColor="transparent"
              fontColor="rgb(251, 60, 238)"
              link="/feed"
            />
          </div>
          <div className="w-full md:w-1/2 flex overflow-hidden"></div>
        </div>








      </div>
    </div>
  );
};

export default HeroSection;