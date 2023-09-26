'use client';

import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import 'react-datepicker/dist/react-datepicker.css';
import { makeServerCall } from '@/utils/infrTools';

function SingleCard({ item, isLoading = false }) {
    let dateGenerated;
    if (isLoading) {
        dateGenerated = new Date();
    } else {
        dateGenerated = new Date(item?.date_generated);
    }
    dateGenerated = dateGenerated.toLocaleString();

    let misc_item = item?.attributes?.window_name;
    if (item?.attributes?.current_url) {
        misc_item = item?.attributes?.current_url;
    }

    return (
        <div
            key={item?.name}
            className={
                'flex items-center p-4 border-b last:border-b-0 cursor-pointer' + (isLoading ? ' animate-pulse' : '')
            }
            // Onlick open a new tab /player?segment={base64 encoded segment}
            onClick={() => {
                if (!isLoading) {
                    window.open(`/player?segment=${Buffer.from(JSON.stringify(item)).toString('base64')}`, '_blank');
                }
            }}
        >
            <img
                src={item?.screenshot_url}
                alt={item?.attributes?.app_name}
                className="w-36 h-24 rounded-m mr-3 rounded rounded-m"
            />
            <div className="flex-grow">
                <h4 className="text-lg text-black dark:text-white">
                    {item?.attributes?.app_name} <span className="text-sm text-gray-500">{misc_item}</span>
                </h4>
                <p className="text-xs text-gray-400">{dateGenerated}</p>
            </div>
        </div>
    );
}

function SearchBar() {
    const [searchLoading, setSearchLoading] = useState(false);

    const [query, setQuery] = useState('');

    const [results, setResults] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());

    const searchDebounce = useRef(null);

    const constructURL = () => {
        let minTimeAsEpoch = startDate.getTime() / 1000;
        let maxTimeAsEpoch = endDate.getTime() / 1000;
        let IQL_QUERY = `
        USE IQLV1.0.1
        FILTER status EQUAL TO 'active'
        VECTOR SEARCH '${query}'
        FILTER date_generated GREATER THAN ${minTimeAsEpoch}
        FILTER date_generated LESS THAN ${maxTimeAsEpoch}
        ORDER BY date_generated DESC
        LIMIT 10
        FIELDS id, attributes, name, extracted_text, date_generated
        MAKE screenshot_url
        RETURN
        `;
        let base_64_query = Buffer.from(IQL_QUERY).toString('base64');
        return `/v1/segment/query?query=${base_64_query}`;
    };

    async function fetchData() {
        setSearchLoading(true);
        try {
            const url = constructURL();
            const resp_json = await makeServerCall(url, 'GET');
            const new_segments = await resp_json.json();
            new_segments.reverse();
            setSearchLoading(false);
            return new_segments;
        } catch (e) {
            console.error(e);
        }
        setSearchLoading(false);
    }

    const handleSearch = async () => {
        let value = query;
        if (value) {
            // Clear any existing timeouts to prevent unnecessary searches
            if (searchDebounce.current) {
                clearTimeout(searchDebounce.current);
            }
            // Set a new timeout for the search
            searchDebounce.current = setTimeout(async () => {
                if (value) {
                    let data = await fetchData();
                    setResults(data);
                } else {
                    setResults([]);
                }
            }, 700); // 700ms delay
        } else {
            setResults([]);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [startDate, endDate, query]);

    return (
        <div className="relative w-full">
            <div className="relative w-full flex space-x-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for anything..."
                    required
                />
                <div className="flex items-center ml-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-4  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <span className="mx-4 text-gray-500">to</span>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>

                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-4  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
            {results.length > 0 && !searchLoading && (
                <div className="max-h-96 overflow-y-auto absolute w-full mt-2 bg-white dark:bg-black  border border-gray-300 rounded-lg shadow-md z-10">
                    {results.map((item) => (
                        <SingleCard item={item} key={item?.id} />
                    ))}
                </div>
            )}{' '}
            {searchLoading && (
                <div className="max-h-96 overflow-y-auto absolute w-full mt-2 bg-black bg-opacity-80 border border-gray-300 rounded-lg shadow-md z-10">
                    <SingleCard isLoading={true} />
                    <SingleCard isLoading={true} />
                    <SingleCard isLoading={true} />
                    <SingleCard isLoading={true} />
                </div>
            )}
        </div>
    );
}

export default SearchBar;
