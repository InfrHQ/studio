import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Panel } from './Panel';
import SearchBar from './SearchBar';
import { postConvertTimestamp } from '../../utils/Time';

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
        <div className="flex">
            <div className="flex flex-col h-full mt-5 w-3/4">
                <SearchBar />
                <div className="flex h-120 relative overflow-hidden mt-8">
                    <div className="rounded rounded-md bg-slate-50 dark:bg-slate-800 ">
                        <img
                            src={images[displayedIndex]?.screenshot_url}
                            alt={`Image for timestamp: ${images[displayedIndex]?.timestamp}`}
                            className="rounded-md"
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

                    <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded text-sm mt-2">
                        {postConvertTimestamp(images[displayedIndex]?.date_generated).imageTitle}
                    </p>
                </div>
                <Slider
                    type="range"
                    min={0}
                    max={images.length - 1}
                    step={1}
                    defaultValue={[currentIndex]}
                    onValueChange={handleSliderChange}
                    className="mt-5"
                    disabled={fetchingImages}
                />
            </div>
            <div className="flex flex-col h-full mt-5 ml-5">
                <Panel images={images} displayIndex={displayedIndex} />
            </div>
        </div>
    );
}

export default PlayerUI;
