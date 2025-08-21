// src/App.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, "users", u.uid);
        updateDoc(userRef, { isOnline: true }).catch(async () => {
          await setDoc(userRef, { email: u.email, isOnline: true });
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    setEmail("");
    setPassword("");
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <h3>{isRegister ? "Register" : "Login"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="btn btn-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <UserList onSelectUser={setSelectedUser} />
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser} />
        ) : (
          <div className="p-3">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
}

export default App;
