import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-slate-700">Bangladesh & Melbourne Time Converter</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Asia/Dhaka (BST) & Australia/Melbourne (AEST/AEDT)</span>
        </div>
        <div className="text-slate-400">
          Standard IANA Time Zone Database
        </div>
      </div>
    </footer>
  );
};
