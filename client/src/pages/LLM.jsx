import React, { useState, useEffect, useRef } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import sendIcon from "../assets/send.svg";
import userIcon from "../assets/user.svg";
import aiIcon from "../assets/ai.svg";
import { marked } from "marked";

export default function LLM() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const botMessageRef = useRef("");

  function handleUserInput(e) {
    setUserInput(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", text: userInput };
    const fullMessageHistory = [
      ...messages.map((msg) => ({
        role: msg.role === "bot" ? "assistant" : msg.role,
        content: msg.text,
      })),
      { role: "user", content: userInput },
    ];

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: fullMessageHistory }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      botMessageRef.current = "";
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
                if (innerJson.message?.content) {
                  botMessageRef.current += innerJson.message.content;

                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...updated[updated.length - 1],
                      text: botMessageRef.current,
                    };
                    return updated;
                  });
                }
              } catch {
                botMessageRef.current += outerJson.response;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: botMessageRef.current,
                  };
                  return updated;
                });
              }
            }
          } catch (err) {
            console.error("JSON parse error:", err);
          }

          startIndex = jsonEnd;
        }

        buffer = buffer.slice(startIndex);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 flex-col p-8 h-full">
        <div className="overflow-auto flex flex-col gap-8 p-4 flex-1 bg-[#252525] max-[596px]:w-full w-3/4 rounded-sm">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2 items-center justify-center h-full">
              <h2 className="text-4xl">Hey there! 😊</h2>
              <p className="text-xs">
                Just type in anything to start the chat—I'm here to help! 🚀
              </p>
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
                  <img src={aiIcon} width={20} alt="" />
                </div>
              )}
              <div
                className={`bg-neutral-700 p-2 rounded-sm ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                className="prose prose-invert max-w-none"
              ></div>


              </div>
              {msg.role === "user" && (
                <div className="circle flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
                  <img src={userIcon} width={20} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>

        <TextInput
          radius="md"
          className="xl:w-1/2 md:w-3/4 sm:w-3/4 w-3/4"
          size="lg"
          placeholder="Ask Anything..."
          value={userInput}
          rightSectionWidth={48}
          onChange={handleUserInput}
          rightSection={
            <ActionIcon type="submit" size={38} radius="md" variant="filled">
              <img src={sendIcon} alt="" width={15} />
            </ActionIcon>
          }
        />
      </div>
    </form>
  );
}
