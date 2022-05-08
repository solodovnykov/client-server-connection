import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
import axios from "axios";

const EventSourcing = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource(`http://localhost:5000/connect`);
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
  };

  const sendMessage = async () => {
    await axios.post(
      "http://localhost:5000/new-messages",
      {
        message: value,
        id: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-transform",
        },
      }
    );
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

export default EventSourcing;
