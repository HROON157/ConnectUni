import { useState, useEffect } from 'react';
import { getDashboardData } from '../Charts/ChartData';
import { PieChartCard, BarChartCard, LineChartCard } from '../Charts/PieChartCard';
import { Link } from 'react-router-dom';
const HR_Home = () => {
  const userName = localStorage.getItem('userName');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="ml-2 sm:ml-4 md:ml-6 lg:ml-8 p-4">
      <p className="text-[#0D141C] text-xl sm:text-base md:text-lg lg:text-xl text-center font-semibold mt-2 " 
         style={{fontFamily:'Public Sans'}}>
        Welcome to the HR Dashboard
      </p>
      <p className="text-[#0D141C] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mt-2" 
         style={{fontFamily:'Public Sans'}}>
        Hello, {userName}
      </p>

      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PieChartCard 
            title="Total Jobs"
            count={dashboardData?.totalJobs.count}
            data={dashboardData?.totalJobs.breakdown}
          />
          <BarChartCard 
            title="Universities"
            count={dashboardData?.universities.count}
            data={dashboardData?.universities.breakdown}
          />
          <LineChartCard 
            title="Total Hirings"
            count={dashboardData?.totalHirings.count}
            percentage={dashboardData?.totalHirings.percentage}
            trend={dashboardData?.totalHirings.trend}
          />
        </div>
      </div>
      <div className="mt-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

    <button className="group bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-blue-300 hover:shadow-xl">
      <Link to="/past-openings"><h3 className="text-lg font-semibold text-center text-blue-800 group-hover:text-blue-900 transition">📂 Past Openings</h3></Link>
    </button>

    <button className="group bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-green-300 hover:shadow-xl">
      <Link to="/add-new-opening"><h3 className="text-lg font-semibold text-center text-green-800 group-hover:text-green-900 transition">➕ Add New</h3></Link>
    </button>

    <button className="group bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-purple-300 hover:shadow-xl">
      <Link to="/browse-universities"><h3 className="text-lg font-semibold text-center text-purple-800 group-hover:text-purple-900 transition">🎓 Browse Universities</h3></Link>
    </button>

  </div>
</div>

      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-center">Current openings will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default HR_Home;