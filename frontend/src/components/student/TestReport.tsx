
const TestReport = ({ report, onBack }: { report: any, onBack?: () => void }) => {
  if (!report) return null;

  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Test Result</h2>
          {report.student?.name && (
            <p className="text-sm text-gray-500">Student: <span className="font-semibold">{report.student.name}</span></p>
          )}
          {report.topic?.title && (
            <p className="text-sm text-gray-500">Topic: <span className="font-semibold">{report.topic.title}</span></p>
          )}
        </div>
        
        {onBack && (
          <button 
            onClick={onBack}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors"
          >
            &larr; Back to List
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{report.score} / {report.total}</div>
            <div className="text-xs text-blue-400 uppercase font-semibold">Score</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{report.percentage}%</div>
            <div className="text-xs text-purple-400 uppercase font-semibold">Percentage</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
             <div className="text-3xl font-bold text-green-600">
               {report.details.filter((d: any) => d.isCorrect).length}
             </div>
             <div className="text-xs text-green-400 uppercase font-semibold">Correct Answers</div>
        </div>
      </div>

      {report.analysis && (
        <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-800 mb-2">✨ AI Performance Analysis</h3>
          <p className="text-indigo-700 mb-4">{report.analysis.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">💪 Strengths</h4>
              <ul className="list-disc list-inside space-y-1">
                {report.analysis.strengths.map((s: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700">{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">⚠️ Areas for Improvement</h4>
              <ul className="list-disc list-inside space-y-1">
                {report.analysis.weaknesses.map((w: string, idx: number) => (
                   <li key={idx} className="text-sm text-gray-700">{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {report.analysis.improvementTips?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <h4 className="font-semibold text-blue-700 mb-2">💡 Tips for Improvement</h4>
              <ul className="space-y-1">
                {report.analysis.improvementTips.map((tip: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span>•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <h3 className="font-semibold text-lg mb-4 text-gray-700">Detailed Analysis</h3>
      <div className="space-y-4">
        {report.details.map((item: any, idx: number) => (
          <div key={idx} className={`p-4 border rounded-lg ${item.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex gap-3">
               <span className="font-bold text-gray-400">Q{idx + 1}</span>
               <div className="flex-1">
                 <div className="font-medium text-gray-800 mb-2">{item.question}</div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className={item.isCorrect ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
                        Your Answer: {item.yourAnswer}
                    </div>
                    <div className="text-gray-600">
                        Correct Answer: <span className="font-medium text-gray-800">{item.correctAnswer}</span>
                    </div>
                 </div>
               </div>
               <div className="text-2xl">
                 {item.isCorrect ? "✅" : "❌"}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestReport;
