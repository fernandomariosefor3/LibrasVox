import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: object;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl,
  ogImage,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update description
    updateMeta('description', description);

    // Update keywords
    if (keywords) {
      updateMeta('keywords', keywords);
    }

    // Update canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Update robots
    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMeta('og:title', ogTitle || title, true);
    updateMeta('og:description', ogDescription || description, true);
    updateMeta('og:type', ogType, true);
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
    }
    const resolvedUrl = canonical || ogUrl;
    if (resolvedUrl) {
      updateMeta('og:url', resolvedUrl, true);
    }

    // Twitter
    updateMeta('twitter:card', twitterCard);
    updateMeta('twitter:title', twitterTitle || ogTitle || title);
    updateMeta('twitter:description', twitterDescription || ogDescription || description);
    if (twitterImage || ogImage) {
      updateMeta('twitter:image', twitterImage || ogImage || '');
    }

    // Schema.org JSON-LD
    if (schema) {
      const existingScript = document.getElementById('schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.id = 'schema-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Only remove schema on unmount, keep other meta tags
      const existingScript = document.getElementById('schema-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogType, ogUrl, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage, schema, noindex]);

  return null;
}

export default SEOHead;