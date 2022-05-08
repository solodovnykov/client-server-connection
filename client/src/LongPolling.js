import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
import axios from "axios";

const LongPolling = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/get-messages", {
        headers: {
          "Cache-Control": "no-cache, no-transform",
        },
      });
      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch (e) {
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };

  const sendMessage = async () => {
    await axios.post("http://localhost:5000/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.message}>
              {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongPolling;
