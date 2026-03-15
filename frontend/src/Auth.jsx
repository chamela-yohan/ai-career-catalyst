import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

import './App.css';

function Auth({ onUserChange }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      onUserChange(user); // App.jsx එකට user data දෙනවා
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-profile">
          <img 
            src={user.photoURL} 
            alt="profile"
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{borderRadius: '10px'}}
            referrerPolicy="no-referrer" 
            className="profile-img"
          />
          <h2>{user.displayName}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
    </div>
  );
}



export default Auth;