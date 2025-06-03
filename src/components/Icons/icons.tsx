import { JSX } from 'react';

export const SpinLoadingColored = (): JSX.Element => (
    <svg className="animate-spin size-5 text-[#2C3E50]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12H5C5 7.58172 8.58172 4 12 4V2Z" fill="currentColor" />
        <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 16.4183 15.4183 20 12 20V22Z" fill="currentColor" />
    </svg>
);

export const SpinLoadingWhite = (): JSX.Element => (
    <svg className="animate-spin size-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12H5C5 7.58172 8.58172 4 12 4V2Z" fill="currentColor" />
        <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 16.4183 15.4183 20 12 20V22Z" fill="currentColor" />
    </svg>
);
