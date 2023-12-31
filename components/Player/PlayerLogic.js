'use client';

import React, { useState, useEffect } from 'react';
import PlayerUI from './PlayerUI';
import LoadingImagePlayer from './Loader';
import { strToBase4 } from '@/utils/infrTools';
import { getLocalData } from '@/utils/localStorage';

function ImagePlayer({ segment }) {
    const [imageList, setImageList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fetchingImages, setFetchingImages] = useState(true);
    const [searchedTime, setSearchedTime] = useState(null);

    const [olderOffset, setOlderOffset] = useState(0);
    const [newerOffset, setNewerOffset] = useState(0);

    const [allOlderSegmentsFetched, setAllOlderSegmentsFetched] = useState(false);
    const [allNewerSegmentsFetched, setAllNewerSegmentsFetched] = useState(false);

    const [serverUrl, setServerUrl] = useState('');
    const [apiKey, setApiKey] = useState('');

    const query_limit = 200;

    useEffect(() => {
        let data = getLocalData();
        setServerUrl(data.server_host);
        setApiKey(data.api_key);
    }, []);

    useEffect(() => {
        if (serverUrl && apiKey) {
            initialLoad();
        }
    }, [serverUrl, apiKey]);

    const constructURL = (offset, segmentHandler, newSearchedTime) => {
        let IQL_QUERY = `
        USE IQLV1.0.0
        FILTER status EQUAL TO 'active'
        `;
        if (segmentHandler === 'new' && segment) {
            IQL_QUERY +=
                `FILTER date_generated GREATER THAN ` +
                newSearchedTime +
                `
            ORDER BY date_generated ASC`;
        } else if (segmentHandler === 'old' && segment) {
            IQL_QUERY +=
                `FILTER date_generated LESS THAN ` +
                newSearchedTime +
                `
            ORDER BY date_generated DESC`;
        } else {
            IQL_QUERY += `ORDER BY date_generated DESC`;
        }
        IQL_QUERY += `
        OFFSET ${offset ? offset : 0}
        LIMIT ${query_limit}
        FIELDS id, attributes, name, extracted_text, date_generated
        MAKE screenshot_url, page_html_url
        RETURN
        `;
        return `${serverUrl}/v1/segment/query?query=${strToBase4(IQL_QUERY)}`;
    };

    async function fetchData(offset, segmentHandler, searchTime) {
        setFetchingImages(true);
        const url = constructURL(offset, segmentHandler, searchTime);
        const options = {
            headers: {
                'Infr-API-Key': apiKey,
            },
        };
        const resp = await fetch(url, options);
        const resp_json = await resp.json();
        const new_segments = resp_json;
        if (segmentHandler) {
            if (segmentHandler === 'old' && segmentHandler) new_segments.reverse();
        } else {
            new_segments.reverse();
        }
        setFetchingImages(false);
        return new_segments;
    }

    async function initialLoad() {
        let new_segments = [];

        if (segment) {
            // Load segment as Base64
            let first_segment = JSON.parse(Buffer.from(segment, 'base64').toString());

            let newSearchedTime = Math.floor(new Date(first_segment?.date_generated).getTime() / 1000);
            setSearchedTime(newSearchedTime);
            const beforeSegments = await fetchData(olderOffset, 'old', newSearchedTime);
            const afterSegments = await fetchData(newerOffset, 'new', newSearchedTime);

            new_segments = [...beforeSegments, first_segment, ...afterSegments];

            setOlderOffset((prevOffset) => prevOffset + query_limit);
            setNewerOffset((prevOffset) => prevOffset + query_limit);
            setCurrentIndex(parseInt(new_segments.indexOf(first_segment)));
        } else {
            new_segments = await fetchData(olderOffset); // Use olderOffset for generic load
            setCurrentIndex(parseInt(new_segments.length - 1));
            setOlderOffset((prevOffset) => prevOffset + query_limit);
            setAllNewerSegmentsFetched(true);
        }

        setImageList(new_segments);
    }

    useEffect(() => {
        if (
            ((currentIndex <= 10 && !allOlderSegmentsFetched) ||
                (imageList.length - currentIndex <= 10 && !allNewerSegmentsFetched)) &&
            !fetchingImages
        ) {
            fetchMoreImages();
        }
    }, [currentIndex]);

    async function fetchMoreImages() {
        // Initialize arrays to hold newly fetched segments
        let olderImages = [];
        let newerImages = [];

        // Fetch older images if the current index is near the start of the list
        if (currentIndex <= 10 && !allOlderSegmentsFetched) {
            if (segment) {
                olderImages = await fetchData(olderOffset, 'old', searchedTime);
            } else {
                olderImages = await fetchData(olderOffset, 'old');
            }

            if (olderImages.length < query_limit) {
                setAllOlderSegmentsFetched(true);
            } else {
                setOlderOffset((prevOffset) => prevOffset + query_limit); // Update the olderOffset
            }
        }

        // Fetch newer images if the current index is near the end of the list
        else if (imageList.length - currentIndex <= 10 && !allNewerSegmentsFetched) {
            if (segment) {
                newerImages = await fetchData(newerOffset, 'new', searchedTime);
            } else {
                newerImages = await fetchData(newerOffset, 'new');
            }

            if (newerImages.length < query_limit) {
                setAllNewerSegmentsFetched(true);
            } else {
                setNewerOffset((prevOffset) => prevOffset + query_limit); // Update the newerOffset
            }
        }

        // Handle neither case
        if (olderImages.length === 0 && newerImages.length === 0) {
            return;
        }

        // Combine older images, current image list, and newer images
        const newList = [...olderImages, ...imageList, ...newerImages];

        // Update the current index to reflect the addition of new segments
        if (olderImages.length > 0) {
            const newIndex = olderImages.length + Number(currentIndex);
            setCurrentIndex(parseInt(newIndex));
        }

        // Update the main state
        setImageList(newList);
        setFetchingImages(false);
    }

    return (
        <>
            {imageList.length === 0 ? (
                <LoadingImagePlayer />
            ) : (
                <PlayerUI
                    images={imageList}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    fetchingImages={fetchingImages}
                    allSegmentsFetched={allNewerSegmentsFetched && allOlderSegmentsFetched}
                />
            )}
        </>
    );
}

export default ImagePlayer;
