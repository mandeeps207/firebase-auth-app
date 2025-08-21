// src/components/ChatBox.js
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

function ChatBox({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!selectedUser || !auth.currentUser) return;

    const chatId =
      auth.currentUser.uid > selectedUser.id
        ? `${auth.currentUser.uid}_${selectedUser.id}`
        : `${selectedUser.id}_${auth.currentUser.uid}`;

    const msgsRef = collection(db, "chats", chatId, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const chatId =
      auth.currentUser.uid > selectedUser.id
        ? `${auth.currentUser.uid}_${selectedUser.id}`
        : `${selectedUser.id}_${auth.currentUser.uid}`;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMsg,
      from: auth.currentUser.uid,
      to: selectedUser.id,
      createdAt: serverTimestamp(),
    });

    setNewMsg("");
  };

  return (
    <div className="d-flex flex-column flex-grow-1 p-3">
      <h5>Chat with {selectedUser.email}</h5>
      <div
        className="flex-grow-1 border rounded p-2 mb-2"
        style={{ overflowY: "auto", height: "70vh" }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 ${
              m.from === auth.currentUser.uid ? "text-end" : "text-start"
            }`}
          >
            <span
              className={`py-1 px-2 rounded ${
                m.from === auth.currentUser.uid
                  ? "bg-primary text-white"
                  : "bg-secondary text-white"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message"
        />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
