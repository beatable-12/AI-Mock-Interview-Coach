import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Save an interview result to Firestore
 */
export async function saveInterview(userId, interviewData) {
  try {
    const docRef = await addDoc(collection(db, "interviews"), {
      userId,
      ...interviewData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error saving interview: ", error);
    return { id: null, error: error.message };
  }
}

/**
 * Get all past interviews for a specific user
 */
export async function getUserInterviews(userId) {
  try {
    const interviewsRef = collection(db, "interviews");
    const q = query(
      interviewsRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const interviews = [];
    
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });
    
    return { interviews, error: null };
  } catch (error) {
    console.error("Error fetching interviews: ", error);
    // Fallback if index isn't created yet for ordering
    if (error.message.includes('index')) {
       try {
         const qFallback = query(collection(db, "interviews"), where("userId", "==", userId));
         const snapshot = await getDocs(qFallback);
         const interviews = [];
         snapshot.forEach((doc) => {
            interviews.push({ id: doc.id, ...doc.data() });
         });
         // Sort manually
         interviews.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
         return { interviews, error: null };
       } catch(fallbackErr) {
         return { interviews: [], error: fallbackErr.message };
       }
    }
    return { interviews: [], error: error.message };
  }
}
