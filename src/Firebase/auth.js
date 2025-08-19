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
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    const user = userCredential.user;
    
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

   
    const roleCollection = userData.role === 'student' ? 'students' : 'hr_users';
    await setDoc(doc(db, roleCollection, user.uid), {
      ...userDoc,
      userId: user.uid
    });

    return { user, userData: userDoc };
  } catch (error) {
 
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
        
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userData = await getUserData(user.uid);
    
    
    return { user, userData };
  } catch (error) {
       throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
        throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    
    let userDoc = await getDoc(doc(db, 'students', userId));
    if (userDoc.exists()) {
   
      return userDoc.data();
    }

   
    userDoc = await getDoc(doc(db, 'hr_users', userId));
    if (userDoc.exists()) {

      return userDoc.data();
    }

    throw new Error('User data not found');
  } catch (error) {

    throw error;
  }
};


export const getUserRole = async (userId) => {
  try {
    const userData = await getUserData(userId);
    return userData.role;
  } catch (error) {

    return null;
  }
};

export const hasRole = async (userId, requiredRole) => {
  try {
    const userRole = await getUserRole(userId);
    return userRole === requiredRole;
  } catch (error) {
  
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
    

    const q = query(collection(db, collectionName), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    
    return users;
  } catch (error) {
   
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
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};


export const createJobOpening = async (jobData, userId) => {
  try {
    const jobsCollection = collection(db, "jobOpenings");
    
    const jobDoc = {
      ...jobData,
      postedBy: userId, // This will filter jobs by HR user
      postedByEmail: auth.currentUser?.email,
      isActive: true,      
      status: "active",   
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(jobsCollection, jobDoc);
    ;
    return docRef.id;
  } catch (error) {
  }
};

// Update the existing getJobOpenings function
export const getJobOpenings = async (userId = null) => {
  try {
    
    const jobsCollection = collection(db, "jobOpenings");
    
    let q;
    if (userId) {
      // Filter by specific user
      q = query(
        jobsCollection,
        where("postedBy", "==", userId),
        where("status", "==", "active")
      );
    } else {
      // Get all active jobs (for admin/general view)
      q = query(
        jobsCollection,
        where("status", "==", "active")
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      
      jobs.push({
        id: doc.id,
        ...data
      });
    });
    
    // Sort by creation date
    jobs.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    

    return jobs;
  } catch (error) {
 
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
    

    return true;
  } catch (error) {
    
    throw error;
  }
};


// Add this new function for user-specific past job openings

export const getPastJobOpeningsByUser = async (userId) => {
  try {
   
    const jobsCollection = collection(db, "jobOpenings");
    
    // Query for jobs posted by specific user that are closed
    const q = query(
      jobsCollection, 
      where("postedBy", "==", userId),
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
    

  
    return jobs;
  } catch (error) {

    
    // Fallback: get all closed jobs and filter client-side
    try {

      const allPastJobs = await getPastJobOpenings();
      const userJobs = allPastJobs.filter(job => job.postedBy === userId);

      return userJobs;
    } catch (fallbackError) {

      throw fallbackError;
    }
  }
};

// Keep your existing getPastJobOpenings function for compatibility
export const getPastJobOpenings = async () => {
  try {

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
    

    return jobs;
  } catch (error) {

  
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

      throw fallbackError;
    }
  }
};


