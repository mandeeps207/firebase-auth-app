// src/components/Navbar.js
import React from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

function Navbar() {
  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { isOnline: false });
    }
    await auth.signOut();
  };

  return (
    <nav className="navbar navbar-light bg-light px-3">
      <span className="navbar-brand">Chat App</span>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
