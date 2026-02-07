import Head from 'next/head';

interface EventSchemaProps {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    locationName: string;
    locationCity: string;
    locationCountry: string;
    image: string;
    currency: string;
    price: number;
}

export function EventSchema({ data }: { data: EventSchemaProps }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.title,
        "description": data.description,
        "startDate": data.startDate,
        "endDate": data.endDate,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": data.locationName,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": data.locationCity,
                "addressCountry": data.locationCountry
            }
        },
        "image": [data.image],
        "offers": {
            "@type": "Offer",
            "url": "https://bestdiplomats.org/summits",
            "price": data.price,
            "priceCurrency": data.currency,
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString()
        },
        "organizer": {
            "@type": "Organization",
            "name": "International Diplomacy & Leadership Conference",
            "url": "https://bestdiplomats.org"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
