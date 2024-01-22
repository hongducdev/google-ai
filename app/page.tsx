"use client";
import Chat from "@/components/Chat";
import axios from "axios";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import { RiAccountCircleFill, RiRobot2Fill } from "react-icons/ri";

interface IMessage {
  type: "sent" | "received";
  text: string;
}

export default function Home() {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (): Promise<void> => {
    setValue("");
    setLoading(true);
    // Add the user's message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", text: value },
    ]);

    try {
      const res = await axios.post("/api/chat", { message: value });
      // Add the received message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "received", text: res.data.text }, // Assuming res.data is a string
      ]);
    } catch (error) {
      console.error("There was an error sending the message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="flex h-screen bg-neutral-900 px-10 py-5">
      <section className="bg-neutral-950 w-full rounded-3xl ">
        <section className="max-w-[1000px] mx-auto relative">
          <section className="flex-grow max-h-[calc(100vh-120px)] overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div className="flex flex-col gap-3" key={index}>
                {msg.type === "sent" ? (
                  <div className="flex gap-3 my-3">
                    <RiAccountCircleFill className="text-4xl" />
                    <div className="bg-neutral-800 text-white px-4 py-2 rounded-md">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 my-3">
                    <RiRobot2Fill className="text-4xl" />
                    <div className="bg-neutral-800 text-white px-4 py-2 rounded-md">
                      <Chat text={msg.text} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </section>
          <section className="w-full flex items-center gap-3 p-4 fixed bottom-5 max-w-[1000px]">
            <input
              type="text"
              placeholder="Nhập câu lệnh tại đây..."
              className="input input-bordered input-primary w-full bg-transparent rounded-full"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="btn btn-active"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Send"
              )}
            </button>
          </section>
        </section>
      </section>
    </main>
  );
}
