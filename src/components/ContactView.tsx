import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactView: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    message: '',
    subject: 'General Craving Query',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    showToast('Message sent! Our support team will respond within 15 minutes.', 'success');
  };

  const faqs = [
    {
      q: 'How does the 25-minute rush delivery guarantee work?',
      a: 'We operate micro-kitchen hubs equipped with high-efficiency stone ovens and pre-prepped fresh ingredients. From order placement to dispatch takes less than 12 minutes, and our localized electric fleet covers the last mile within 10-13 minutes.',
    },
    {
      q: 'What if my food arrives delayed or not piping hot?',
      a: 'If your delivery exceeds our estimated rush window by more than 10 minutes without an extreme weather notification, contact us through the app and we will instantly credit ₹100 BiteCash or replace your dish.',
    },
    {
      q: 'Are all your dishes purely vegetarian?',
      a: 'We clearly tag every item with Green (Vegetarian) or Red (Non-Vegetarian) indicators. We maintain strict separate cook lines and kitchen utensils for 100% vegetarian preparation.',
    },
    {
      q: 'How do I customize toppings or remove ingredients?',
      a: 'Simply tap "Customize" or click on any pizza or burger card. You can select your cheese level (Normal, Extra Cheese, Liquid Burst), adjust spice, add toppings, or check "No Onions", "No Pickles", etc.',
    },
    {
      q: 'Can I track my delivery rider in real time?',
      a: 'Yes! Visit the "Track Order" page after placing your meal. You will see a live step-by-step timeline and rider contact details.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
          WE ARE HERE TO HELP
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
          Get in Touch with BiteRush
        </h1>
        <p className="text-base text-slate-300">
          Have an urgent craving question, order inquiry, or franchise interest? Our kitchen care team is on standby 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Quick Contact Cards & Locations */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#121620] border border-slate-800 space-y-6 shadow-xl">
            <h3 className="font-bold text-lg text-white font-display">Quick Support Lines</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Craving Hotline (Toll-Free)</h4>
                  <p className="text-slate-400 mt-0.5">1800-RUSH-BITE (1800-787-4248)</p>
                  <span className="text-[11px] text-emerald-400 font-medium">Available 24/7</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Care Desk</h4>
                  <p className="text-slate-400 mt-0.5">support@biterush-fastfood.com</p>
                  <span className="text-[11px] text-slate-500 font-medium">Response within ~15 mins</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Central Flagship Kitchen Hub</h4>
                  <p className="text-slate-400 mt-0.5">
                    14th Main Road, Indiranagar, Bengaluru, KA 560038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Operational Rush Hours</h4>
                  <p className="text-slate-400 mt-0.5">
                    Monday – Sunday: 10:00 AM – 3:30 AM (Late Night Rush)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#121620] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-xl text-white font-display">Send Kitchen Support a Message</h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg text-white font-display">Message Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, {formData.name}. Our duty manager has received your message and will contact you via email or phone shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Mehta"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      placeholder="e.g. BR-84920"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="General Craving Query">General Craving Query</option>
                    <option value="Order Status / Delay">Order Status / Delay Issue</option>
                    <option value="Food Quality / Feedback">Food Quality / Chef Feedback</option>
                    <option value="Franchise / Bulk Catering">Franchise & Party Catering</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind or how we can make your rush better..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm font-display flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="pt-8 border-t border-slate-800 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Answers to common questions about rush ordering, freshness, packaging and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#121620] border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
