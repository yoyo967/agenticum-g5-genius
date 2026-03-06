interface QuickAnswerProps {
  question: string;
  answer: string;
}

export function QuickAnswer({ question, answer }: QuickAnswerProps) {
  return (
    <div
      className="my-8 p-6 border border-blue-500/20 bg-blue-500/5 rounded-2xl"
      itemScope
      itemType="https://schema.org/Question"
    >
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-blue-400 text-[10px] font-bold">?</span>
        </div>
        <div>
          <p className="font-mono text-[10px] text-blue-500 uppercase tracking-widest mb-2" itemProp="name">{question}</p>
          <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
            <p className="text-zinc-300 text-sm leading-relaxed" itemProp="text">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
