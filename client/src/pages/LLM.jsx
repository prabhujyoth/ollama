import React, { useState, useEffect, useRef } from "react";
import { ActionIcon, Skeleton, TextInput } from "@mantine/core";
import sendIcon from "../assets/send.svg";
import userIcon from "../assets/user.svg";
import aiICon from "../assets/ai.svg";

export default function LLM() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const botMessageRef = useRef(""); // Ref to store the bot's message text

  function handleUserInput(e) {
    setUserInput(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.body) {
        throw new Error("No response body received!");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      botMessageRef.current = ""; // Reset bot message before a new response

      // Add a new empty bot message first
      setMessages((prev) => [...prev, { role: "bot", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let startIndex = 0;
        while (startIndex < buffer.length) {
          const jsonStart = buffer.indexOf("{", startIndex);
          if (jsonStart === -1) break;

          let jsonEnd = -1;
          let braceCount = 0;
          for (let i = jsonStart; i < buffer.length; i++) {
            if (buffer[i] === "{") braceCount++;
            if (buffer[i] === "}") braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }

          if (jsonEnd === -1) break;

          const jsonString = buffer.slice(jsonStart, jsonEnd);
          try {
            const outerJson = JSON.parse(jsonString);
            if (outerJson.response) {
              try {
                const innerJson = JSON.parse(outerJson.response);
                if (innerJson.response) {
                  botMessageRef.current += innerJson.response; // Append response instead of replacing

                  setMessages((prev) => {
                    const updatedMessages = [...prev];
                    updatedMessages[updatedMessages.length - 1] = {
                      ...updatedMessages[updatedMessages.length - 1],
                      text: botMessageRef.current,
                    };
                    return updatedMessages;
                  });
                }
              } catch (innerErr) {
                console.error("Inner JSON Parse Error:", innerErr);
              }
            }
          } catch (outerErr) {
            console.error("Outer JSON Parse Error:", outerErr);
          }

          startIndex = jsonEnd;
        }
        buffer = buffer.slice(startIndex);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Updated Messages State:", messages);
  }, [messages]);

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 flex-col p-8 h-full">
        <div
          className="body overflow-auto flex flex-col gap-8 p-4 flex-1 bg-neutral-800  max-[596px]:w-full  w-3/4  rounded-sm [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-blue-500
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-blue-500"
        >
          {messages.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
              <h2 className="text-4xl">Hey User👋!</h2>
              <p className="text-xs">Start chat by entering a prompt.</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-auto gap-2 items-start ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="circle flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
                  <div className="w-40 flex justify-center">
                    <img src={aiICon} width={20} alt="" />
                  </div>
                </div>
              )}
              <div
                className={`bg-neutral-700 p-2 rounded-sm ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              {msg.role === "user" && (
                <div className="circle flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
                  <div className="w-40 flex justify-center">
                    <img src={userIcon} width={20} alt="" />
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* {loading && (
            <div className="w-full">
              <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </div>
          )} */}
        </div>

        <TextInput
          radius="xl"
          className="xl:w-1/2 md:w-3/4 sm:w-3/4 w-3/4"
          size="md"
          placeholder="Message Llama 3.2 LLM"
          value={userInput}
          rightSectionWidth={42}
          onChange={(e) => handleUserInput(e)}
          rightSection={
            <ActionIcon type="submit" size={32} radius="xl" variant="filled">
              <img src={sendIcon} alt="" width={15} />
            </ActionIcon>
          }
        />
      </div>
    </form>
  );
}
