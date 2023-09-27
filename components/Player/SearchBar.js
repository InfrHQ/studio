'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DatePicker } from './Datepicker';
import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { makeServerCall } from '@/utils/infrTools';
import { Input } from '@/components/ui/input';
import { Combobox } from './Combobox';

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
                    {item?.attributes?.app_name} <span className="text-sm text-slate-500">{misc_item}</span>
                </h4>
                <p className="text-xs text-slate-400">{dateGenerated}</p>
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
    const [appSelected, setAppSelected] = useState('all');

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
            <div className="flex items-center mb-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <span className="mx-4 text-slate-500">to</span>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>

                    <DatePicker date={endDate} setDate={setEndDate} />
                </div>
                <span className="mx-4 text-slate-500">in</span>
                <div className="relative">
                    <Combobox value={appSelected} setValue={setAppSelected} />
                </div>
            </div>
            <div className="relative w-full flex ">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full p-4 pl-10 "
                    placeholder="Search for anything..."
                    required
                />
            </div>
            {results.length > 0 && !searchLoading && query && (
                <div className="max-h-96 overflow-y-auto absolute w-full mt-2 bg-slate-50 dark:bg-slate-900  border border-slate-300 rounded-lg shadow-md z-10">
                    {results.map((item) => (
                        <SingleCard item={item} key={item?.id} />
                    ))}
                </div>
            )}{' '}
            {searchLoading && query && (
                <div className="max-h-96 overflow-y-auto absolute w-full mt-2 bg-slate-50 dark:bg-slate-900 bg-opacity-80 border border-slate-300 rounded-lg shadow-md z-10">
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
