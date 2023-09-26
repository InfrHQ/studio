'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';

import { setLocalData, removeLocalData } from '@/utils/localStorage';
import { makeServerCall } from '@/utils/infrTools';

export default function Home() {
    const [apiKey, setApiKey] = useState('');
    const [host, setHost] = useState('');
    const [btnText, setBtnText] = useState('Sign in');
    const [loading, setLoading] = useState(false);

    async function getUserData() {
        let userDataCall = await makeServerCall('/v1/user/query/apikey', 'GET');
        if (userDataCall.ok) {
            let userData = await userDataCall.json();
            setLocalData('user', userData?.user);
            return true;
        } else {
            removeLocalData();
            return false;
        }
    }

    async function handleSubmit() {
        setLoading(true);

        // Ensure the user has entered a host and api key
        setBtnText('Checking details...');
        if (host === '' || apiKey === '') {
            setBtnText('Sign in');
            setLoading(false);
            return;
        }

        // Check api key is valid and get user data
        setLocalData('server_host', host);
        setLocalData('api_key', apiKey);

        // Check server is valid
        setBtnText('Checking server...');
        let resp = await makeServerCall('/version', 'GET');
        if (!resp.ok) {
            setBtnText('Sign in');
            setLoading(false);
            return;
        }

        resp = await getUserData();

        if (resp) {
            window.location.href = '/';
        } else {
            setBtnText('Sign in');
            setLoading(false);
        }
    }

    return (
        <main className="">
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="text-right p-3">
                    <ThemeToggle />
                </div>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 font-bold text-4xl">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="/infr.png" alt="logo" />
                        Infr
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your server
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label
                                        htmlFor="host"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Host
                                    </label>
                                    <input
                                        type="host"
                                        name="host"
                                        id="host"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="https://server.getinfr.com"
                                        required=""
                                        value={host}
                                        onChange={(e) => setHost(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="api_key"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        API Key
                                    </label>
                                    <input
                                        type="password"
                                        name="api_key"
                                        id="api_key"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required=""
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                required=""
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-blue-300">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full dark:text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit();
                                    }}
                                >
                                    {loading ? <Spinner /> : btnText}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer lightBG={'bg-gray-50'} darkBG={'bg-gray-900'} />
        </main>
    );
}
