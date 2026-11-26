type ProductUpdate = {
    date: string;
    title: string;
    description: string;
    image?: { src: string; alt: string; anatomy?: boolean };
};

export const roadmap: ProductUpdate[] = [
    {
        date: '2027-03-15',
        title: 'Female exercise illustrations',
        description: 'Expand the exercise library with female illustrations, names, and movement descriptions.',
    },
    {
        date: '2027-06-15',
        title: 'Exercise videos',
        description: 'Explore video guidance for exercises in the catalog.',
    },
    {
        date: '2027-10-15',
        title: 'Body composition estimates',
        description: 'Evaluate published formulas for estimating body fat and lean or muscle mass from measurements.',
    },
    {
        date: '2028-05-15',
        title: 'Body shape and somatotype research',
        description: 'Explore whether body measurements could be used to suggest a body shape or somatotype illustration.',
    },
];

export const releasedUpdates: readonly [ProductUpdate, ...ProductUpdate[]] = [
    {
        date: '2026-11-12',
        title: 'The equipment catalog reached 100 entries',
        description: 'With 100 equipment entries, you can build more useful gear filters and show users which machines and tools they’ll find in a workout.',
        image: { src: '/img/marketing/air-bike-equipment.webp', alt: 'An air bike from the equipment catalog' },
    },
    {
        date: '2026-10-27',
        title: 'More ways to download images',
        description: 'Download images in WebP, PNG, AVIF, JPG, or HEIC. Muscle artwork is also available as SVG, so anatomy graphics can stay sharp at different sizes.',
    },
    {
        date: '2026-10-12',
        title: '482 exercises in the library',
        description: 'The expanded catalog gives you more movements to work with when building search, workout plans, or exercise substitutions.',
        image: { src: '/img/marketing/dumbbell-bench-press.webp', alt: 'An anatomical illustration of a dumbbell bench press' },
    },
    {
        date: '2026-09-28',
        title: 'More detail for 150 exercises',
        description: 'We expanded the reference metadata on 150 exercise records.',
    },
    {
        date: '2026-09-17',
        title: 'Clearer exercise images and refined anatomy',
        description: 'We improved image quality and corrected anatomical layouts in selected illustrations, making it easier to see how the body is positioned during a movement.',
    },
    {
        date: '2026-09-04',
        title: 'Muscle artwork and anatomy base layers',
        description: 'We added muscle graphics and their base layers so apps can show individual muscle groups in the context of the full body.',
        image: { src: '/img/marketing/full-body-substrate.svg', alt: 'Full-body anatomy base layer', anatomy: true },
    },
    {
        date: '2026-08-21',
        title: 'Images for 200 exercises and 10 pieces of equipment',
        description: 'Our image library reached 200 exercises and 10 equipment entries, giving developers a visual starting point for workout screens and equipment guides.',
    },
];

export function formatUpdateDate(date: string, short = false) {
    return new Intl.DateTimeFormat('en-US', {
        month: short ? 'short' : 'long',
        day: 'numeric',
        year: short ? undefined : 'numeric',
        timeZone: 'UTC',
    }).format(new Date(date));
}
