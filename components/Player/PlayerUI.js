import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

function PlayerUI({ images, currentIndex, setCurrentIndex, fetchingImages, allSegmentsFetched }) {
    const [displayedIndex, setDisplayedIndex] = useState(currentIndex);
    const sliderTimeoutRef = useRef(null);

    useEffect(() => {
        setDisplayedIndex(currentIndex);
    }, [currentIndex]);

    const handleSliderChange = (newIndex) => {
        setCurrentIndex(newIndex); // Update the slider's position instantly

        // Clear any previous timeouts
        if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);

        // Set a delay of 300 milliseconds before changing the displayed image.
        sliderTimeoutRef.current = setTimeout(() => {
            setDisplayedIndex(newIndex);
        }, 300);
    };

    return (
        <div>
            <div className="flex flex-col items-center w-full h-full mt-5">
                <div className="flex justify-center items-center h-120 w-full relative overflow-hidden">
                    <div className="rounded rounded-m bg-slate-50 dark:bg-slate-800">
                        <img
                            src={images[displayedIndex]?.screenshot_url}
                            alt={`Image for timestamp: ${images[displayedIndex]?.timestamp}`}
                            height={768}
                            width={1366}
                        />
                    </div>
                    {fetchingImages && (
                        <p className="animate-pulse absolute top-2 right-2 text-white bg-fuchsia-500 bg-opacity-40 px-2 py-1 rounded text-sm mt-2">
                            Fetching more images...
                        </p>
                    )}
                    {allSegmentsFetched && (
                        <p className=" absolute top-2 right-2 text-white bg-fuchsia-600 bg-opacity-40 px-2 py-1 rounded text-sm mt-2">
                            History fetch complete
                        </p>
                    )}
                    {images[displayedIndex]?.attributes?.page_html_available && (
                        <a
                            href={images[displayedIndex]?.page_html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-2 text-white bg-fuchsia-500 bg-opacity-94 px-2 py-1 rounded text-sm mt-2"
                        >
                            Relive ⚡
                        </a>
                    )}
                    {images[displayedIndex]?.attributes?.current_url && (
                        <a
                            href={images[displayedIndex]?.attributes?.current_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-12 right-2 text-white bg-fuchsia-500 bg-opacity-94 px-2 py-1 rounded text-sm mt-2"
                        >
                            Go to URL ⚡
                        </a>
                    )}
                    <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded text-sm mt-2">
                        {new Date(images[displayedIndex]?.date_generated).toLocaleString()}
                    </p>
                    <p className="absolute bottom-12 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded text-sm mt-2">
                        {images[displayedIndex]?.name}
                    </p>
                </div>

                <Slider
                    type="range"
                    min={0}
                    max={images.length - 1}
                    step={1}
                    defaultValue={[currentIndex]}
                    onValueChange={handleSliderChange}
                    className="w-full mt-5"
                    disabled={fetchingImages}
                />
            </div>
        </div>
    );
}

export default PlayerUI;
