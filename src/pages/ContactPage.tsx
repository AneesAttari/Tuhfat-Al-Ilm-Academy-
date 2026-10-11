import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="space-y-8 px-6">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="text-lg">Get in touch with Tuhfat Al-Ilm Academy.</p>
      
      <div className="space-y-4">
        <a href="https://wa.me/923171503094" className="flex items-center gap-3 text-emerald-900 text-lg">
          <MessageCircle /> WhatsApp: +92 317 1503094
        </a>
        <a href="tel:+923096794698" className="flex items-center gap-3 text-emerald-900 text-lg">
          <Phone /> Call: +92 309 6794698
        </a>
        <a href="mailto:tuhfatalilmacademy@gmail.com" className="flex items-center gap-3 text-emerald-900 text-lg">
          <Mail /> Email: tuhfatalilmacademy@gmail.com
        </a>
      </div>
    </div>
  );
};
