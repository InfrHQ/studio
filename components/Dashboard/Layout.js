'use client';
import { useState, useEffect } from 'react';
import {
    PersonIcon,
    HamburgerMenuIcon,
    LockClosedIcon,
    LaptopIcon,
    PieChartIcon,
    HeartIcon,
    ReaderIcon,
} from '@radix-ui/react-icons';
import ThemeToggle from '@/components/ThemeToggle';
import { getLocalData, setLocalData, removeLocalData } from '@/utils/localStorage';
import { makeServerCall } from '@/utils/infrTools';

function DashboardLayout({ children }) {
    const [userDropdown, setUserDropdown] = useState(false);
    const [userData, setUserData] = useState({});
    const [page, setPage] = useState('player');

    async function getUserData() {
        let userDataCall = await makeServerCall('/v1/user/query/apikey', 'GET');

        if (userDataCall.ok) {
            let userData = await userDataCall.json();
            setLocalData('user', userData?.user);
            setUserData(userData?.user);
        } else {
            removeLocalData();
            window.location.href = '/join';
        }
    }

    function handleSignOut() {
        removeLocalData();
        window.location.href = '/join';
    }

    useEffect(() => {
        // Check if user is logged in
        const userData = getLocalData();

        if (userData) {
            // Check if API Key & Server Host are not set
            if (!userData?.api_key && !userData?.server_host) {
                removeLocalData();
                window.location.href = '/join';
            }

            // If window location is just / redirect to /player
            if (window.location.pathname === '/') {
                window.location.href = '/player';
            }

            // Set page
            setPage(window.location.pathname.split('/')[1]);

            // If API Key & Server Host are set
            // Get user data from API
            getUserData();
        } else {
            removeLocalData();
            window.location.href = '/join';
        }
    }, []);

    return (
        <div>
            <div className="antialiased bg-slate-50 dark:bg-slate-900 flex flex-col min-h-screen">
                <nav className="bg-white border-b border-slate-200 px-4 py-2.5 dark:bg-slate-800 dark:border-slate-700 fixed left-0 right-0 top-0 z-50 bg-opacity-60 dark:bg-opacity-60">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex justify-start items-center">
                            <button
                                data-drawer-target="drawer-navigation"
                                data-drawer-toggle="drawer-navigation"
                                aria-controls="drawer-navigation"
                                className="p-2 mr-2 text-slate-600 rounded-lg cursor-pointer md:hidden hover:text-slate-900 hover:bg-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <HamburgerMenuIcon className="w-6 h-6" />
                                <span className="sr-only">Toggle sidebar</span>
                            </button>
                            <a href="#" className="flex items-center justify-between mr-4">
                                <img src="/infr.png" className="mr-3 h-8" alt="Infr Logo" />
                                <span className="self-center text-black text-2xl font-semibold whitespace-nowrap dark:text-white">
                                    Infr
                                </span>
                            </a>
                        </div>
                        <div className="flex items-center lg:order-2">
                            <ThemeToggle />
                            <div className="relative">
                                {/* Settings */}
                                <button
                                    type="button"
                                    className="flex mx-3 text-sm bg-slate-800 rounded-full md:mr-0 focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    data-dropdown-toggle="dropdown"
                                    onClick={() => setUserDropdown(!userDropdown)}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://api.dicebear.com/7.x/micah/svg?seed=InfrOpenStudio"
                                        alt="user photo"
                                    />
                                </button>
                                {/* Dropdown menu */}
                                <div
                                    className={
                                        'absolute right-0 mt-2 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-slate-100 shadow dark:bg-slate-700 dark:divide-slate-600 rounded-xl ' +
                                        (!userDropdown && 'hidden')
                                    }
                                    id="user-dropdown"
                                >
                                    <div className="py-3 px-4">
                                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                            {userData?.name}
                                        </span>
                                        <span className="block text-sm text-slate-900 truncate dark:text-white">
                                            {userData?.email_id}
                                        </span>
                                    </div>

                                    <ul className="py-1 text-slate-700 dark:text-slate-300" aria-labelledby="dropdown">
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center py-2 px-4 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                <PersonIcon className="w-5 h-5 mr-2" />
                                                Profile
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center py-2 px-4 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                <LaptopIcon className="w-5 h-5 mr-2" />
                                                Devices
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center py-2 px-4 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                <LockClosedIcon className="w-5 h-5 mr-2" />
                                                API Keys
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="py-1 text-slate-700 dark:text-slate-300" aria-labelledby="dropdown">
                                        <li>
                                            <a
                                                href="#"
                                                className="flex items-center py-2 px-4 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                Server Stats
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="py-1 text-slate-700 dark:text-slate-300" aria-labelledby="dropdown">
                                        <li>
                                            <a
                                                onClick={handleSignOut}
                                                className="block py-2 px-4 text-sm hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                Sign out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Sidebar */}
                <aside
                    className="fixed top-0 left-0 z-20 w-48 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-slate-200 md:translate-x-0 dark:bg-slate-800 dark:border-slate-700 bg-opacity-60 dark:bg-opacity-60"
                    aria-label="Sidenav"
                    id="drawer-navigation"
                >
                    <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-slate-800 bg-opacity-60 dark:bg-opacity-60">
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/player"
                                    className={
                                        'flex items-center p-2 text-base font-medium text-slate-900 rounded-lg dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group' +
                                        (page === 'player' ? ' bg-slate-100 dark:bg-slate-700' : '')
                                    }
                                >
                                    <PieChartIcon className="w-6 h-6 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                    <span className="ml-3">Player</span>
                                </a>
                            </li>
                        </ul>
                        <ul className="pt-5 mt-5 space-y-2 border-t border-slate-200 dark:border-slate-700">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-base font-medium text-slate-900 rounded-lg transition duration-75 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white group"
                                >
                                    <ReaderIcon className="w-6 h-6 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                    <span className="ml-3">Docs</span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    className="flex items-center p-2 text-base font-medium text-slate-900 rounded-lg transition duration-75 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white group"
                                >
                                    <HeartIcon className="w-6 h-6 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                    <span className="ml-3">Help</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
                <div className="flex flex-col flex-1 pl-48">
                    <main className="flex-1 p-4 pt-8 min-h-screen">{children}</main>
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
