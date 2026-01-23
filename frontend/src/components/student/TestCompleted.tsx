import React from "react";

type TestCompletedProps = {
  report: any;
  onViewReport: () => void;
  onBackToDashboard: () => void;
};

const TestCompleted: React.FC<TestCompletedProps> = ({ report, onViewReport, onBackToDashboard }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border rounded shadow-sm text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted Successfully!</h2>
      <p className="text-gray-600 mb-6">Your answers have been recorded.</p>

      <div className="bg-slate-50 p-4 rounded-lg w-full max-w-sm mb-6">
        <div className="text-sm text-gray-500 mb-1">Your Score</div>
        <div className="text-3xl font-bold text-gray-900">
          {report.score} <span className="text-lg text-gray-500 font-normal">/ {report.total}</span>
        </div>
        <div className="text-sm font-medium text-blue-600 mt-1">{report.percentage}%</div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onBackToDashboard}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded border"
        >
          Back to Dashboard
        </button>
        <button 
          onClick={onViewReport}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm"
        >
          View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default TestCompleted;
