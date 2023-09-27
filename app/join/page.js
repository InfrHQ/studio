'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import { Input } from '@/components/ui/input';

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

        setLocalData('server_host', host);
        setLocalData('api_key', apiKey);

        // Ensure the user has entered a host and api key
        setBtnText('Checking details...');
        console.log('host: ' + host + ' apikey: ' + apiKey);
        if (host === '' || apiKey === '') {
            setBtnText('Sign in');
            setLoading(false);
            return;
        }

        // Check api key is valid and get user data
        console.log('host: ' + host + ' apikey: ' + apiKey);

        // Check server is valid
        setBtnText('Checking server...');
        let resp = await fetch(host + '/version');
        if (!resp.ok) {
            setBtnText('Sign in');
            setLoading(false);
            return;
        }

        resp = await getUserData();

        if (resp) {
            window.location.href = '/player';
        } else {
            setBtnText('Sign in');
            setLoading(false);
        }
    }

    return (
        <main className="">
            <section className="bg-slate-50 dark:bg-slate-900">
                <div className="text-right p-3">
                    <ThemeToggle />
                </div>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 text-4xl">
                    <a
                        href="#"
                        className="flex items-center mb-6 text-2xl font-semibold text-slate-900 dark:text-white"
                    >
                        <img className="w-8 h-8 mr-2" src="/infr.png" alt="logo" />
                        Infr
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800 dark:border-slate-700 bg-opacity-50">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 md:text-2xl dark:text-white">
                                Sign in to your server
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label
                                        htmlFor="host"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
                                    >
                                        Host
                                    </label>
                                    <Input
                                        type="host"
                                        name="host"
                                        id="host"
                                        className="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                                        placeholder="https://server.getinfr.com"
                                        required=""
                                        value={host}
                                        onChange={(e) => {
                                            setHost(e.target.value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="api_key"
                                        className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
                                    >
                                        API Key
                                    </label>
                                    <Input
                                        type="password"
                                        name="api_key"
                                        id="api_key"
                                        placeholder="••••••••"
                                        className="bg-slate-50 border border-slate-300 text-slate-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                                        required=""
                                        value={apiKey}
                                        onChange={(e) => {
                                            setApiKey(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-primary-300 dark:bg-slate-700 dark:border-slate-600 dark:focus:ring-primary-600 dark:ring-offset-slate-800"
                                                required=""
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-slate-500 dark:text-slate-300">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="w-full text-white bg-slate-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
            <Footer lightBG={'bg-slate-50'} darkBG={'bg-slate-900'} />
        </main>
    );
}
