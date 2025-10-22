// PIPEDA-compliant privacy policy content

export const privacyPolicy = {
  lastUpdated: "2024-10-21",
  effectiveDate: "2024-10-21",

  sections: [
    {
      id: "introduction",
      title: "Introduction",
      icon: "FileText",
      content: `Eco-Grid Inc. ("we", "our", "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our energy management platform and services.

This policy complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable Canadian privacy laws.`,
    },
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: "Database",
      content: `We collect several types of information to provide and improve our services:`,
      subsections: [
        {
          title: "Personal Information",
          items: [
            "Name and contact information (email, phone, address)",
            "Account credentials (encrypted passwords)",
            "Billing and payment information",
            "Communication preferences and language settings",
          ],
        },
        {
          title: "Energy Usage Data",
          items: [
            "Real-time and historical energy consumption",
            "Device operation data (on/off status, settings)",
            "Smart meter readings and timestamps",
            "Solar generation and battery storage data",
          ],
        },
        {
          title: "Technical Information",
          items: [
            "IP addresses and device identifiers",
            "Browser type and version",
            "Operating system and device specifications",
            "Usage patterns and interaction data",
          ],
        },
      ],
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: "Settings",
      content: `We use your information for the following purposes:`,
      items: [
        "Providing energy optimization and management services",
        "Generating personalized recommendations and reports",
        "Processing payments and managing your subscription",
        "Improving our AI models and algorithms (anonymized data)",
        "Communicating important updates and support",
        "Complying with legal obligations and regulations",
        "Detecting and preventing fraud or security threats",
      ],
    },
    {
      id: "sharing",
      title: "Information Sharing and Disclosure",
      icon: "Share2",
      content: `We do not sell your personal information. We may share your information only in the following circumstances:`,
      items: [
        "With your explicit consent for specific purposes",
        "With service providers who assist in our operations (e.g., cloud hosting, payment processing)",
        "With utility companies when you opt into VPP or demand response programs",
        "To comply with legal obligations, court orders, or government requests",
        "To protect our rights, safety, or the rights of others",
        "In connection with a business transfer (merger, acquisition) with continued privacy protection",
      ],
    },
    {
      id: "storage",
      title: "Data Storage and Retention",
      icon: "HardDrive",
      content: `Your data is stored securely in Canadian data centers with the following safeguards:`,
      items: [
        "Encryption at rest (AES-256) and in transit (TLS 1.3)",
        "Regular security audits and penetration testing",
        "Access controls with role-based permissions",
        "Automated backup and disaster recovery systems",
        "Data retention: Active data for subscription duration + 2 years; anonymized aggregated data retained indefinitely for research",
        "You may request deletion of your personal data at any time (subject to legal retention requirements)",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      icon: "UserCheck",
      content: `Under PIPEDA and other applicable laws, you have the following rights:`,
      items: [
        "**Access**: Request a copy of your personal information",
        "**Correction**: Update or correct inaccurate information",
        "**Deletion**: Request deletion of your personal data",
        "**Portability**: Receive your data in a structured, machine-readable format",
        "**Objection**: Object to certain data processing activities",
        "**Withdraw Consent**: Withdraw consent for optional data processing",
        "**Complaint**: File a complaint with the Office of the Privacy Commissioner of Canada",
      ],
    },
    {
      id: "security",
      title: "Security Measures",
      icon: "Shield",
      content: `We implement industry-leading security practices:`,
      items: [
        "Zero-trust architecture with continuous verification",
        "Multi-factor authentication for all accounts",
        "Regular security training for all team members",
        "Incident response plan with 24/7 monitoring",
        "Annual third-party security audits",
        "Compliance with ISO 27001 standards (certification in progress)",
      ],
    },
    {
      id: "international",
      title: "Cross-Border Data Transfers",
      icon: "Globe",
      content: `Your data is primarily stored in Canada. In limited cases, we may transfer data internationally:`,
      items: [
        "Cloud infrastructure providers with Canadian data residency",
        "Support services with PIPEDA-equivalent privacy protections",
        "All international transfers comply with PIPEDA requirements",
        "We use standard contractual clauses and adequacy decisions where applicable",
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: "Baby",
      content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately for deletion.`,
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: "RefreshCw",
      content: `We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Significant changes will be communicated via email or in-app notification. Continued use after changes constitutes acceptance of the updated policy.`,
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: "Mail",
      content: `For privacy-related questions, requests, or complaints, please contact our Privacy Officer:`,
      details: {
        email: "privacy@ecogrid.ca",
        phone: "+1 (604) 123-4567",
        address:
          "Eco-Grid Inc.\n123 Clean Energy Way\nVancouver, BC V6B 1A1\nCanada",
        responseTime:
          "We will respond to all requests within 30 days as required by PIPEDA.",
      },
    },
  ],
};

export const consentTypes = [
  {
    id: "essential",
    title: "Essential Services",
    description: "Required for core platform functionality",
    required: true,
    enabled: true,
  },
  {
    id: "analytics",
    title: "Analytics & Performance",
    description: "Help us improve the platform through usage analysis",
    required: false,
    enabled: true,
  },
  {
    id: "marketing",
    title: "Marketing Communications",
    description: "Receive product updates and energy-saving tips",
    required: false,
    enabled: false,
  },
  {
    id: "research",
    title: "Research & Development",
    description: "Use anonymized data to improve AI models",
    required: false,
    enabled: true,
  },
];
