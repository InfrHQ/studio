import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Panel({ images, displayIndex }) {
    if (!images) return null;

    const image = images[displayIndex];
    const [copyLinkText, setCopyLinkText] = React.useState('Copy');
    const [showItem, setShowItem] = React.useState(null);

    function getRelevantText(image) {
        if (image?.attributes?.current_url) {
            let url = image?.attributes?.current_url;
            return (
                <div className="flex w-full space-x-2">
                    <Input value={url} readOnly />
                    <Button variant="secondary" className="shrink-0 w-16" onClick={handleCopyLink}>
                        {copyLinkText}
                    </Button>
                </div>
            );
        } else if (image?.attributes?.window_name) {
            return <CardDescription> {image?.attributes?.window_name} </CardDescription>;
        }
        return null;
    }

    function getReliveButtonIfApplicable(image) {
        if (image?.page_html_url && image?.attributes?.page_html_available) {
            return (
                <Button
                    variant="secondary"
                    className="shrink-0 w-16"
                    onClick={() => {
                        window.open(image?.page_html_url, '_blank');
                    }}
                >
                    Relive
                </Button>
            );
        }
        return null;
    }

    function extractLinks(text) {
        // Regular expression to match URLs
        const urlRegex =
            /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; // eslint-disable-line

        const matches = text.match(urlRegex) || [];
        return matches.join('\n');
    }

    function getShowItem(image, showItem) {
        if (!showItem) {
            return null;
        }
        if (showItem === 'raw_text') {
            return <Textarea value={image?.extracted_text} readOnly className="mt-2 h-96" />;
        }
        if (showItem === 'links') {
            return <Textarea value={extractLinks(image?.extracted_text)} readOnly className="mt-2 h-96" />;
        }

        return null;
    }

    function handleCopy(text) {
        navigator.clipboard.writeText(text);
    }

    function handleCopyLink() {
        handleCopy(image?.attributes?.current_url);
        setCopyLinkText('Copied!');
        setTimeout(() => {
            setCopyLinkText('Copy');
        }, 2000);
    }

    return (
        <div>
            <Card className="w-64">
                <CardHeader>
                    <CardTitle className="mb-1">{image?.attributes?.app_name}</CardTitle>
                    {getRelevantText(image)}
                </CardHeader>
                <CardFooter className="flex justify-between">{getReliveButtonIfApplicable(image)}</CardFooter>
            </Card>
            <Card className="w-64 mt-5">
                <CardHeader>
                    <CardTitle className="mb-1">View</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Select onValueChange={(e) => setShowItem(e)}>
                                    <SelectTrigger id="framework">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="raw_text">Raw Text</SelectItem>
                                        <SelectItem value="links">Links</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                    {getShowItem(image, showItem)}
                </CardContent>
                <CardFooter className="flex justify-between"></CardFooter>
            </Card>
        </div>
    );
}
