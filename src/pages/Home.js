import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";

function Home() {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        // Save user info to Firestore
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            email: currentUser.email,
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="d-flex">
      <UserList onSelectUser={setSelectedUser} />
      <ChatBox selectedUser={selectedUser} />
      <button
        onClick={handleLogout}
        className="btn btn-danger position-absolute top-0 end-0 m-3"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
