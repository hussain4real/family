import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized "H" for Hussain */}
            <path
                d="M14 12v24M34 12v24M14 24h20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Family tree branches */}
            <path
                d="M24 18v-6M20 18l-3-3M28 18l3-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Roots/foundation */}
            <path
                d="M24 30v6M20 30l-3 3M28 30l3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Family members as circles */}
            <circle cx="17" cy="9" r="1.5" fill="currentColor" />
            <circle cx="24" cy="9" r="1.5" fill="currentColor" />
            <circle cx="31" cy="9" r="1.5" fill="currentColor" />

            {/* Unity symbol in center */}
            <circle cx="24" cy="24" r="2" fill="currentColor" fillOpacity="0.3" />

            {/* Foundation circles */}
            <circle cx="17" cy="39" r="1.5" fill="currentColor" fillOpacity="0.7" />
            <circle cx="24" cy="39" r="1.5" fill="currentColor" fillOpacity="0.7" />
            <circle cx="31" cy="39" r="1.5" fill="currentColor" fillOpacity="0.7" />
        </svg>
    );
}
