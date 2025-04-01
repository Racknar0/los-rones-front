import React from 'react';

export function ChevronLeftIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            {...props}
        >
            <g fill="currentColor">
                <path d="m12 7.757l1.414 1.415L10.586 12l2.828 2.829L12 16.243L7.757 12z"></path>
                <path
                    fillRule="evenodd"
                    d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0"
                    clipRule="evenodd"
                ></path>
            </g>
        </svg>
    );
}
