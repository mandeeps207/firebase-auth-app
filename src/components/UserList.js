// src/components/UserList.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.email !== auth.currentUser.email);

      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="border-end p-3" style={{ width: "250px", }}>
      <h5>Users</h5>
      <ul className="list-group">
        {users.map((u) => (
          <li
            key={u.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => onSelectUser(u)}
            style={{ cursor: "pointer" }}
          >
            {u.email}
            <span
              className={`badge rounded-pill ${
                u.isOnline ? "bg-success" : "bg-secondary"
              }`}
            >
              {u.isOnline ? "Online" : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
