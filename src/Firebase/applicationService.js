import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  orderBy,
  getDoc 
} from "firebase/firestore";
import { db } from "./db";
import { auth } from "./db";


export const getStudentProfile = async (userId) => {
  try {
    const studentDoc = await getDoc(doc(db, "studentProfiles", userId));
    if (studentDoc.exists()) {
      const studentData = studentDoc.data();

      const { profilePicture, ...profileWithoutPic } = studentData;
      return profileWithoutPic;
    }
    return null;
  } catch (error) {

    throw error;
  }
};

export const submitJobApplication = async (jobId) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const userEmail = auth.currentUser?.email;

    const studentProfile = await getStudentProfile(userId);
    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    const jobDoc = await getDoc(doc(db, "jobOpenings", jobId));
    if (!jobDoc.exists()) {
      throw new Error("Job not found");
    }
    const jobData = jobDoc.data();
    const jobTitle = jobData.jobTitle;
    const postedBy = jobData.postedBy; 
 
    const hrDoc = await getDoc(doc(db, "hr_users", postedBy));
    let companyName = "Unknown Company";
    if (hrDoc.exists()) {
      const hrData = hrDoc.data();
      companyName = hrData.companyName || "Unknown Company";
    }

    const application = {
      jobId,
      studentId: userId,
      studentEmail: userEmail,
      jobTitle: jobTitle,
      companyName: companyName,
      postedBy: postedBy, 

      ...studentProfile,
      status: "pending",
      appliedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "applications"), application);
    return { success: true, applicationId: docRef.id };
  } catch (error) {

    throw error;
  }
};

export const getStudentApplications = async (studentId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("studentId", "==", studentId),
      orderBy("appliedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    const applications = [];
    
    for (const doc of snapshot.docs) {
      const appData = doc.data();
      

      const jobDoc = await getDoc(doc(db, "jobOpenings", appData.jobId));
      const jobData = jobDoc.exists() ? jobDoc.data() : null;
      
      applications.push({
        id: doc.id,
        ...appData,
        jobDetails: jobData
      });
    }
    
    return applications;
  } catch (error) {

    throw error;
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId),
      orderBy("appliedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {

    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status,) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    await updateDoc(applicationRef, {
      status,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {

    throw error;
  }
};


export const checkExistingApplication = async (jobId, studentId) => {
  try {
    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId),
      where("studentId", "==", studentId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {

    return false;
  }
};