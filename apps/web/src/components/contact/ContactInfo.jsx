import React from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card } from "../ui/Card";

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "support@ecogrid.ca",
      href: "mailto:support@ecogrid.ca",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (604) 123-4567",
      href: "tel:+16041234567",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "Vancouver, BC, Canada",
      href: "https://maps.google.com",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon-Fri, 9 AM - 5 PM PT",
      href: null,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Contact Information
          </h3>
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  bg-gradient-to-br ${method.color}
                  shadow-lg group-hover:scale-110 transition-transform duration-300
                `}
                >
                  <method.icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {method.label}
                  </div>
                  {method.href ? (
                    <a
                      href={method.href}
                      target={
                        method.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        method.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <div className="text-slate-900 dark:text-white font-medium">
                      {method.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Quick Links
          </h3>
          <div className="space-y-2">
            <a
              href="/about"
              className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About Eco-Grid
            </a>
            <a
              href="/partners"
              className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Partnership Opportunities
            </a>
            <a
              href="/reports"
              className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Platform Demo
            </a>
          </div>
        </div>
      </Card>

      {/* AI Chat Prompt */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Need Instant Help?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                Try our AI assistant for quick answers to common questions about
                pricing, features, and more.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Look for the chat icon in the bottom-right corner
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactInfo;
