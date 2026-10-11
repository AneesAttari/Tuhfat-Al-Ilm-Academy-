import React from 'react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="space-y-8 px-6">
      <h1 className="text-4xl font-bold">How It Works</h1>
      <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-700">
        <li>Contact us to discuss your learning goals.</li>
        <li>Schedule a trial session with a qualified teacher.</li>
        <li>Finalize your class schedule and begin your studies.</li>
        <li>Access lessons via our secure online platform.</li>
      </ol>
    </div>
  );
};
