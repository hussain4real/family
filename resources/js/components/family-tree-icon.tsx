import { SVGAttributes } from 'react';

export default function FamilyTreeIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            {/* Family tree trunk */}
            <rect x="22" y="20" width="4" height="20" fill="currentColor" fillOpacity="0.7" rx="2" />

            {/* Tree branches */}
            <path
                d="M24 20v-8M16 16l8-4M32 16l-8-4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Family members as leaves/circles */}
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="24" cy="8" r="3" fill="currentColor" />
            <circle cx="36" cy="12" r="3" fill="currentColor" />

            {/* Additional family members */}
            <circle cx="8" cy="18" r="2" fill="currentColor" fillOpacity="0.8" />
            <circle cx="40" cy="18" r="2" fill="currentColor" fillOpacity="0.8" />

            {/* Roots */}
            <path
                d="M20 40l-4 4M28 40l4 4M24 40v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Decorative flourishes */}
            <path
                d="M6 24c2-1 4 1 6 0M42 24c-2-1-4 1-6 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}
