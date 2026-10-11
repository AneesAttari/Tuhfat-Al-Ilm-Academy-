import React from 'react';
import { FAQS } from '../data/faqs';

export const FaqPage: React.FC = () => {
  return (
    <div className="space-y-8 px-6">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div key={index} className="p-6 bg-white rounded-xl border border-emerald-100 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-900">{faq.question}</h3>
            <p className="text-gray-700 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
