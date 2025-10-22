import "./index.css";
import { useEditor, EditorContent } from "@tiptap/react";
import { useState, type FC, useMemo } from "react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import sanitizeHtml from "sanitize-html";
import { useMsg } from "./store";
import TurndownService from "turndown";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Создаем TurndownService с кастомным правилом для underline
const turndownService = new TurndownService();
turndownService.addRule("underline", {
  filter: ["u"],
  replacement: function (content) {
    return `_${content}_`;
  },
});

// Кастомный компонент для подчеркнутого текста
const UnderlineText = ({ children }: { children: React.ReactNode }) => (
  <span style={{ textDecoration: "underline" }}>{children}</span>
);

const Tiptap = () => {
  const [value, setValue] = useState("");
  const setMsg = useMsg((state) => state.setMsgs);

  const sendMsg = () => {
    console.log(value);
    const sanitized = sanitizeHtml(value);
    setMsg(sanitized);
  };

  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Bold, Italic, Underline],
    content: "<p>Сообщение...</p>",
    onUpdate({ editor }) {
      setValue(editor.getHTML());
    },
  });

  return (
    <div className="editor">
      <EditorContent height={100} style={{ width: "100%" }} editor={editor} />
      <button onClick={sendMsg} className="send">
        →
      </button>
    </div>
  );
};

const Message: FC<{ value: string }> = ({ value }) => {
  // const markdown = useMemo(() => {
  //   return turndownService.turndown(value);
  // }, [value]);

  return (
    <div className={`message`}>
      <div className="content">
        <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
          {value}
        </Markdown>
      </div>
      <span className="time">12:00</span>
    </div>
  );
};

const MsgBacket = () => {
  const msgs = useMsg((state) => state.msgs);
  return (
    <div className="messages">
      {msgs.map((item, index) => (
        <Message key={index} value={item} />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="chat">
      <MsgBacket />
      <Tiptap />
    </div>
  );
};

export default App;
