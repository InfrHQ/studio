import './globals.css';

import { Providers } from './providers';
import Telemetry from '@/components/Telemetry';

export const metadata = {
    title: 'Infr',
    description: 'Machine readable catalog of everything about you.',
};

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning>
            <head>
                <Telemetry />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
