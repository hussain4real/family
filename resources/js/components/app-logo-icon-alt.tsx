import { SVGAttributes } from 'react';

export default function AppLogoIconAlt(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized "H" for Hussain with family tree concept */}
            <path
                d="M12 8v32M36 8v32M12 24h24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Tree branches representing family connections */}
            <path
                d="M24 14v-6M20 14l-4-4M28 14l4-4M24 34v6M20 34l-4 4M28 34l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Decorative circles representing family members */}
            <circle cx="16" cy="6" r="2" fill="currentColor" />
            <circle cx="24" cy="6" r="2" fill="currentColor" />
            <circle cx="32" cy="6" r="2" fill="currentColor" />
            <circle cx="16" cy="42" r="2" fill="currentColor" />
            <circle cx="24" cy="42" r="2" fill="currentColor" />
            <circle cx="32" cy="42" r="2" fill="currentColor" />

            {/* Central heart */}
            <path
                d="M24 26c-1-1.5-3-1.5-3 0s1.5 2 3 3c1.5-1 3-1.5 3-3s-2-1.5-3 0z"
                fill="currentColor"
            />
        </svg>
    );
}
