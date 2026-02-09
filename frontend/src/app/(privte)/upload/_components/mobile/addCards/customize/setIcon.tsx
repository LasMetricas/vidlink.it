import * as LucideIcons from "lucide-react";

interface Type {
  matchingIcons: string[];
  setIcon(value: string): void;
  setIconSearch(value: string): void;
}
const SetIcon: React.FC<Type> = ({ matchingIcons, setIcon, setIconSearch }) => {
  const handleIcon = (item: string) => {
    setIcon(item);
    setIconSearch("");
  };

  return (
    <>
      <div className="absolute top-[57px] mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow z-20">
        {matchingIcons.length > 0 ? (
          matchingIcons.map((item) => {
            // Make sure TypeScript knows this is a valid component
            const IconComponent = LucideIcons[
              item as keyof typeof LucideIcons
            ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
            return IconComponent ? (
              <button
                onClick={() => handleIcon(item)}
                key={item}
                className="flex items-center p-2 text-black hover:bg-gray-300 w-full text-left"
              >
                {/* Render icon dynamically */}
                <IconComponent className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <span key={item}></span>
            );
          })
        ) : (
          <p className="p-2 text-gray-700 text-[14px]">No icons found</p>
        )}
      </div>
    </>
  );
};
export default SetIcon;
