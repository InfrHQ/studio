'use client';

import { useEffect, useState } from 'react';
import ImagePlayer from '@/components/Player/PlayerLogic';

import DashboardLayout from '@/components/Dashboard/Layout';

function Home() {
    // Get the ?searchText=xyz parameter
    const [searchText, setSearchText] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let tempSearchText = window.location.search.split('=')[1];
        if (tempSearchText) {
            setSearchText(decodeURIComponent(tempSearchText));
        }
        setLoading(false);
    }, []);

    return (
        <div>
            <main className="flex min-h-screen flex-col p-10">{!loading && <ImagePlayer segment={searchText} />}</main>
        </div>
    );
}

export default function DashboardHome() {
    return (
        <DashboardLayout>
            <Home />
        </DashboardLayout>
    );
}
