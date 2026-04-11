import { auth } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';

/**
 * Register a new user
 */
export async function signUp(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add display name to the user profile
    await updateProfile(userCredential.user, { displayName });
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Log in an existing user
 */
export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Log out the current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}
