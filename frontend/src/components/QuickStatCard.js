import { Link } from "react-router-dom";

const QuickStatCard = ({ icon: Icon, iconColor,title, url, value, valueColor, change, positive }) => {

  return (
    <div className="bg-white shadow-md rounded-lg p-5 transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className={`${iconColor}`} size={24} />
        </div>
        {change != null && (
          <span
            className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-600"
              }`}
          >
            {change}%
          </span>
        )}
      </div>
      <h3 className={`text-xl font-bold ${valueColor}`}>{value}</h3>
      <Link to={url} className="text-md text-gray-500 hover:underline hover:text-blue-600">
        {title}
      </Link>
    </div>
  );
}

export default QuickStatCard;
