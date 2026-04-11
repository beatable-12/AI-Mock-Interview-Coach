import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Contact Support</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Have a question or found a bug? Let us know!</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message Sent!</h2>
            <p className="text-gray-600 dark:text-gray-400">Thanks for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input required type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" placeholder="Your name" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input required type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" placeholder="you@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
              <textarea required rows="5" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow resize-none" placeholder="What can we help you with?"></textarea>
            </div>

            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
