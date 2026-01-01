#let company_name = "leoj.de - Leopold Jofer"
#let company_address = "Heisenbergstraße 7"
#let company_city = "85748, Garching bei München"
#let company_email = "mail@leoj.de"
#let company_phone = "+49 1525 360 4211"
#let company_register = "" // Optional: Commercial Register number
#let company_vat = "" // Optional: VAT ID
#let jurisdiction_city = "Garching bei München"

// Pricing information
#let plan_1_name = "Free Plan"
#let plan_1_price = "0€/month"
#let plan_2_name = "Pro Plan"
#let plan_2_price = "€20/month"
#let billing_period = "monthly" // or "annual"

// Document metadata
#let effective_date = "January 1, 2026"
#let last_updated = "January 1, 2026"
#let version = "1.0"
#let approved_by = "Leopold Jofer"
#let next_review = "January 1, 2027"

#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
)

#set text(
  font: "Atkinson Hyperlegible Next",
  size: 11pt,
  lang: "en",
)

#set par(justify: true)

#set heading(numbering: "1.1")

#align(center)[
  #text(size: 20pt, weight: "bold")[Terms of Service]
  
  #v(0.5em)
  
  #text(size: 12pt)[
    *Effective Date:* #effective_date \
    *Last Updated:* #last_updated
  ]
]

#v(1em)

= Acceptance of Terms

By accessing or using #company_name's invoice and payment management service (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

These Terms constitute a legally binding agreement between you ("User," "you," or "your") and #company_name ("we," "us," or "our"), a company registered in Germany.

= Description of Service

The Service is a web-based application that enables users to:
- Manage customer information and contact details
- Create, store, and organize invoices
- Record and track incoming payments
- Match payments to corresponding invoices automatically using AI-powered features
- Generate reports and analytics related to invoicing and payments

The Service is provided on a software-as-a-service (SaaS) basis and is accessible via web browsers and supported devices.

= Eligibility

To use the Service, you must:
- Be at least 18 years of age
- Have the legal capacity to enter into binding contracts
- Provide accurate and complete registration information
- Not be prohibited from using the Service under applicable laws

If you are using the Service on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.

= Account Registration and Security

== Account Creation

To use the Service, you must create an account by providing:
- Valid email address
- Secure password
- Business or personal information as required

You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.

== Account Security

You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Immediately notifying us of any unauthorized access or security breach

We are not liable for any loss or damage arising from your failure to maintain account security.

== Account Termination

You may terminate your account at any time through the Service settings or by contacting us. We may suspend or terminate your account if:
- You violate these Terms
- We are required to do so by law
- We discontinue the Service (with reasonable notice)

Upon termination, your right to use the Service ceases immediately. Data retention after termination follows our Data Retention Policy and applicable legal requirements.

= User Obligations

You agree to:
- Use the Service only for lawful purposes and in accordance with these Terms
- Not use the Service to store or transmit illegal, harmful, or offensive content
- Not interfere with or disrupt the Service or servers/networks connected to the Service
- Not attempt to gain unauthorized access to any portion of the Service
- Not use automated means (bots, scrapers) to access the Service without our permission
- Comply with all applicable German and EU laws, including tax and accounting regulations
- Ensure that all customer data you input complies with GDPR and data protection laws
- Not resell, sublicense, or make the Service available to third parties without authorization

= Intellectual Property Rights

== Our Intellectual Property

The Service, including its design, features, functionality, and content, is owned by #company_name and is protected by German, EU, and international copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for its intended purposes during the term of your subscription.

== Your Content

You retain all ownership rights to the data and content you submit to the Service ("User Content"). By using the Service, you grant us a limited license to:
- Store, process, and display your User Content as necessary to provide the Service
- Use your User Content to improve AI models and features (anonymized and aggregated only)
- Back up your User Content for disaster recovery purposes

You represent and warrant that you have all necessary rights to your User Content and that it does not violate any third-party rights or applicable laws.

= AI-Powered Features

The Service uses artificial intelligence (Claude API by Anthropic) to provide intelligent invoice matching and data extraction features. You acknowledge that:

- AI suggestions are assistive only and may contain errors
- You are responsible for reviewing and confirming all AI-generated matches and data extractions
- We are not liable for decisions made based on AI suggestions
- Personal data processing through AI features is covered by our Privacy Policy
- AI features may be updated or changed without notice to improve performance

= Fees and Payment

== Subscription Fees

The Service is offered on a subscription basis with the following plans:
- #plan_1_name: #plan_1_price
- #plan_2_name: #plan_2_price

All fees are stated exclusive of VAT (Umsatzsteuer) and other applicable taxes, which will be added as required by German law.

== Payment Terms

- Fees are payable in advance on a #billing_period basis
- Payment is processed through our designated payment provider
- You authorize us to charge your designated payment method automatically
- All fees are non-refundable except as required by law or stated in these Terms

== Fee Changes

We may change our fees upon 30 days' notice. Continued use of the Service after the notice period constitutes acceptance of the new fees. You may cancel your subscription before the new fees take effect.

== Late Payment

If payment fails, we may:
- Suspend access to your account after 7 days
- Terminate your account after 30 days
- Charge interest on overdue amounts at the statutory rate under German law

= Data Protection and Privacy

Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our collection, use, and disclosure of your data as described in the Privacy Policy.

Key points:
- We process data in accordance with GDPR and BDSG
- Invoice and payment data must be retained for 10 years under German law (§ 147 AO, § 257 HGB)
- You have rights to access, rectify, erase (subject to legal retention), and port your data
- We use third-party processors (Vercel, Convex, Anthropic) with appropriate safeguards

= Service Level and Availability

== No Guarantee of Availability

