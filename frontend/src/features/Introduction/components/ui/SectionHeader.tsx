interface SectionHeaderProps {
  number: string;
  subtitle: string;
  title: string;
}

const SectionHeader = ({ number, subtitle, title }: SectionHeaderProps) => {
  return (
    <div className="relative mb-10 text-center">
      <h2 className="text-8xl md:text-9xl font-extrabold text-blue-500/30 leading-none">
        {number}
      </h2>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <p className="inline-block text-blue-400 uppercase text-sm font-medium tracking-wider mb-2">
          {subtitle}
        </p>
        <h3 className="text-xl md:text-3xl text-gray-800 font-bold drop-shadow-lg">{title}</h3>
      </div>
    </div>
  );
};
export default SectionHeader;
