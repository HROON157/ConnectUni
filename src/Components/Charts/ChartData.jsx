import { query, collection, onSnapshot, where } from "firebase/firestore";
import { db } from "../../Firebase/db";

let jobsList = [];
let unsubscribe = null;


const setupJobsListener = (currentUid, callback) => {
  if (unsubscribe) {
    unsubscribe(); 
  }

  const JobQuery = query(
    collection(db, "jobOpenings"), 
    where("status", "==", "active"), 
    where("postedBy", "==", currentUid) 
  );

  unsubscribe = onSnapshot(JobQuery, (snapshot) => {
    jobsList = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    

    

    if (callback) {
      callback(jobsList);
    }
  });

  return unsubscribe;
};

export const getMockData = () => ({
  totalJobs: {
    count: jobsList.length,
    breakdown: jobsList.map((job, index) => ({
      name: job.jobTitle,
      value: 1,
      color: ['#8B5CF6', '#3B82F6', '#F97316', '#10B981'][index % 4]
    }))
  },

  universities: {
    count: 4,
    breakdown: [
      { name: 'NUST', value: 5, color: '#C084FC' },
      { name: 'LUMS', value: 8, color: '#3B82F6' },
      { name: 'GIKI', value: 3, color: '#F97316' },
      { name: 'PUCIT', value: 2, color: '#10B981' },
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

export const getDashboardData = async (onDataUpdate) => {
  try {
    const currentUid = localStorage.getItem("uid");

    setupJobsListener(currentUid, onDataUpdate);

    return getMockData();
  } catch (error) {
    console.error("Error setting up dashboard data:", error);
    return getMockData();
  }
};


export const cleanupJobsListener = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};