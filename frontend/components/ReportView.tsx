import ReactMarkdown from "react-markdown";

interface Props {
  report: string;
}

export default function ReportView({ report }: Props) {
  return (
    <div className="prose prose-invert prose-indigo max-w-none text-slate-300 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-slate-200 prose-p:my-2 prose-ul:my-2">
      <ReactMarkdown>{report}</ReactMarkdown>
    </div>
  );
}