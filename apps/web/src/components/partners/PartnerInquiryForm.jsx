import React, { useState } from "react";
import { Send, Building, Mail, Phone, User, FileText } from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const PartnerInquiryForm = ({ preselectedModel = "" }) => {
  const { success, error: showError } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipModel: preselectedModel,
    organizationType: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.organizationName ||
      !formData.contactName ||
      !formData.email
    ) {
      showError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/partners/inquiries", formData);

      success("Thank you! We'll be in touch within 24 hours.");

      // Reset form
      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipModel: "",
        organizationType: "",
        message: "",
      });
    } catch (err) {
      console.error("Form submission error:", err);
      showError("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
              <h2 className="text-3xl font-bold mb-2">Let's Work Together</h2>
              <p className="text-blue-100">
                Tell us about your organization and how we can partner for
                success
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="+1 (604) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Type & Partnership Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Organization Type
                  </label>
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select type...</option>
                    <option value="utility">Utility</option>
                    <option value="incubator">Incubator/Accelerator</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="municipality">Municipality</option>
                    <option value="developer">Property Developer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Partnership Model
                  </label>
                  <select
                    name="partnershipModel"
                    value={formData.partnershipModel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select model...</option>
                    <option value="Pilot Program">Pilot Program</option>
                    <option value="White-Label Solution">
                      White-Label Solution
                    </option>
                    <option value="Custom Integration">
                      Custom Integration
                    </option>
                    <option value="Not Sure">Not Sure Yet</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Tell us about your goals and how we can help..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={submitting}
                disabled={submitting}
                className="w-full"
              >
                <Send size={20} />
                {submitting ? "Sending..." : "Submit Inquiry"}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
                We respect your privacy. Your information will only be used to
                contact you about partnership opportunities.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnerInquiryForm;
