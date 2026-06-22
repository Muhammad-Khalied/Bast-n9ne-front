"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useSettings } from "../../../hooks/useSettings";

export default function ContactPage() {
  const { settings, isLoading } = useSettings();

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-brand-ivory animate-pulse" />;
  }

  return (
    <div className="bg-brand-ivory min-h-[70vh] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-overline text-brand-sage uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-display-md font-display text-brand-black mb-6">CONTACT US</h1>
          <p className="text-body-lg text-brand-charcoal max-w-2xl mx-auto">
            We are here to help. Whether you have a question about our collections, need assistance with your order, or simply want to share your thoughts, our dedicated client service team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-brand-white p-8 md:p-12 rounded-brand-lg shadow-sm border border-brand-ivory-dark">
            <h2 className="text-xl font-bold text-brand-black mb-8 uppercase tracking-wide border-b border-brand-ivory-dark pb-4">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-sage-50 text-brand-sage flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-1">Email</h3>
                  <a href={`mailto:${settings.contact_email || 'support@Bast n9ne.local'}`} className="text-brand-charcoal hover:text-brand-sage transition-colors">
                    {settings.contact_email || 'support@Bast n9ne.local'}
                  </a>
                  <p className="text-xs text-brand-muted mt-1">We aim to reply within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-sage-50 text-brand-sage flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-1">Phone</h3>
                  <a href={`tel:${settings.contact_phone || '+1 234 567 890'}`} className="text-brand-charcoal hover:text-brand-sage transition-colors">
                    {settings.contact_phone || '+1 234 567 890'}
                  </a>
                  <p className="text-xs text-brand-muted mt-1">Available Mon-Fri, 9am - 6pm (EST).</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-sage-50 text-brand-sage flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black mb-1">Hours of Operation</h3>
                  <div className="text-brand-charcoal whitespace-pre-line text-sm">
                    {settings.hours_of_operation || "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social / Other Info */}
          <div className="bg-brand-black p-8 md:p-12 rounded-brand-lg shadow-sm text-brand-ivory">
            <h2 className="text-xl font-bold text-brand-white mb-8 uppercase tracking-wide border-b border-brand-charcoal pb-4">Social Connect</h2>
            <p className="mb-8 text-brand-muted leading-relaxed">
              Follow us on our social media platforms for the latest updates on new collections, exclusive events, and behind-the-scenes looks at our design process.
            </p>
            
            <div className="space-y-4">
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="block w-full py-4 px-6 border border-brand-charcoal rounded hover:bg-brand-charcoal transition-colors uppercase tracking-widest text-sm font-bold text-center">
                  Follow on Instagram
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="block w-full py-4 px-6 border border-brand-charcoal rounded hover:bg-brand-charcoal transition-colors uppercase tracking-widest text-sm font-bold text-center">
                  Follow on Facebook
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="block w-full py-4 px-6 border border-brand-charcoal rounded hover:bg-brand-charcoal transition-colors uppercase tracking-widest text-sm font-bold text-center">
                  Follow on Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
