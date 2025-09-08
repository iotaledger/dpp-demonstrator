import React, { useState } from 'react';

interface ContactSectionProps {
  title?: string;
  email?: string;
  emailLabel?: string;
  onCopy?: (email: string) => void;
  opacity?: number;
  delay?: number;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Contact us",
  email = "partnerships@iota.org",
  emailLabel = "Email Address",
  onCopy,
  opacity = 100,
  delay = 0
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(email);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const containerStyle = {
    opacity: opacity / 100,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.7s ease-out`
  };

  return (
    <div style={containerStyle}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-gray-200">
        <div className="text-center md:text-left">
          <h4 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center gap-3 md:gap-4 bg-white rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-gray-200 self-center md:self-auto">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 mb-1">{emailLabel}</span>
            <a 
              className="text-sm md:text-base text-gray-900 font-medium hover:text-blue-600 transition-colors truncate" 
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </div>
          <button 
            className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 bg-gray-100 hover:bg-gray-200" 
            title={copied ? "Copied!" : "Copy email address"}
            onClick={handleCopy}
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;