While we strive to provide reliable service, we do not guarantee that:
- The Service will be uninterrupted, timely, secure, or error-free
- Defects will be corrected immediately
- The Service will meet your specific requirements

== Maintenance and Updates

We may:
- Perform scheduled maintenance with advance notice when possible
- Make emergency updates or repairs without notice
- Modify or discontinue features with reasonable notice

== Data Backup

While we maintain regular backups, you are responsible for maintaining your own backup copies of critical data. We recommend exporting important data regularly.

= Limitation of Liability

To the maximum extent permitted by German law:

== Limitation of Damages

We shall not be liable for:
- Indirect, incidental, special, consequential, or punitive damages
- Loss of profits, revenue, data, or business opportunities
- Damages arising from your use or inability to use the Service
- Damages exceeding the fees paid by you in the 12 months preceding the claim

== Mandatory Liability

Nothing in these Terms excludes or limits our liability for:
- Death or personal injury caused by our negligence
- Fraud or fraudulent misrepresentation
- Intentional misconduct or gross negligence (Vorsatz oder grobe Fahrlässigkeit)
- Any liability that cannot be excluded under German law

= Indemnification

You agree to indemnify, defend, and hold harmless #company_name, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
- Your use of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Your User Content

= Warranties and Disclaimers

== Your Warranties

You warrant that:
- You have the legal right to use the Service
- Your User Content does not violate any laws or third-party rights
- The information you provide is accurate and complete

== Our Disclaimers

The Service is provided "as is" and "as available" without warranties of any kind, except as required by mandatory German consumer protection law. We disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement.

= Third-Party Services and Links

The Service may contain links to third-party websites or integrate with third-party services. We are not responsible for:
- The content, privacy practices, or terms of third-party services
- Any damages arising from your use of third-party services
- The availability or performance of third-party services

Your use of third-party services is subject to their respective terms and policies.

= Modifications to Terms

We may modify these Terms at any time. We will notify you of material changes by:
- Email to your registered address
- Prominent notice within the Service
- Updating the "Last Updated" date

Continued use of the Service after changes take effect constitutes acceptance. If you do not agree to the modified Terms, you must stop using the Service and may cancel your account.

= Modifications to Service

We reserve the right to:
- Modify, suspend, or discontinue any aspect of the Service
- Change features, functionality, or capacity limits
- Update our technology infrastructure and service providers

We will provide reasonable notice of material changes that adversely affect your use of the Service. Significant changes that reduce core functionality will entitle you to cancel your subscription with a pro-rata refund.

= Governing Law and Jurisdiction

== Applicable Law

These Terms are governed by the laws of the Federal Republic of Germany, without regard to conflict of law principles. The UN Convention on Contracts for the International Sale of Goods (CISG) does not apply.

== Jurisdiction

For disputes with commercial users (merchants, B2B):
- Exclusive jurisdiction is with the courts of #jurisdiction_city, Germany

For disputes with consumers (B2C):
- Disputes may be brought in the courts of your place of residence or our place of business
- Mandatory consumer protection laws of your country of residence apply where more favorable

= Dispute Resolution

== Negotiation

Before initiating formal proceedings, parties agree to attempt to resolve disputes through good-faith negotiation for at least 30 days.

== Consumer Dispute Resolution

We participate in dispute resolution procedures before a consumer arbitration board. You may contact:

Allgemeine Verbraucherschlichtungsstelle des Zentrums für Schlichtung e.V.\
Straßburger Straße 8\
77694 Kehl, Germany\
Website: www.verbraucher-schlichter.de

Participation in dispute resolution is voluntary and does not affect your right to pursue legal remedies.

= Severability

If any provision of these Terms is found to be invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.

= Entire Agreement

These Terms, together with our Privacy Policy and Data Retention Policy, constitute the entire agreement between you and #company_name regarding the Service and supersede all prior agreements and understandings.

= Assignment

You may not assign or transfer these Terms or your account without our written consent. We may assign these Terms to any affiliate or successor entity, particularly in the event of a merger, acquisition, or sale of assets.

= Waiver

Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision. No waiver shall be effective unless in writing.

= Language

These Terms are provided in English. If translated into other languages, the English version shall prevail in case of conflict, except where prohibited by applicable consumer protection law.

= Notices

All notices to us must be sent to:

#company_name\
#company_address\
#company_city\
Germany\
Email: #company_email

Notices to you will be sent to the email address associated with your account.

= Special Provisions for German Users

== Widerrufsrecht (Right of Withdrawal - for Consumers)

If you are a consumer (Verbraucher) in Germany, you have the right to withdraw from this contract within 14 days without giving any reason, in accordance with § 312g BGB.

The withdrawal period expires after 14 days from the day of contract conclusion. To exercise your right of withdrawal, you must inform us of your decision to withdraw by an unequivocal statement (e.g., email).

If you withdraw, we shall reimburse payments received from you within 14 days using the same payment method, unless otherwise agreed.

You expressly agree that we begin performance of services during the withdrawal period. If you exercise your withdrawal right after using the Service, you must pay for the value of services provided up to that point.

== Gewährleistung (Warranty - for Consumers)

Consumers have statutory warranty rights (gesetzliche Gewährleistungsrechte) under §§ 434 ff. BGB. Our liability limitations do not affect these mandatory statutory rights.

= Contact Information

For questions about these Terms:

#company_name\
#company_address\
#company_city\
Germany

Email: #company_email\
Phone: #company_phone
#if company_register != "" [\
Commercial Register: #company_register]
#if company_vat != "" [\
VAT ID: #company_vat]

#v(2em)

#line(length: 100%)

#v(0.5em)

*Document Version:* #version\
*Approved by:* #approved_by\
*Next Review Date:* #next_review

#v(1em)

#align(center)[
  #text(size: 9pt, style: "italic")[
    By using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
  ]
]
