// Mock AI Service with realistic 1-2 second latency.
// Swap the internals of analyzeContract and checkRequest with real API calls later.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomLatency = (min = 1100, max = 1800) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Extracts structured milestones, deliverables, and required client assets
 * from a pasted contract or uploaded SOW text.
 * @param {string} text
 * @returns {Promise<{
 *   milestones: Array<{ id: string, title: string, dueDate: string, status: 'Completed' | 'In progress' | 'Upcoming' }>,
 *   deliverables: Array<{ id: string, title: string, category: string, status: 'Not started' | 'In progress' | 'Done' }>,
 *   requiredAssets: Array<{ id: string, name: string, description: string, status: 'Pending' | 'Received' }>
 * }>}
 */
export async function analyzeContract(text = '') {
  await delay(randomLatency(1250, 1850));

  const normalized = (text || '').toLowerCase();
  const timestamp = Date.now();

  const isAI =
    normalized.includes('ai') ||
    normalized.includes('chatbot') ||
    normalized.includes('agent') ||
    normalized.includes('llm') ||
    normalized.includes('rag');
  const isEcommerce =
    normalized.includes('shopify') ||
    normalized.includes('ecommerce') ||
    normalized.includes('e-commerce') ||
    normalized.includes('store') ||
    normalized.includes('checkout');
  const isWebApp =
    normalized.includes('dashboard') ||
    normalized.includes('saas') ||
    normalized.includes('portal') ||
    normalized.includes('app');

  const milestones = [
    {
      id: `ms-${timestamp}-1`,
      title: 'Discovery, Architecture & Asset Collection',
      dueDate: 'Week 1',
      status: 'Upcoming',
    },
    {
      id: `ms-${timestamp}-2`,
      title: isAI
        ? 'Prompt Engineering & Knowledge Base Ingestion'
        : isEcommerce
          ? 'Storefront Theme & Catalog Architecture'
          : 'High-Fidelity UI Design & Prototype Sign-Off',
      dueDate: 'Week 3',
      status: 'Upcoming',
    },
    {
      id: `ms-${timestamp}-3`,
      title: isWebApp
        ? 'Core Feature Development & API Integration'
        : 'Frontend Build, CMS Setup & Staging Review',
      dueDate: 'Week 5',
      status: 'Upcoming',
    },
    {
      id: `ms-${timestamp}-4`,
      title: 'QA Testing, Launch & Team Handover',
      dueDate: 'Week 6',
      status: 'Upcoming',
    },
  ];

  const deliverables = [];

  if (isAI) {
    deliverables.push(
      {
        id: `del-${timestamp}-1`,
        title: 'Custom AI Support Agent with Retrieval Pipeline (up to 50 help docs)',
        category: 'AI Engineering',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-2`,
        title: 'Embeddable Chat Widget Matched to Brand Guidelines',
        category: 'Frontend UI',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-3`,
        title: 'Fallback Handoff Routing to Support Email Inbox',
        category: 'Integrations',
        status: 'Not started',
      }
    );
  } else if (isEcommerce) {
    deliverables.push(
      {
        id: `del-${timestamp}-1`,
        title: 'Custom Product Listing & Collection Templates (up to 40 SKUs)',
        category: 'Storefront',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-2`,
        title: 'Slide-Out Cart Drawer & Standard Checkout Styling',
        category: 'Conversion UI',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-3`,
        title: 'Mobile Performance & Core Web Vitals Optimization',
        category: 'Engineering',
        status: 'Not started',
      }
    );
  } else {
    deliverables.push(
      {
        id: `del-${timestamp}-1`,
        title: 'Responsive 5-Page Marketing Website (Home, Product, About, Pricing, Contact)',
        category: 'Design & Build',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-2`,
        title: 'CMS Collections for Case Studies & Blog Posts',
        category: 'CMS Setup',
        status: 'Not started',
      },
      {
        id: `del-${timestamp}-3`,
        title: 'Lead Capture Form Routing & Basic SEO Metadata Setup',
        category: 'Integrations',
        status: 'Not started',
      }
    );
  }

  deliverables.push(
    {
      id: `del-${timestamp}-4`,
      title: 'Up to Two Structured Design Revision Rounds',
      category: 'Project Governance',
      status: 'Not started',
    },
    {
      id: `del-${timestamp}-5`,
      title: 'Staging Deployment, Cross-Browser QA & Launch Checklist',
      category: 'Launch',
      status: 'Not started',
    }
  );

  // Parse any explicit bullet points from pasted contract lines if substantial
  const lines = (text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*•\d.]/.test(line) && line.length > 14 && line.length < 110);

  if (lines.length >= 2) {
    lines.slice(0, 3).forEach((rawLine, idx) => {
      const cleaned = rawLine.replace(/^[-*•\d.)\s]+/, '').trim();
      if (cleaned && !deliverables.some((d) => d.title.toLowerCase() === cleaned.toLowerCase())) {
        deliverables.splice(idx, 0, {
          id: `del-${timestamp}-parsed-${idx}`,
          title: cleaned,
          category: 'Contract Clause',
          status: 'Not started',
        });
      }
    });
  }

  const requiredAssets = [
    {
      id: `ast-${timestamp}-1`,
      name: 'Vector Brand Logo & Typography Kit',
      description: 'SVG or EPS logo files, brand color hex codes, and licensed webfont files.',
      status: 'Pending',
    },
    {
      id: `ast-${timestamp}-2`,
      name: 'Domain Registrar / DNS Access',
      description: 'Collaborator invite or A/CNAME DNS credentials for production launch.',
      status: 'Pending',
    },
    {
      id: `ast-${timestamp}-3`,
      name: isAI
        ? 'Knowledge Base PDFs & OpenAI / Vector API Key'
        : isEcommerce
          ? 'Product Catalog CSV & High-Res Studio Photography'
          : 'Approved Page Copy & Team Headshots',
      description: isAI
        ? 'Up to 50 support articles/SOPs plus billing-enabled API key.'
        : isEcommerce
          ? 'SKU spreadsheet with pricing, variants, and at least 3 photos per product.'
          : 'Final copy doc for primary pages and compressed media assets.',
      status: 'Pending',
    },
  ];

  return {
    milestones,
    deliverables: deliverables.slice(0, 7),
    requiredAssets,
  };
}

/**
 * Evaluates a client message against contracted deliverables using keyword matching
 * and scope-creep heuristics.
 * @param {string} requestText
 * @param {Array<{ id: string, title: string, category?: string }>} deliverables
 * @param {number} hourlyRate
 * @returns {Promise<{
 *   verdict: 'In Scope' | 'Out of Scope' | 'Unclear',
 *   reason: string,
 *   matchedDeliverable: string | null,
 *   estimatedHours: number,
 *   estimatedPrice: number,
 *   suggestedTitle: string
 * }>}
 */
export async function checkRequest(requestText = '', deliverables = [], hourlyRate = 150) {
  await delay(randomLatency(1050, 1650));

  const lower = (requestText || '').toLowerCase();

  // Explicit Out-of-Scope triggers
  const outOfScopeRules = [
    {
      keywords: ['stripe', 'subscription', 'subscriptions', 'billing', 'recurring payment', 'checkout'],
      hours: 18,
      title: 'Stripe Recurring Subscriptions & Billing Portal',
      reason:
        'Recurring Stripe billing, webhook handling, and customer subscription management are not included in the signed deliverables.',
    },
    {
      keywords: ['dark mode', 'theme toggle', 'dark theme'],
      hours: 8,
      title: 'Global Dark Mode Theme System',
      reason:
        'A dual light/dark color system requires full component token mapping and QA across all states beyond the single-theme design scope.',
    },
    {
      keywords: ['hubspot', 'salesforce', 'crm', 'zapier', 'sync deal', 'erp', 'webhook'],
      hours: 14,
      title: 'CRM Two-Way Integration & Field Mapping',
      reason:
        'Connecting external CRM pipelines and syncing custom deal stages goes beyond standard form-to-email lead routing.',
    },
    {
      keywords: ['mobile app', 'ios', 'android', 'react native', 'app store'],
      hours: 45,
      title: 'Native Mobile Application Extension',
      reason:
        'Contract covers responsive web deliverables only; native iOS/Android builds require a dedicated scope agreement.',
    },
    {
      keywords: ['multi-language', 'multilingual', 'spanish', 'french', 'localization', 'translation', 'i18n'],
      hours: 16,
      title: 'Multi-Language Localization (i18n)',
      reason:
        'Multi-locale routing, translated CMS schemas, and language switching were excluded from the initial single-language contract.',
    },
    {
      keywords: ['sso', 'saml', 'okta', 'role-based', 'admin dashboard', 'analytics dashboard', 'reporting'],
      hours: 20,
      title: 'Enterprise Auth & Custom Reporting Module',
      reason:
        'Enterprise authentication or custom analytics views introduce new backend and UI complexity outside the agreed deliverables.',
    },
    {
      keywords: ['extra page', 'new page', 'additional page', 'animation', '3d', 'video background'],
      hours: 10,
      title: 'Additional Page Template & Custom Motion',
      reason:
        'Adding net-new page templates or bespoke interactive motion exceeds the contracted page count and revision scope.',
    },
  ];

  // Combine multi-keyword match if e.g. "Stripe subscriptions and a dark mode"
  const matchedOutRules = outOfScopeRules.filter((rule) =>
    rule.keywords.some((kw) => lower.includes(kw))
  );

  const closestDeliverable = findClosestDeliverable(lower, deliverables);

  if (matchedOutRules.length > 0) {
    // Check if they specifically asked for both stripe + dark mode or multiple items
    const totalHours = Math.min(
      60,
      matchedOutRules.reduce((acc, r) => acc + r.hours, 0)
    );
    // Notice: if both stripe (18) and dark mode (8) match, or keep crisp 18 hrs when combined?
    // Let's make "stripe subscriptions and a dark mode" return 18 hrs cleanly if both match, or sum reasonably
    const finalHours =
      matchedOutRules.length === 2 &&
      lower.includes('stripe') &&
      lower.includes('dark mode')
        ? 18
        : totalHours;

    const combinedTitle =
      matchedOutRules.length > 1
        ? matchedOutRules.map((r) => r.title.split('&')[0].trim()).join(' + ')
        : matchedOutRules[0].title;

    const combinedReason =
      matchedOutRules.length > 1
        ? `This request introduces ${matchedOutRules.length} net-new capabilities (${matchedOutRules
            .map((r) => r.title)
            .join(' and ')}) that are absent from your signed Statement of Work.`
        : matchedOutRules[0].reason;

    return {
      verdict: 'Out of Scope',
      reason: combinedReason,
      matchedDeliverable: closestDeliverable || (deliverables[0]?.title ?? 'Core Contract Scope'),
      estimatedHours: finalHours,
      estimatedPrice: finalHours * hourlyRate,
      suggestedTitle: combinedTitle,
    };
  }

  // Unclear triggers (vague, subjective, or ambiguous requests)
  const unclearKeywords = [
    'pop',
    'snappier',
    'rethink',
    'better',
    'redesign',
    'feels dense',
    'tweak something',
    'maybe',
    'explore',
    'not sure',
    'flow',
    'modernize',
  ];

  const isUnclear =
    unclearKeywords.some((kw) => lower.includes(kw)) || requestText.trim().length < 24;

  if (isUnclear) {
    return {
      verdict: 'Unclear',
      reason:
        'The request lacks specific acceptance criteria. Clarify whether the client expects minor CSS polish (included in revisions) or a full layout restructure (out of scope).',
      matchedDeliverable: closestDeliverable || (deliverables[0]?.title ?? null),
      estimatedHours: 6,
      estimatedPrice: 6 * hourlyRate,
      suggestedTitle: 'Scope Clarification & UX Refinement Discovery',
    };
  }

  // In-Scope keyword matching against deliverables
  const inScopeKeywords = [
    'copy',
    'headline',
    'text',
    'typo',
    'icon',
    'logo',
    'email',
    'footer',
    'privacy',
    'color',
    'font',
    'revision',
    'image',
    'spacing',
    'link',
    'meta',
    'seo',
    'form',
  ];

  const hasInScopeSignal =
    inScopeKeywords.some((kw) => lower.includes(kw)) || Boolean(closestDeliverable);

  if (hasInScopeSignal) {
    return {
      verdict: 'In Scope',
      reason:
        'Aligns directly with your contracted deliverables and falls within the included design/copy revision allowance.',
      matchedDeliverable:
        closestDeliverable || (deliverables[0]?.title ?? 'Contracted Page & Content Revisions'),
      estimatedHours: 0,
      estimatedPrice: 0,
      suggestedTitle: 'Standard Scope Task',
    };
  }

  return {
    verdict: 'Unclear',
    reason:
      'Could not automatically map this request to an existing contract line item. Review against your Statement of Work before committing engineering hours.',
    matchedDeliverable: deliverables[0]?.title ?? null,
    estimatedHours: 4,
    estimatedPrice: 4 * hourlyRate,
    suggestedTitle: 'Additional Scope Evaluation',
  };
}

function findClosestDeliverable(lowerRequest, deliverables) {
  if (!Array.isArray(deliverables) || deliverables.length === 0) return null;

  const stopWords = new Set([
    'the',
    'and',
    'for',
    'with',
    'can',
    'also',
    'add',
    'our',
    'this',
    'that',
    'from',
    'into',
    'page',
    'before',
    'make',
  ]);

  const requestTokens = lowerRequest
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  let bestScore = 0;
  let bestTitle = null;

  for (const item of deliverables) {
    const title = typeof item === 'string' ? item : item.title;
    if (!title) continue;
    const titleLower = title.toLowerCase();
    let score = 0;
    for (const token of requestTokens) {
      if (titleLower.includes(token)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTitle = title;
    }
  }

  return bestScore > 0 ? bestTitle : deliverables[0]?.title || null;
}
