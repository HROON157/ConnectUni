export const getDashboardData = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/dashboard-stats');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return mock data as fallback
    return getMockData();
  }
};

const getMockData = () => ({
  totalJobs: {
    count: 10,
    breakdown: [
      { name: 'Front End Intern', value: 3, color: '#8B5CF6' },
      { name: 'Back End Developer', value: 4, color: '#3B82F6' },
      { name: 'UI/UX Designer', value: 2, color: '#F97316' },
      { name: 'Marketing Intern', value: 1, color: '#10B981' }
    ]
  },
  universities: {
    count: 4,
    breakdown: [
      { name: 'NUST', value: 5, color: '#C084FC' },
      { name: 'LUMS', value: 8, color: '#3B82F6' },
      { name: 'GIKI', value: 3, color: '#F97316' },
      { name: 'PUCIT', value: 2, color: '#10B981' }
    ]
  },
  totalHirings: {
    count: 15,
    percentage: 10,
    trend: [
      { month: 'Jan', value: 12 },
      { month: 'Feb', value: 19 },
      { month: 'Mar', value: 15 },
      { month: 'Apr', value: 8 },
      { month: 'May', value: 14 },
      { month: 'Jun', value: 15 }
    ]
  }
});