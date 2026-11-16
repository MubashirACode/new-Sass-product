import { AgencySettings, Project } from '../types';

export const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  agencyName: 'Northbridge Digital',
  logoUrl: '',
  logoPresetId: 'indigo-knot',
  brandColor: '#4F46E5',
  hourlyRate: 150,
  paymentLink: 'https://buy.stripe.com/demo-northbridge-co',
  notificationEmail: 'alex@northbridgedigital.co',
};

export const SAMPLE_CONTRACT_TEXT = `STATEMENT OF WORK — AI CUSTOMER ONBOARDING PORTAL & MARKETING SITE
Client: Horizon BioLabs
Agency: Northbridge Digital
Fee: $12,000 Fixed Scope

1. Scope of Deliverables:
- Responsive 5-page marketing website (Home, Platform, Case Studies, About, Contact)
- Custom client onboarding intake form with email routing to ops@horizonbiolabs.com
- CMS collections for Research Notes & Press Releases
- Two rounds of structured design revisions prior to staging sign-off
- Production DNS cutover, SSL verification, and Core Web Vitals optimization

2. Exclusions:
- Recurring Stripe billing, patient portals, multi-language localization, or native iOS/Android applications require a separate Change Order.

3. Client Responsibilities:
- Supply vector brand logo, approved copy deck, and domain registrar invite within 5 business days.`;

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'veloce-ai-support',
    name: 'Veloce AI Support Agent & Web Hub',
    clientName: 'Meridian Logistics',
    clientEmail: 'elena@meridianlogistics.io',
    status: 'At Risk',
    contractValue: 14500,
    createdAt: '2026-10-18',
    contractSummary:
      'Custom RAG support chatbot trained on 50 SOP documents, responsive SaaS marketing hub, and standard email ticket fallback. Excludes CRM sync, recurring Stripe subscriptions, and multi-theme dark mode.',
    milestones: [
      {
        id: 'ms-v1',
        title: 'Discovery & Knowledge Base Ingestion',
        dueDate: 'Oct 28',
        status: 'Completed',
      },
      {
        id: 'ms-v2',
        title: 'AI Agent Prompt Tuning & Widget UI',
        dueDate: 'Nov 08',
        status: 'Completed',
      },
      {
        id: 'ms-v3',
        title: 'Marketing Hub Build & Staging QA',
        dueDate: 'Nov 22',
        status: 'In progress',
      },
      {
        id: 'ms-v4',
        title: 'Production Launch & Team Training',
        dueDate: 'Nov 30',
        status: 'Upcoming',
      },
    ],
    deliverables: [
      {
        id: 'del-v1',
        title: 'RAG Support Assistant trained on 50 Shipping SOPs',
        category: 'AI Engineering',
        status: 'Done',
      },
      {
        id: 'del-v2',
        title: 'Responsive Marketing Landing Page & Copy Integration',
        category: 'Frontend UI',
        status: 'Done',
      },
      {
        id: 'del-v3',
        title: 'Embeddable Light-Theme Chat Widget',
        category: 'Frontend UI',
        status: 'In progress',
      },
      {
        id: 'del-v4',
        title: 'Support Escalation Email Routing',
        category: 'Integrations',
        status: 'Done',
      },
      {
        id: 'del-v5',
        title: 'Staging Deployment & Cross-Browser QA',
        category: 'Launch',
        status: 'Not started',
      },
    ],
    assets: [
      {
        id: 'ast-v1',
        name: 'Brand Guidelines & SVG Logo',
        description: 'Primary vector logo and brand palette hex codes.',
        status: 'Received',
        fileName: 'meridian-brand-kit-v2.zip',
        uploadedAt: 'Oct 20, 2026',
      },
      {
        id: 'ast-v2',
        name: 'Shipping SOP Knowledge Base PDFs',
        description: 'Up to 50 support manuals for AI retrieval indexing.',
        status: 'Received',
        fileName: 'meridian-sop-bundle.pdf',
        uploadedAt: 'Oct 22, 2026',
      },
      {
        id: 'ast-v3',
        name: 'Cloudflare DNS Collaborator Access',
        description: 'Required to point support.meridianlogistics.io to production.',
        status: 'Pending',
      },
    ],
    requests: [
      {
        id: 'req-v1',
        projectId: 'veloce-ai-support',
        senderName: 'Elena Vance',
        senderEmail: 'elena@meridianlogistics.io',
        message: 'Can we also add Stripe subscriptions and a dark mode?',
        createdAt: '2 hours ago',
        verdict: 'Out of Scope',
        reason:
          'Recurring Stripe billing webhooks and a full dual-theme dark mode token system are not included in your signed Statement of Work.',
        matchedDeliverable: 'Embeddable Light-Theme Chat Widget',
        estimatedHours: 18,
        estimatedPrice: 2700,
        actionStatus: 'Pending Review',
      },
      {
        id: 'req-v2',
        projectId: 'veloce-ai-support',
        senderName: 'Elena Vance',
        senderEmail: 'elena@meridianlogistics.io',
        message:
          'Hey team, can we update the hero headline copy and swap the 3 feature icons on the landing page before Friday?',
        createdAt: 'Yesterday',
        verdict: 'In Scope',
        reason:
          'Text updates and icon swaps on the marketing landing page fall directly under your contracted copy integration & revision round.',
        matchedDeliverable: 'Responsive Marketing Landing Page & Copy Integration',
        estimatedHours: 0,
        estimatedPrice: 0,
        actionStatus: 'Pending Review',
      },
      {
        id: 'req-v3',
        projectId: 'veloce-ai-support',
        senderName: 'Elena Vance',
        senderEmail: 'elena@meridianlogistics.io',
        message:
          'The onboarding screen feels a bit dense — can we rethink the layout and make the flow feel snappier?',
        createdAt: '3 days ago',
        verdict: 'Unclear',
        reason:
          'Request lacks concrete scope boundaries. Clarify whether this means minor spacing/copy polish (included) or a structural UI redesign (change order).',
        matchedDeliverable: 'Embeddable Light-Theme Chat Widget',
        estimatedHours: 6,
        estimatedPrice: 900,
        actionStatus: 'Pending Review',
      },
    ],
    changeOrders: [
      {
        id: 'co-v1',
        projectId: 'veloce-ai-support',
        title: 'Custom Shipping Rate Calculator Widget',
        description:
          'Interactive freight weight & zone estimator embedded on the pricing page with live rate table lookups.',
        hours: 10,
        price: 1500,
        paymentLink: 'https://buy.stripe.com/demo-northbridge-co',
        status: 'Paid',
        createdAt: 'Nov 02, 2026',
        paidAt: 'Nov 03, 2026',
      },
    ],
  },
  {
    id: 'lumina-saas-redesign',
    name: 'Lumina SaaS Marketing Redesign',
    clientName: 'Lumina Health',
    clientEmail: 'marcus@luminahealth.co',
    status: 'In Progress',
    contractValue: 9800,
    createdAt: '2026-10-25',
    contractSummary:
      '6-page Webflow/React marketing site with CMS blog, HIPAA compliance badges section, and HubSpot form embed. Excludes native patient portal or custom CRM deal automation.',
    milestones: [
      {
        id: 'ms-l1',
        title: 'Wireframes & Visual Direction',
        dueDate: 'Nov 01',
        status: 'Completed',
      },
      {
        id: 'ms-l2',
        title: 'Page Templates & CMS Build',
        dueDate: 'Nov 14',
        status: 'Completed',
      },
      {
        id: 'ms-l3',
        title: 'Content Population & QA',
        dueDate: 'Nov 24',
        status: 'In progress',
      },
    ],
    deliverables: [
      {
        id: 'del-l1',
        title: '6-Page Responsive Marketing Site',
        category: 'Design & Build',
        status: 'Done',
      },
      {
        id: 'del-l2',
        title: 'CMS Collections for Clinical Case Studies',
        category: 'CMS Setup',
        status: 'Done',
      },
      {
        id: 'del-l3',
        title: 'Standard Lead Form Routing to hello@luminahealth.co',
        category: 'Integrations',
        status: 'Done',
      },
      {
        id: 'del-l4',
        title: 'SEO Schema & Launch Redirect Map',
        category: 'Launch',
        status: 'In progress',
      },
    ],
    assets: [
      {
        id: 'ast-l1',
        name: 'Clinical Photography Pack',
        description: 'High-resolution approved clinic and team portraits.',
        status: 'Received',
        fileName: 'lumina-studio-photos.zip',
        uploadedAt: 'Oct 29, 2026',
      },
      {
        id: 'ast-l2',
        name: 'SOC2 & HIPAA Badge Copy',
        description: 'Legal-approved security wording for the trust section.',
        status: 'Received',
        fileName: 'lumina-security-copy.docx',
        uploadedAt: 'Nov 02, 2026',
      },
    ],
    requests: [
      {
        id: 'req-l1',
        projectId: 'lumina-saas-redesign',
        senderName: 'Marcus Chen',
        senderEmail: 'marcus@luminahealth.co',
        message:
          'Can we connect the AI intake quiz directly to our internal HubSpot CRM and sync custom deal stages automatically?',
        createdAt: '5 hours ago',
        verdict: 'Out of Scope',
        reason:
          'Bidirectional HubSpot CRM pipeline automation and custom deal stage mapping exceed standard email lead routing in your contract.',
        matchedDeliverable: 'Standard Lead Form Routing to hello@luminahealth.co',
        estimatedHours: 14,
        estimatedPrice: 2100,
        actionStatus: 'Pending Review',
      },
      {
        id: 'req-l2',
        projectId: 'lumina-saas-redesign',
        senderName: 'Marcus Chen',
        senderEmail: 'marcus@luminahealth.co',
        message:
          'Please make sure the contact form routes leads to hello@luminahealth.co as discussed during kickoff.',
        createdAt: '4 days ago',
        verdict: 'In Scope',
        reason: 'Matches the contracted lead form routing deliverable.',
        matchedDeliverable: 'Standard Lead Form Routing to hello@luminahealth.co',
        estimatedHours: 0,
        estimatedPrice: 0,
        actionStatus: 'Added to Tasks',
      },
    ],
    changeOrders: [
      {
        id: 'co-l1',
        projectId: 'lumina-saas-redesign',
        title: 'Interactive ROI Calculator Page',
        description:
          'Custom clinic savings calculator with dynamic slider inputs and PDF summary export.',
        hours: 12,
        price: 1800,
        paymentLink: 'https://buy.stripe.com/demo-northbridge-co',
        status: 'Sent',
        createdAt: 'Nov 12, 2026',
      },
    ],
  },
  {
    id: 'northstar-b2b-portal',
    name: 'Northstar Investor Web Portal',
    clientName: 'Northstar Capital',
    clientEmail: 'priya@northstarcap.com',
    status: 'Onboarding',
    contractValue: 18000,
    createdAt: '2026-11-10',
    contractSummary:
      'LP document vault, quarterly fund performance overview, and single-language English UI. Multi-language localization and SSO require separate change orders.',
    milestones: [
      {
        id: 'ms-n1',
        title: 'Kickoff & Asset Onboarding',
        dueDate: 'Nov 18',
        status: 'In progress',
      },
      {
        id: 'ms-n2',
        title: 'Data Room UI & Permissions Model',
        dueDate: 'Dec 02',
        status: 'Upcoming',
      },
      {
        id: 'ms-n3',
        title: 'User Acceptance Testing & Launch',
        dueDate: 'Dec 18',
        status: 'Upcoming',
      },
    ],
    deliverables: [
      {
        id: 'del-n1',
        title: 'Quarterly Performance Summary Dashboard',
        category: 'Frontend UI',
        status: 'In progress',
      },
      {
        id: 'del-n2',
        title: 'LP Document Vault & Download Tracking',
        category: 'Core Features',
        status: 'Not started',
      },
      {
        id: 'del-n3',
        title: 'Email Notification Templates for Fund Reports',
        category: 'Integrations',
        status: 'Not started',
      },
      {
        id: 'del-n4',
        title: 'Footer Legal & Compliance Links Setup',
        category: 'Design & Build',
        status: 'Not started',
      },
    ],
    assets: [
      {
        id: 'ast-n1',
        name: 'Vector Logo & Fund Brand Book',
        description: 'SVG wordmark and approved typography guidelines.',
        status: 'Received',
        fileName: 'northstar-brand-guidelines.pdf',
        uploadedAt: 'Nov 12, 2026',
      },
      {
        id: 'ast-n2',
        name: 'Q3 LP Performance CSV',
        description: 'Sample anonymized quarterly metrics for UI layout.',
        status: 'Pending',
      },
      {
        id: 'ast-n3',
        name: 'Custom Subdomain DNS Record',
        description: 'CNAME pointing investors.northstarcap.com.',
        status: 'Pending',
      },
    ],
    requests: [
      {
        id: 'req-n1',
        projectId: 'northstar-b2b-portal',
        senderName: 'Priya Nair',
        senderEmail: 'priya@northstarcap.com',
        message:
          'Can we adjust the footer links to include our updated SOC2 privacy policy page before staging?',
        createdAt: '1 day ago',
        verdict: 'In Scope',
        reason: 'Updating footer compliance links is covered under the contracted footer & legal links deliverable.',
        matchedDeliverable: 'Footer Legal & Compliance Links Setup',
        estimatedHours: 0,
        estimatedPrice: 0,
        actionStatus: 'Pending Review',
      },
    ],
    changeOrders: [],
  },
  {
    id: 'kinetix-shopify-store',
    name: 'Kinetix Headless Shopify Store',
    clientName: 'Kinetix Gear',
    clientEmail: 'alex@kinetixgear.com',
    status: 'Completed',
    contractValue: 16200,
    createdAt: '2026-09-05',
    contractSummary:
      'Headless storefront for 35 athletic hardware SKUs, slide-out cart drawer, and English checkout. Multi-language storefront added via approved change order.',
    milestones: [
      {
        id: 'ms-k1',
        title: 'Catalog Architecture & Design',
        dueDate: 'Sep 18',
        status: 'Completed',
      },
      {
        id: 'ms-k2',
        title: 'Storefront Build & Cart Drawer',
        dueDate: 'Oct 04',
        status: 'Completed',
      },
      {
        id: 'ms-k3',
        title: 'QA & Production Cutover',
        dueDate: 'Oct 15',
        status: 'Completed',
      },
    ],
    deliverables: [
      {
        id: 'del-k1',
        title: 'Custom Product Detail & Collection Pages',
        category: 'Storefront',
        status: 'Done',
      },
      {
        id: 'del-k2',
        title: 'Slide-Out Cart Drawer & Upsell Module',
        category: 'Conversion UI',
        status: 'Done',
      },
      {
        id: 'del-k3',
        title: 'Mobile Speed & Core Web Vitals Tuning',
        category: 'Engineering',
        status: 'Done',
      },
    ],
    assets: [
      {
        id: 'ast-k1',
        name: 'Product Catalog & Studio Photos',
        description: '35 SKUs with transparent PNGs.',
        status: 'Received',
        fileName: 'kinetix-sku-assets.zip',
        uploadedAt: 'Sep 10, 2026',
      },
      {
        id: 'ast-k2',
        name: 'Shopify Storefront API Token',
        description: 'Read-only storefront token for headless checkout.',
        status: 'Received',
        fileName: 'shopify-token-notes.txt',
        uploadedAt: 'Sep 11, 2026',
      },
    ],
    requests: [
      {
        id: 'req-k1',
        projectId: 'kinetix-shopify-store',
        senderName: 'Alex Mercer',
        senderEmail: 'alex@kinetixgear.com',
        message:
          'We would love to add multi-language support (Spanish and French) to the storefront before Q4 launch.',
        createdAt: 'Oct 01, 2026',
        verdict: 'Out of Scope',
        reason:
          'Multi-locale routing and translated product templates were excluded from the single-language storefront SOW.',
        matchedDeliverable: 'Custom Product Detail & Collection Pages',
        estimatedHours: 16,
        estimatedPrice: 2400,
        actionStatus: 'Change Order Sent',
        changeOrderId: 'co-k1',
      },
    ],
    changeOrders: [
      {
        id: 'co-k1',
        projectId: 'kinetix-shopify-store',
        requestId: 'req-k1',
        title: 'Multi-Language Localization (ES + FR)',
        description:
          'Locale routing, language switcher in header, and translated product/cart templates for Spanish and French buyers.',
        hours: 16,
        price: 2400,
        paymentLink: 'https://buy.stripe.com/demo-northbridge-co',
        status: 'Paid',
        createdAt: 'Oct 02, 2026',
        paidAt: 'Oct 03, 2026',
      },
    ],
  },
];
