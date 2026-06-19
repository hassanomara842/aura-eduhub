
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteTitle = 'Aura EduHub - دليلك للمنح الدراسية';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  const defaultDesc = 'Aura EduHub هو دليلك الشامل للبحث عن المنح الدراسية والفرص التعليمية في جميع أنحاء العالم.';
  const metaDesc = description || defaultDesc;
  
  const siteUrl = 'https://aura-eduhub.me';
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  const metaImage = image || `${siteUrl}/assets/logo-CiDzFQIp.png`; // Default logo

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      {image && <meta property="og:image" content={metaImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {image && <meta name="twitter:image" content={metaImage} />}
    </Helmet>
  );
}
