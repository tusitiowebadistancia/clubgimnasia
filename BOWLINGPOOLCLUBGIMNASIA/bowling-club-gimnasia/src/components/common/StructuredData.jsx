import { Helmet } from "react-helmet-async";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Bowling Club Gimnasia",
    description:
      "Bowling Club Gimnasia en Necochea. Bowling, pool, eventos y promociones.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 67 3049",
      addressLocality: "Necochea",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: "Necochea",
    telephone: "+54 2262 58-9377",
    url: "https://tudominio.com",
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}