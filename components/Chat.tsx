import React from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Markdown from "react-markdown";

interface IChat {
  text: string;
}

interface Part {
  type: "text" | "code";
  content: string;
  language?: string;
}

const Chat: React.FC<IChat> = ({ text }) => {
  const splitTextAndCodeBlocks = (): Part[] => {
    const pattern = /(```[a-zA-Z]*[\s\S]*?```)/gm;
    let lastIndex = 0;
    const parts: Part[] = [];

    text.replace(pattern, (match, p1, offset) => {
      if (offset > lastIndex) {
        parts.push({
          type: "text",
          content: text.substring(lastIndex, offset),
        });
      }

      const languageMatch = match.match(/^```([a-zA-Z]+)/);
      const language = languageMatch ? languageMatch[1] : "css";

      const codeBlock = match
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/\n?```$/, "");

      parts.push({
        type: "code",
        content: codeBlock,
        language,
      });
      lastIndex = offset + match.length;
      return "";
    });

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return parts;
  };

  const parts = splitTextAndCodeBlocks();

  return (
    <div >
      {parts.map((part, index) =>
        part.type === "code" ? (
          <SyntaxHighlighter
            key={index}
            language={part.language}
            style={dracula}
            showLineNumbers={true}
            showInlineLineNumbers={true}
            className="rounded-lg my-1"
          >
            {part.content}
          </SyntaxHighlighter>
        ) : (
          <Markdown key={index}>{part.content}</Markdown>
        )
      )}
    </div>
  );
};

export default Chat;
