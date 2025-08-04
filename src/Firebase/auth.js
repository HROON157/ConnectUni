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
  query, 
  where, 
  serverTimestamp,
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

// Sign in user
export const signIn = async (email, password) => {
  try {
    console.log("Attempting to sign in user...");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in successfully:", user);
    console.log("User signed in successfully:", user.uid);
    
    // Get user data with role
    console.log("Fetching user data...");
    const userData = await getUserData(user.uid);
    console.log("User data retrieved:", userData);
    
    return { user, userData };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get user data by ID
export const getUserData = async (userId) => {
  try {
    console.log("Looking for user data for:", userId);
    
    // First try the students collection
    console.log("Checking students collection...");
    let userDoc = await getDoc(doc(db, 'students', userId));
    if (userDoc.exists()) {
      console.log("Found user in students collection");
      return userDoc.data();
    }
    
    // If not found in students, try hr_users collection
    console.log("User not found in students collection, checking hr_users...");
    userDoc = await getDoc(doc(db, 'hr_users', userId));
    if (userDoc.exists()) {
      console.log("Found user in hr_users collection");
      return userDoc.data();
    }
    
    // If not found in any collection
    console.log("User not found in any collection");
    throw new Error('User data not found');
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};


// Get user role
export const getUserRole = async (userId) => {
  try {
    const userData = await getUserData(userId);
    return userData.role;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = async (userId, requiredRole) => {
  try {
    const userRole = await getUserRole(userId);
    return userRole === requiredRole;
  } catch (error) {
    console.error('Role check error:', error);
    return false;
  }
};

// Get users by role
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

// In your auth.js file
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
