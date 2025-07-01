/* eslint-disable react/prop-types */
const HeaderCard = ({ title }) => {
  return (
    <div
      className="h-[60vh] flex justify-center items-center bg-gradient-to-b from-slate-900/50 to-purple-600/60 overflow-hidden"
      style={{
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <h2 className="mb-14 font-semibold max-w-7xl text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-purple-100">
        {title}
      </h2>

    </div>
  );
};

export default HeaderCard;
