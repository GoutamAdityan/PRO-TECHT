interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const FeatureCard = ({ title, description, imageUrl }: FeatureCardProps) => {
  return (
    <div className="group relative h-80 overflow-hidden rounded-lg bg-gray-800" tabIndex={0}>
      <img 
        src={imageUrl} 
        alt={title} 
        className="h-full w-full object-cover transition-opacity duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:opacity-20 group-focus-visible:opacity-20" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
        <div className="will-change-transform transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] transform group-hover:-translate-y-24 group-focus-visible:-translate-y-24">
            <h3 className="text-lg font-bold text-white">
                {title}
            </h3>
            <div className="max-h-0 group-hover:max-h-48 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]">
                <p className="text-sm text-gray-300 pt-2">
                    {description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;