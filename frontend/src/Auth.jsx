import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

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
          <img style={{borderRadius:'10px', marginRight: '10px'}} src={user.photoURL} alt="profile" />
          <h2>{user.displayName}</h2>
          <button style={{marginRight: '10px'}} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
    </div>
  );
}

export default Auth;