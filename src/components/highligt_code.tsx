// this should only be used to display static content (hence the "dangerously")
import hljs from "highlight.js";

export default function CodeBlock(code: string, language: string) {
    const myCode = hljs.highlight(code, { language: language }).value
    return (
      <pre>
        <code dangerouslySetInnerHTML={{ __html: myCode }} />
      </pre>
    )
  }