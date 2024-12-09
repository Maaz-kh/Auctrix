
const QuickStatCard = ({ icon: Icon, title, value, change, positive }) => (
  <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="text-blue-600" size={24} />
      </div>
      <span
        className={`text-sm font-medium ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}%
      </span>
    </div>
    <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

export default QuickStatCard;
