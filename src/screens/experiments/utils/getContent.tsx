import React from 'react';
import { Divider, Stack, Typography, List, ListItem } from '@mui/joy';
import YouTubeVideo from '../../../components/TaskModal/YoutubeVideo';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails'; // or Joy version
import AddIcon from '@mui/icons-material/Add';
import ReactMarkdown from 'react-markdown';


function MarkdownAccordion({ children }: React.ComponentProps<'details'>) {
    const array = React.useMemo(() => React.Children.toArray(children), [children]);
    const [summary, ...rest] = array;

    return (
        <Accordion>
            {summary}
            <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>{rest}</AccordionDetails>
        </Accordion>
    )
}

const getContent = (block: any) => {
    if (block.type === 'para') {
        return (
            <p>
                {block['content']}
            </p>
        );
    }

    if (block.type === 'title') {
        return (
            <h2>
                {block['content']}
            </h2>
        );
    }

    if (block.type === 'video') {
        return <YouTubeVideo src={block.src} />;
    }

    if (block.type === 'image') {
        return (
            <img
                src={block.src}
                alt={block.alt}
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }
                }
            />
        );
    }

    if (block.type === 'expandable') {
        return (
            <Accordion>
                <AccordionSummary expandIcon={< AddIcon />}>
                    <Typography sx={{ mb: 2, mt: 2 }}>
                        {block.title}
                    </Typography>
                </AccordionSummary>

                < Divider />

                <AccordionDetails style={{ backgroundColor: '#eeeeee' }}>
                    <br />
                    < Stack spacing={2} > {block.contents.map((element: any) => getContent(element))} </Stack>
                </AccordionDetails>
            </Accordion>
        );
    }

    if (block.type === 'markdown') {
        const cleanedMarkdown = normalizeBullets(block.content);

        return (
            <div className="markdown-content">
                <ReactMarkdown
                    children={cleanedMarkdown}
                    components={{
                        h1: ({ children }) => <h1>{children} </h1>,
                        h2: ({ children }) => <h2>{children}</h2>,
                        h3: ({ children }) => <h3>{children}</h3>,
                        h4: ({ children }) => <h4>{children}</h4>,
                        h5: ({ children }) => <h5>{children}</h5>,
                        h6: ({ children }) => <h6>{children}</h6>,
                        ul: ({ children }) => <ul>{children}</ul>,
                        ol: ({ children }) => <ol>{children}</ol>,
                        li: ({ children }) => {
                            const clean = cleanChildren(children);
                            return <li>{clean}</li>;
                        },
                        p: ({ children }) => <p> {children} </p>,
                        a: ({ children, href }) => <a href={href}> {children} </a>,
                        img: (props) => {
                            return props.src?.startsWith('https://www.youtube.com/embed/') ? (
                                <YouTubeVideo src={props.src} />
                            ) : (
                                <img {...props} />
                            );
                        },
                        details: (props) => <MarkdownAccordion {...props} />,
                        summary: (props) => <AccordionSummary {...props} />,
                    }}
                />
            </div>
        );
    }
};

// For debugging
function logChildren(children: React.ReactNode, label = '') {
    console.log(`[${label}]`, children);
    return children;
}

// Replaces unconventional bullet points with proper markdown syntax
function normalizeBullets(markdown: string): string {
    return markdown
        .split('\n')
        .map((line) => {
            const bulletMatch = line.match(/^\s*[·•]\s+(.*)/);
            if (bulletMatch) {
                return `- ${bulletMatch[1].trim()}`;
            }
            return line;
        })
        .join('\n');
}

// Removes empty values and trims strings
function cleanChildren(children: React.ReactNode): React.ReactNode {
    const flat = React.Children.toArray(children);

    const filtered = flat.filter((child) => {
        if (typeof child === 'string') {
            return child.trim() !== '';
        }
        return Boolean(child);
    });

    const trimmed = filtered.map((child) => {
        return typeof child === 'string' ? child.trim() : child;
    });

    return trimmed.length === 1 ? trimmed[0] : trimmed;
}

export default getContent;