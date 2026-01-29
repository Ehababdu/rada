import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/favicon.jpg"
            alt="Logo"
            className={`object-contain brightness-110 contrast-110 ${props.className || ''}`}
        />
    );
}
