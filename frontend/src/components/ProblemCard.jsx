import { Link } from "react-router-dom";

const ProblemCard = ({ _id, title, rating, imageUrl }) => {
  return (
    <div className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h2 className="text-lg font-bold text-black dark:text-white">
        <Link to={`/problem/${_id}`}>{title}</Link>
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Rating: {rating}
      </p>
    </div>
  );
};

export default ProblemCard;
