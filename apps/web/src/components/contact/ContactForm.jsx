import React, { useState, useEffect } from "react";
import {
  Send,
  User,
  Mail,
  Building,
  Phone,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import MathCaptcha from "./MathCaptcha";
import { useContactForm } from "../../hooks/useContactForm";
import { validateContactForm } from "../../lib/formValidation";

const ContactForm = ({ onSuccess }) => {
  const { submitForm, submitting, error: submitError } = useContactForm();
  const [formStartTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    captchaAnswer: "",
    honeypot: "", // Hidden field for spam detection
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Anti-spam: Check honeypot
    if (formData.honeypot) {
      return; // Silent fail for bots
    }

    // Anti-spam: Check time-to-submit (must be > 3 seconds)
    const timeToSubmit = Date.now() - formStartTime;
    if (timeToSubmit < 3000) {
      setErrors({ submit: "Please take your time filling out the form" });
      return;
    }

    // Validate form
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Validate CAPTCHA
    if (!formData.captchaAnswer) {
      setErrors({ captchaAnswer: "Please answer the security question" });
      return;
    }

    // Submit form
    const result = await submitForm(formData);

    if (result.success) {
      onSuccess(result.referenceId);
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <Card>
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
        <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
        <p className="text-blue-100">
          Have a question or want to discuss a partnership? We're here to help.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Honeypot (hidden) */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-slate-50 dark:bg-slate-800
                border-2 
                ${
                  touched.fullName && errors.fullName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                }
                text-slate-900 dark:text-white
                focus:ring-2 transition-all
              `}
              placeholder="John Doe"
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
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
              onBlur={handleBlur}
              required
              className={`
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-slate-50 dark:bg-slate-800
                border-2 
                ${
                  touched.email && errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                }
                text-slate-900 dark:text-white
                focus:ring-2 transition-all
              `}
              placeholder="john@example.com"
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Company & Phone (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Company
            </label>
            <div className="relative">
              <Building
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Acme Corp"
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
                onBlur={handleBlur}
                className={`
                  w-full pl-11 pr-4 py-3 rounded-xl
                  bg-slate-50 dark:bg-slate-800
                  border-2 
                  ${
                    touched.phone && errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                  }
                  text-slate-900 dark:text-white
                  focus:ring-2 transition-all
                `}
                placeholder="+1 (604) 123-4567"
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`
                w-full pl-11 pr-4 py-3 rounded-xl
                bg-slate-50 dark:bg-slate-800
                border-2 
                ${
                  touched.subject && errors.subject
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                }
                text-slate-900 dark:text-white
                focus:ring-2 transition-all
              `}
              placeholder="How can we help?"
            />
          </div>
          {touched.subject && errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            rows={5}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-slate-50 dark:bg-slate-800
              border-2 
              ${
                touched.message && errors.message
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
              }
              text-slate-900 dark:text-white
              focus:ring-2 transition-all resize-none
            `}
            placeholder="Tell us more about your inquiry..."
          />
          {touched.message && errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.message}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {formData.message.length}/2000 characters
          </p>
        </div>

        {/* Math CAPTCHA */}
        <MathCaptcha
          value={formData.captchaAnswer}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, captchaAnswer: value }))
          }
          error={errors.captchaAnswer}
        />

        {/* Submit Error */}
        {(errors.submit || submitError) && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle
              className="text-red-600 dark:text-red-400 flex-shrink-0"
              size={20}
            />
            <p className="text-sm text-red-700 dark:text-red-300">
              {errors.submit || submitError}
            </p>
          </div>
        )}

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
          {submitting ? "Sending..." : "Send Message"}
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
          By submitting this form, you agree to our Privacy Policy. We'll only
          use your information to respond to your inquiry.
        </p>
      </form>
    </Card>
  );
};

export default ContactForm;
