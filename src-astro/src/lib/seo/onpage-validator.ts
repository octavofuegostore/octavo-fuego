/** Results from an on-page SEO audit for a single page. */
export interface OnpageResult {
  url: string;
  locale: string;
  title: {
    value: string;
    length: number;
    pass: boolean;
    message?: string;
  };
  metaDescription: {
    value: string;
    length: number;
    pass: boolean;
    message?: string;
  };
  h1: {
    count: number;
    pass: boolean;
    message?: string;
  };
  schema: {
    types: string[];
    pass: boolean;
    issues: string[];
  };
  ogTags: {
    ogTitle: boolean;
    ogDescription: boolean;
    ogImage: boolean;
    pass: boolean;
    issues: string[];
  };
}

/** Input data for a page to be validated. */
export interface PageData {
  url: string;
  locale: string;
  title: string;
  metaDescription: string;
  h1Count: number;
  schemaTypes: string[];
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
}

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = 155;

/**
 * Validates on-page SEO elements for a single page:
 * title length, meta description length, H1 count, schema presence, and OG tags.
 *
 * Returns an `OnpageResult` with pass/fail flags and explanatory messages.
 */
export function validateOnpage(page: PageData): OnpageResult {
  const titleLen = page.title.length;
  const titlePass = titleLen >= TITLE_MIN && titleLen <= TITLE_MAX;
  const titleMessages: string[] = [];

  if (!page.title) {
    titleMessages.push('Missing title tag');
  } else {
    if (titleLen < TITLE_MIN) {
      titleMessages.push(`Title too short (${titleLen} chars). Minimum ${TITLE_MIN} chars recommended.`);
    }
    if (titleLen > TITLE_MAX) {
      titleMessages.push(`Title too long (${titleLen} chars). Maximum ${TITLE_MAX} chars recommended (may truncate in SERP).`);
    }
  }

  const metaLen = page.metaDescription.length;
  const metaPass = metaLen >= META_DESC_MIN && metaLen <= META_DESC_MAX;
  const metaMessages: string[] = [];

  if (!page.metaDescription) {
    metaMessages.push('Missing meta description');
  } else {
    if (metaLen < META_DESC_MIN) {
      metaMessages.push(`Meta description too short (${metaLen} chars). Minimum ${META_DESC_MIN} chars recommended.`);
    }
    if (metaLen > META_DESC_MAX) {
      metaMessages.push(`Meta description too long (${metaLen} chars). Maximum ${META_DESC_MAX} chars recommended (may truncate in SERP).`);
    }
  }

  const h1Pass = page.h1Count === 1;
  const h1Messages: string[] = [];

  if (page.h1Count === 0) {
    h1Messages.push('Missing H1 — each page must have exactly one H1.');
  } else if (page.h1Count > 1) {
    h1Messages.push(`Found ${page.h1Count} H1 tags — each page must have exactly one H1.`);
  }

  const schemaIssues: string[] = [];
  if (!page.schemaTypes || page.schemaTypes.length === 0) {
    schemaIssues.push('No schema.org types found on page.');
  }

  const ogIssues: string[] = [];
  if (!page.hasOgTitle) {
    ogIssues.push('Missing og:title meta tag.');
  }
  if (!page.hasOgDescription) {
    ogIssues.push('Missing og:description meta tag.');
  }
  if (!page.hasOgImage) {
    ogIssues.push('Missing og:image meta tag.');
  }

  return {
    url: page.url,
    locale: page.locale,
    title: {
      value: page.title,
      length: titleLen,
      pass: titlePass,
      message: titleMessages.length > 0 ? titleMessages.join(' ') : undefined,
    },
    metaDescription: {
      value: page.metaDescription,
      length: metaLen,
      pass: metaPass,
      message: metaMessages.length > 0 ? metaMessages.join(' ') : undefined,
    },
    h1: {
      count: page.h1Count,
      pass: h1Pass,
      message: h1Messages.length > 0 ? h1Messages.join(' ') : undefined,
    },
    schema: {
      types: page.schemaTypes ?? [],
      pass: schemaIssues.length === 0,
      issues: schemaIssues,
    },
    ogTags: {
      ogTitle: page.hasOgTitle,
      ogDescription: page.hasOgDescription,
      ogImage: page.hasOgImage,
      pass: ogIssues.length === 0,
      issues: ogIssues,
    },
  };
}
