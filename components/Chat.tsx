"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useChat } from "ai/react";
import BubbleMessage from "./BubbleMessage";
import { scrollToBottom } from "@/util/scroll";
import { errorNotify } from "@/util/alert";

export default function SloganGenerator() {
  const [isUserManuallyScrolling, setIsUserManuallyScrolling] = useState(false);

  const containerRef = useRef<any>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/completion",
      initialMessages: [
        { role: "assistant", content: "How can I help you?", id: "#17#" },
      ],
      onError(error) {
        errorNotify(error.message);
      },
    });

  useEffect(() => {
    if (messages.length > 1 && !isUserManuallyScrolling) {
      scrollToBottom(containerRef);
    }
  }, [messages, isUserManuallyScrolling]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const atBottom =
          Math.ceil(scrollTop) + clientHeight + 100 >= scrollHeight;

        if (atBottom) {
          setIsUserManuallyScrolling(false);
          console.log("Fething more message...");
        } else {
          setIsUserManuallyScrolling(true);
        }
      };

      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div className="md:px-8 md:py-5 px-2 flex flex-col max-w-5xl w-full ring-slate-900 rounded-md flex-1 ring-1 shadow-xl">
      <section
        id="chatBox"
        className="min-h-full last-of-type:pb-44  w-full p-5 pb-2 max-h-[500px] overflow-y-auto flex gap-2 flex-col  scrollbar  scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        ref={containerRef}
      >
        {messages.map((m, idx) => (
          <BubbleMessage content={m.content} role={m.role} key={idx} />
        ))}
      </section>

      <section
        id="bottomInput"
        className="pb-8 fixed bottom-1 left-5 right-5 flex justify-center mx-auto"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto max-w-4xl items-center"
        >
          <div className="flex items-stretch justify-center rounded-sm overflow-hidden m-0">
            <textarea
              className="flex-1 text-left p-3 resize-none border-none rounded-l-full shadow-md py-4 px-4 dark:text-black focus:outline-none"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              rows={1}
            />
            <button
              disabled={isLoading}
              type="submit"
              className={`flex items-center w-[100px] justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-full focus:outline-none ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              } ${
                isLoading && "disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isLoading ? "Loading..." : "Send"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
