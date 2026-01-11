// src/pages/LegalPage.jsx - Shared layout for legal pages
import React from "react";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { FileText, Shield, FileCheck, Cookie, ClipboardCheck } from "lucide-react";
import "../styles/legal.css";

export function LegalPage({ title, lastUpdated, icon: Icon, children }) {
  return (
    <PageWrapper>
      <div className="legal-page">
        <div className="legal-container">
          {/* Header */}
          <div className="legal-header">
            <div className="legal-header-icon">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="legal-title">{title}</h1>
              <p className="legal-updated">Last Updated: {lastUpdated}</p>
            </div>
          </div>

          {/* Content */}
          <div className="legal-content">
            {children}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export function LegalDisclaimerPage() {
  return (
    <LegalPage 
      title="Legal Disclaimer" 
      lastUpdated="January 10, 2026"
      icon={Shield}
    >
      <div className="legal-section">
        <p>
          The information provided by ChorEscape ("we," "our," or "us") on our website and mobile application (the "Service") is for general informational purposes only. 
          While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, services, or products offered through the Service.
        </p>
      </div>

      <div className="legal-section">
        <p>
          Your use of our Service is at your own risk. We are not responsible for any direct, indirect, incidental, or consequential damages arising from your use of or reliance on our Service.
        </p>
      </div>

      <div className="legal-section">
        <p>
          ChorEscape does not guarantee the availability, quality, or timeliness of any service providers hired through our platform. Users are responsible for vetting and verifying service providers before hiring.
        </p>
      </div>
    </LegalPage>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage 
      title="Privacy Policy" 
      lastUpdated="January 10, 2026"
      icon={Shield}
    >
      <div className="legal-toc">
        <h3 className="legal-toc-title">Table of Contents</h3>
        <ul className="legal-toc-list">
          <li><a href="#information-we-collect">Information We Collect</a></li>
          <li><a href="#how-we-use">How We Use Your Information</a></li>
          <li><a href="#information-sharing">Information Sharing</a></li>
          <li><a href="#your-rights">Your Rights</a></li>
          <li><a href="#security">Security</a></li>
        </ul>
      </div>

      <div className="legal-section" id="information-we-collect">
        <h2 className="legal-heading">Information We Collect</h2>
        <ul className="legal-list">
          <li>Name, email, phone number, address</li>
          <li>Booking and account information</li>
          <li>Payment details (processed securely)</li>
          <li>Usage and device data</li>
        </ul>
      </div>

      <div className="legal-section" id="how-we-use">
        <h2 className="legal-heading">Why We Collect Information</h2>
        <ul className="legal-list">
          <li>To provide and manage Services</li>
          <li>To process bookings and payments</li>
          <li>To communicate updates and support</li>
          <li>To improve platform performance</li>
        </ul>
      </div>

      <div className="legal-section" id="information-sharing">
        <h2 className="legal-heading">Information Sharing</h2>
        <p>
          We do <strong>not</strong> sell personal information. Data may be shared with Service Providers or legal authorities where required.
        </p>
      </div>

      <div className="legal-section" id="your-rights">
        <h2 className="legal-heading">Data Security</h2>
        <p>
          We use reasonable safeguards to protect your information, though no system is completely secure.
        </p>
      </div>

      <div className="legal-section" id="security">
        <h2 className="legal-heading">Access and Updates</h2>
        <p>
          You may request access to or correction of your personal data by contacting us.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">Policy Changes</h2>
        <p>
          This policy may be updated periodically and will always be available on our website.
        </p>
      </div>
    </LegalPage>
  );
}

export function TermsOfServicePage() {
  return (
    <LegalPage 
      title="Terms of Service" 
      lastUpdated="January 10, 2026"
      icon={FileCheck}
    >
      <div className="legal-section">
        <h2 className="legal-heading">1. Use of Service</h2>
        <p>
          You must be at least 16 years old to use our Service. You agree not to misuse the Service or interfere with its operation.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">2. Service Providers</h2>
        <p>
          ChorEscape connects users with independent service providers. We are <strong>not responsible</strong> for any acts, errors, or omissions of service providers.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">3. Bookings and Payments</h2>
        <p>
          All payments are processed securely via third-party payment gateways. Refunds and cancellations follow our specific policies listed in the app.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">4. Intellectual Property</h2>
        <p>
          All content on the Service, including logos, designs, and text, is owned by ChorEscape or its licensors. You may not copy, reproduce, or distribute our content without permission.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">5. Limitation of Liability</h2>
        <p>
          ChorEscape is not liable for indirect, incidental, or consequential damages from using the Service.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">6. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the country where the Service is accessed.
        </p>
      </div>
    </LegalPage>
  );
}

export function CookiePolicyPage() {
  return (
    <LegalPage 
      title="Cookie Policy" 
      lastUpdated="January 10, 2026"
      icon={Cookie}
    >
      <div className="legal-section">
        <h2 className="legal-heading">What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device to remember preferences, improve functionality, and analyze traffic.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">Types of Cookies We Use</h2>
        <ul className="legal-list">
          <li><strong>Essential Cookies:</strong> Required for core functionalities, like logging in or booking.</li>
          <li><strong>Performance Cookies:</strong> Help us understand how users interact with the Service.</li>
          <li><strong>Functional Cookies:</strong> Remember user preferences and settings.</li>
          <li><strong>Advertising Cookies:</strong> Track usage to show relevant ads (only with your consent).</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">Managing Cookies</h2>
        <p>
          You can control or disable cookies through your browser settings. Note that disabling certain cookies may affect your experience.
        </p>
        <p>
          You may disable cookies through your browser settings, though some features may not function properly.
        </p>
      </div>
    </LegalPage>
  );
}

export function BookingTermsPage() {
  return (
    <LegalPage 
      title="Booking Terms and Conditions" 
      lastUpdated="January 10, 2026"
      icon={ClipboardCheck}
    >
      <div className="legal-section">
        <p>
          ChorEscape provides residential and commercial services through its online booking platform ("Services"). 
          Our Services connect customers with independent service providers ("Service Providers") who perform the requested work at your premises.
        </p>
        <p>
          By accessing or using ChorEscape, you agree to be bound by these Booking Terms and Conditions ("Terms"). 
          If you do not agree, you must not use our Services.
        </p>
        <p>
          In these Terms, "you" means the individual or entity making a booking. "we," "us," or "our" means ChorEscape.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">Our Disclosures</h2>
        <p>Please review these Terms carefully, including:</p>
        <ul className="legal-list">
          <li>Our Privacy Policy, which explains how we handle personal information</li>
          <li>Our cancellation and fee policies</li>
          <li>Our limitation of liability provisions</li>
        </ul>
        <p>
          Nothing in these Terms limits your rights under applicable consumer protection laws.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">1. Engagement and Term</h2>
        <p><strong>1.1</strong> These Terms apply from the moment you make a booking or create an account with ChorEscape and continue until terminated.</p>
        <p><strong>1.2</strong> We provide access to the ChorEscape platform only. Service Providers are independent contractors, not employees or agents of ChorEscape.</p>
        <p><strong>1.3</strong> You agree to provide safe, reasonable access to the service location and ensure a hazard-free environment.</p>
        <p><strong>1.4</strong> Arrival times are estimates and may vary due to traffic, weather, or prior bookings.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">2. Bookings and Cancellations</h2>
        <p><strong>2.1</strong> Bookings may be made through our website or app.</p>
        <p><strong>2.2</strong> Cancellations or rescheduling:</p>
        <ul className="legal-list">
          <li>More than 24 hours before service: no charge</li>
          <li>Less than 24 hours before service: cancellation fee may apply</li>
          <li>If the provider arrives and cannot access the property due to customer fault, full or partial charges may apply</li>
        </ul>
        <p><strong>2.3</strong> We reserve the right to refuse or cancel bookings at our discretion.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">3. Pricing and Variations</h2>
        <p><strong>3.1</strong> Prices are based on the information provided at booking.</p>
        <p><strong>3.2</strong> Additional charges may apply if:</p>
        <ul className="legal-list">
          <li>The property is larger than described</li>
          <li>The scope of work differs materially</li>
          <li>Additional services are requested</li>
          <li>Unsafe or extreme conditions are present</li>
        </ul>
        <p><strong>3.3</strong> Any adjustments will be communicated where reasonably possible.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">4. Customer Obligations</h2>
        <p>You agree to:</p>
        <ul className="legal-list">
          <li>Provide accurate booking details</li>
          <li>Secure valuables and fragile items</li>
          <li>Ensure utilities such as water and electricity are available if required</li>
          <li>Treat Service Providers respectfully</li>
        </ul>
        <p>
          <strong>ChorEscape maintains zero tolerance for abuse, harassment, or unsafe behavior.</strong>
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">5. Accounts</h2>
        <p><strong>5.1</strong> You are responsible for maintaining the security of your account credentials.</p>
        <p><strong>5.2</strong> You must notify us immediately of any unauthorized account access.</p>
        <p><strong>5.3</strong> Closing your account may restrict access to Services.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">6. Payments and Fees</h2>
        <p><strong>6.1</strong> Payments are processed via third-party payment providers.</p>
        <p><strong>6.2</strong> You authorize ChorEscape or its payment processor to charge applicable fees.</p>
        <p><strong>6.3</strong> Failed or overdue payments may result in service suspension or collection actions.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">7. Reviews and Ratings</h2>
        <p><strong>7.1</strong> Customers may submit reviews following service completion.</p>
        <p><strong>7.2</strong> Reviews must be honest and accurate. False or defamatory reviews may result in account action.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">8. Availability and Downtime</h2>
        <p><strong>8.1</strong> We do not guarantee uninterrupted access to the platform.</p>
        <p><strong>8.2</strong> Services may be temporarily unavailable due to maintenance or third-party failures.</p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">9. Intellectual Property</h2>
        <p>
          All content, branding, logos, software, and designs belong to ChorEscape and may not be copied or reused without permission.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">10. Privacy and Confidentiality</h2>
        <p>
          Personal information is collected and handled in accordance with our Privacy Policy.
        </p>
        <p>
          We may disclose information to Service Providers or authorities where required by law.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">11. Consumer Rights</h2>
        <p>
          Nothing in these Terms excludes rights you may have under applicable consumer protection laws.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">12. Quality Assurance</h2>
        <p>
          If a service does not meet reasonable standards, please notify us within 48 hours.
          Where appropriate, we may arrange a re-service at no additional charge.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">13. Non-Circumvention</h2>
        <p>
          You agree not to directly hire or solicit ChorEscape Service Providers outside the platform for a period of 12 months after service completion.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">14. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law:</p>
        <ul className="legal-list">
          <li>ChorEscape is not liable for indirect or consequential losses</li>
          <li>Liability is limited to the amount paid for the affected service</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">15. Termination</h2>
        <p>
          We may suspend or terminate access if you breach these Terms, misuse the platform, or fail to pay fees.
        </p>
      </div>

      <div className="legal-section">
        <h2 className="legal-heading">16. Governing Law</h2>
        <p>
          These Terms are governed by the laws applicable in the jurisdiction where ChorEscape operates.
        </p>
      </div>
    </LegalPage>
  );
}
