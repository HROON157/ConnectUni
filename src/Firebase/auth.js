import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import { 
  doc, 
  setDoc, 
  addDoc,
  getDoc, 
  collection, 
  updateDoc,
  query, 
  where, 
  serverTimestamp,
  orderBy,
  getDocs 
} from 'firebase/firestore';
import { auth, db } from './db';
export const signUpWithRole = async (userData) => {
  try {
    console.log("Creating user account...");
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    const user = userCredential.user;
    console.log("User account created:", user.uid);
    const userDoc = {
      uid: user.uid,
      email: userData.email,
      profileName: userData.profileName,
      role: userData.role,
      gender: userData.gender || null,
      shareData: userData.shareData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (userData.role === 'student') {
      userDoc.university = userData.university;
      userDoc.degreeProgram = userData.degreeProgram;
      userDoc.hodReferralCode = userData.hodReferralCode;
    } else if (userData.role === 'hr') {
      userDoc.companyName = userData.companyName;
    }

    console.log("Saving user document to Firestore...");
    console.log("Document data:", userDoc);
  
    const roleCollection = userData.role === 'student' ? 'students' : 'hr_users';
    await setDoc(doc(db, roleCollection, user.uid), {
      ...userDoc,
      userId: user.uid
    });

    console.log(`User also saved to ${roleCollection} collection`);
    console.log("User document saved successfully!");
    return { user, userData: userDoc };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    console.log("Attempting to sign in user...");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in successfully:", user);
    console.log("User signed in successfully:", user.uid);
    console.log("Fetching user data...");
    const userData = await getUserData(user.uid);
    console.log("User data retrieved:", userData);
    
    return { user, userData };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    console.log("Looking for user data for:", userId);

    console.log("Checking students collection...");
    let userDoc = await getDoc(doc(db, 'students', userId));
    if (userDoc.exists()) {
      console.log("Found user in students collection");
      return userDoc.data();
    }

    console.log("User not found in students collection, checking hr_users...");
    userDoc = await getDoc(doc(db, 'hr_users', userId));
    if (userDoc.exists()) {
      console.log("Found user in hr_users collection");
      return userDoc.data();
    }

    console.log("User not found in any collection");
    throw new Error('User data not found');
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};


export const getUserRole = async (userId) => {
  try {
    const userData = await getUserData(userId);
    return userData.role;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
};

export const hasRole = async (userId, requiredRole) => {
  try {
    const userRole = await getUserRole(userId);
    return userRole === requiredRole;
  } catch (error) {
    console.error('Role check error:', error);
    return false;
  }
};

export const getUsersByRole = async (role) => {
  try {
    let collectionName;
    
    if (role === 'student') {
      collectionName = 'students';
    } else if (role === 'hr') {
      collectionName = 'hr_users';
    } else {
      throw new Error(`Unknown role: ${role}`);
    }
    
    console.log(`Fetching users from ${collectionName} collection`);
    const q = query(collection(db, collectionName), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${users.length} users with role ${role}`);
    return users;
  } catch (error) {
    console.error('Get users by role error:', error);
    throw error;
  }
};


export const addJobOpening = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, "jobOpenings"), {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};


export const createJobOpening = async (jobData) => {
  try {
    const jobsCollection = collection(db, "jobOpenings");
    
    const jobDoc = {
      ...jobData,
      isActive: true,      
      status: "active",   
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(jobsCollection, jobDoc);
    console.log("Job opening created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating job opening:", error);
    throw error;
  }
};
export const getJobOpenings = async () => {
  try {
    console.log("Fetching job openings from Firebase...");
    const jobsCollection = collection(db, "jobOpenings");
    const querySnapshot = await getDocs(jobsCollection);
    console.log("Total documents in collection:", querySnapshot.size);
    
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Document data:", doc.id, data);
      const isJobActive = 
        data.isActive === true || 
        (data.isActive === undefined && data.status === 'active') ||
        (data.isActive === undefined && data.status !== 'closed');
      
      console.log("Job", doc.id, "- isActive:", data.isActive, "status:", data.status, "considered active:", isJobActive);
      
      if (isJobActive) {
        jobs.push({
          id: doc.id,
          ...data
        });
      }
    });
    

    jobs.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    
    console.log("Final active jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error fetching job openings:", error);
    throw error;
  }
};



export const closeJobOpening = async (jobId) => {
  try {
    const jobRef = doc(db, "jobOpenings", jobId);
    await updateDoc(jobRef, {
      status: "closed",
      closedAt: serverTimestamp(),
      isActive: false
    });
    
    console.log("Job opening closed successfully");
    return true;
  } catch (error) {
    console.error("Error closing job opening:", error);
    throw error;
  }
};


export const getPastJobOpenings = async () => {
  try {
    console.log("Fetching past job openings from Firebase...");
    const jobsCollection = collection(db, "jobOpenings");
    

    const q = query(
      jobsCollection, 
      where("status", "==", "closed"),
      orderBy("closedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Fetched past jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error fetching past job openings:", error);
  
    try {
      const allJobsSnapshot = await getDocs(jobsCollection);
      const jobs = [];
      
      allJobsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "closed") {
          jobs.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      jobs.sort((a, b) => {
        if (a.closedAt && b.closedAt) {
          return b.closedAt.seconds - a.closedAt.seconds;
        }
        return 0;
      });
      
      return jobs;
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      throw fallbackError;
    }
  }
};


