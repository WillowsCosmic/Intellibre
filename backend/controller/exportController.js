import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    UnderlineType,
    ImageRun
} from "docx";
import MarkdownIt from "markdown-it";
import PDFDocument from "pdfkit";
import Book from "../models/Book.js";
import path from "path";
import fs from "fs";

const md = new MarkdownIt();


const TYPOGRAPHY = {
    fonts: {
        body: "Charter",
        heading: "Inter",
    },
    sizes: {
        title: 32,
        subtitle: 20,
        author: 18,
        chapterTitle: 24,
        h1: 20,
        h2: 18,
        h3: 16,
        body: 12,
    },
    spacing: {
        paragraphBefore: 200,
        paragraphAfter: 200,
        chapterBefore: 400,
        chapterAfter: 300,
        headingBefore: 300,
        headingAfter: 150,
    },
    colors: {
        primary: "1A202C",
        secondary: "4A5568",
        accent: "4F46E5",
        body: "2D3748",
    }
};

// Process inline content (bold, italic, text)
const processInlineContent = (children) => {
    const runs = [];
    
    children.forEach(child => {
        if (child.type === 'text') {
            runs.push(new TextRun({
                text: child.content,
                font: TYPOGRAPHY.fonts.body,
                size: TYPOGRAPHY.sizes.body * 2,
            }));
        } else if (child.type === 'strong') {
            runs.push(new TextRun({
                text: child.content,
                bold: true,
                font: TYPOGRAPHY.fonts.body,
                size: TYPOGRAPHY.sizes.body * 2,
            }));
        } else if (child.type === 'em') {
            runs.push(new TextRun({
                text: child.content,
                italics: true,
                font: TYPOGRAPHY.fonts.body,
                size: TYPOGRAPHY.sizes.body * 2,
            }));
        } else if (child.type === 'code_inline') {
            runs.push(new TextRun({
                text: child.content,
                font: "Courier New",
                size: TYPOGRAPHY.sizes.body * 2,
                color: TYPOGRAPHY.colors.accent,
            }));
        }
    });
    
    return runs;
};

// Render inline tokens (for markdown parsing)
const renderInlineTokens = (doc, tokens, options = {}) => {
    const children = [];
    
    tokens.forEach(token => {
        if (token.type === 'text') {
            children.push({ type: 'text', content: token.content });
        } else if (token.type === 'strong_open') {
            const nextToken = tokens[tokens.indexOf(token) + 1];
            if (nextToken && nextToken.type === 'text') {
                children.push({ type: 'strong', content: nextToken.content });
            }
        } else if (token.type === 'em_open') {
            const nextToken = tokens[tokens.indexOf(token) + 1];
            if (nextToken && nextToken.type === 'text') {
                children.push({ type: 'em', content: nextToken.content });
            }
        } else if (token.type === 'code_inline') {
            children.push({ type: 'code_inline', content: token.content });
        }
    });
    
    return processInlineContent(children);
};

// Render markdown to DOCX paragraphs
const renderMarkdown = (doc, markdown) => {
    const paragraphs = [];
    const tokens = md.parse(markdown, {});
    
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        
        if (token.type === 'heading_open') {
            const level = parseInt(token.tag.substring(1));
            const inlineToken = tokens[i + 1];
            
            if (inlineToken && inlineToken.children) {
                paragraphs.push(
                    new Paragraph({
                        children: renderInlineTokens(doc, inlineToken.children),
                        heading: level === 1 ? HeadingLevel.HEADING_1 :
                                level === 2 ? HeadingLevel.HEADING_2 :
                                HeadingLevel.HEADING_3,
                        spacing: {
                            before: TYPOGRAPHY.spacing.headingBefore,
                            after: TYPOGRAPHY.spacing.headingAfter,
                        },
                    })
                );
            }
            i += 3;
            continue;
        }
        
        if (token.type === 'paragraph_open') {
            const inlineToken = tokens[i + 1];
            
            if (inlineToken && inlineToken.children) {
                const runs = renderInlineTokens(doc, inlineToken.children);
                
                if (runs.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            children: runs,
                            spacing: {
                                before: TYPOGRAPHY.spacing.paragraphBefore,
                                after: TYPOGRAPHY.spacing.paragraphAfter,
                            },
                        })
                    );
                }
            }
            i += 3;
            continue;
        }
        
        if (token.type === 'bullet_list_open') {
            i++;
            while (i < tokens.length && tokens[i].type !== 'bullet_list_close') {
                if (tokens[i].type === 'list_item_open') {
                    const listItemInline = tokens[i + 2];
                    if (listItemInline && listItemInline.children) {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "• " }),
                                    ...renderInlineTokens(doc, listItemInline.children)
                                ],
                                spacing: {
                                    before: 100,
                                    after: 100,
                                    left: 400,
                                },
                            })
                        );
                    }
                    i += 4;
                } else {
                    i++;
                }
            }
            i++;
            continue;
        }
        
        i++;
    }
    
    return paragraphs;
};


const processMarkdownToDocx = (markdown) => {
    const tokens = md.parse(markdown, {});
    const paragraphs = [];
    let inList = false;
    let listType = null;
    let orderedCounter = 1;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        try {
            if (token.type === "heading_open") {
                const level = parseInt(token.tag.substring(1), 10);
                const nextToken = tokens[i + 1];

                if (nextToken && nextToken.type === "inline") {
                    let headingLevel;
                    let fontSize;

                    switch (level) {
                        case 1:
                            headingLevel = HeadingLevel.HEADING_1;
                            fontSize = TYPOGRAPHY.sizes.h1;
                            break;
                        case 2:
                            headingLevel = HeadingLevel.HEADING_2;
                            fontSize = TYPOGRAPHY.sizes.h2;
                            break;
                        case 3:
                            headingLevel = HeadingLevel.HEADING_3;
                            fontSize = TYPOGRAPHY.sizes.h3;
                            break;
                        default:
                            headingLevel = HeadingLevel.HEADING_3;
                            fontSize = TYPOGRAPHY.sizes.h3;
                    }

                    paragraphs.push(
                        new Paragraph({
                            text: nextToken.content,
                            heading: headingLevel,
                            spacing: {
                                before: TYPOGRAPHY.spacing.headingBefore,
                                after: TYPOGRAPHY.spacing.headingAfter,
                            },
                            style: {
                                font: TYPOGRAPHY.fonts.heading,
                                size: fontSize * 2, // docx uses half-points
                            },
                        })
                    );
                }

                i += 2; // Skip inline and heading_close
                continue;
            }

            if (token.type === "paragraph_open") {
                const nextToken = tokens[i + 1];

                if (nextToken && nextToken.type === "inline" && nextToken.content) {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: nextToken.content,
                                    font: TYPOGRAPHY.fonts.body,
                                    size: TYPOGRAPHY.sizes.body * 2,
                                }),
                            ],
                            spacing: {
                                before: TYPOGRAPHY.spacing.paragraphBefore,
                                after: TYPOGRAPHY.spacing.paragraphAfter,
                            },
                        })
                    );
                }

                i += 2; // Skip inline and paragraph_close
                continue;
            }

            if (token.type === "bullet_list_open") {
                inList = true;
                listType = "bullet";
                continue;
            }

            if (token.type === "ordered_list_open") {
                inList = true;
                listType = "ordered";
                orderedCounter = 1;
                continue;
            }

            if (token.type === "list_item_open" && inList) {
                const nextToken = tokens[i + 1];
                
                if (nextToken && nextToken.type === "paragraph_open") {
                    const inlineToken = tokens[i + 2];
                    
                    if (inlineToken && inlineToken.type === "inline") {
                        const bulletText = listType === "ordered" 
                            ? `${orderedCounter}. ` 
                            : "• ";
                        
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: bulletText + inlineToken.content,
                                        font: TYPOGRAPHY.fonts.body,
                                        size: TYPOGRAPHY.sizes.body * 2,
                                    }),
                                ],
                                spacing: {
                                    before: 100,
                                    after: 100,
                                    left: 400,
                                },
                            })
                        );
                        
                        if (listType === "ordered") {
                            orderedCounter++;
                        }
                    }
                }
                continue;
            }

            if (token.type === "bullet_list_close" || token.type === "ordered_list_close") {
                inList = false;
                listType = null;
                continue;
            }

            if (token.type === "code_block" || token.type === "fence") {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: token.content,
                                font: "Courier New",
                                size: TYPOGRAPHY.sizes.body * 2,
                                color: TYPOGRAPHY.colors.accent,
                            }),
                        ],
                        spacing: {
                            before: 200,
                            after: 200,
                            left: 400,
                        },
                    })
                );
                continue;
            }

            if (token.type === "blockquote_open") {
                const nextToken = tokens[i + 1];
                if (nextToken && nextToken.type === "paragraph_open") {
                    const inlineToken = tokens[i + 2];
                    if (inlineToken && inlineToken.type === "inline") {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: inlineToken.content,
                                        font: TYPOGRAPHY.fonts.body,
                                        size: TYPOGRAPHY.sizes.body * 2,
                                        italics: true,
                                        color: TYPOGRAPHY.colors.secondary,
                                    }),
                                ],
                                spacing: {
                                    before: 200,
                                    after: 200,
                                    left: 600,
                                },
                                border: {
                                    left: {
                                        color: TYPOGRAPHY.colors.accent,
                                        space: 1,
                                        style: "single",
                                        size: 6,
                                    },
                                },
                            })
                        );
                    }
                }
                i += 4; // Skip paragraph_open, inline, paragraph_close, blockquote_close
                continue;
            }

        } catch (error) {
            console.error(`Error processing token at index ${i}:`, error);
        }
    }

    return paragraphs;
};
// Export as DOCX
const exportAsDocument = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to export this book" });
        }
        
        const sections = [];

        // Cover page with image
        const coverPage = [];

        if (book.coverImage && !book.coverImage.includes("pravatar")) {
            const imagePath = book.coverImage.substring(1);
            try {
                if (fs.existsSync(imagePath)) {
                    const imageBuffer = fs.readFileSync(imagePath);

                    coverPage.push(
                        new Paragraph({
                            text: "",
                            spacing: { before: 1000 },
                        })
                    );
                    coverPage.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageBuffer,
                                    transformation: {
                                        width: 400,
                                        height: 550,
                                    }
                                })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 200, after: 400 }
                        })
                    );

                    coverPage.push(
                        new Paragraph({
                            text: "",
                            pageBreakBefore: true
                        })
                    );
                }
            } catch (error) {  
                console.error(`Could not embed image: ${imagePath}`, error);
            }
        }
        sections.push(...coverPage);
        
        // Title page
        const titlePage = [];
        
        titlePage.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: book.title,
                        bold: true,
                        font: TYPOGRAPHY.fonts.heading,
                        size: TYPOGRAPHY.sizes.title * 2,
                        color: TYPOGRAPHY.colors.primary,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 2000, after: 400 },
            })
        );

        if (book.subtitle && book.subtitle.trim()) {
            titlePage.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: book.subtitle,
                            font: TYPOGRAPHY.fonts.heading,
                            size: TYPOGRAPHY.sizes.subtitle * 2,
                            color: TYPOGRAPHY.colors.secondary,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                })
            );
        }

        titlePage.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `by ${book.author}`,
                        font: TYPOGRAPHY.fonts.heading,
                        size: TYPOGRAPHY.sizes.author * 2,
                        color: TYPOGRAPHY.colors.body,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            })
        );

        titlePage.push(
            new Paragraph({
                text: "",
                border: {
                    bottom: {
                        color: TYPOGRAPHY.colors.accent,
                        space: 1,
                        style: "single",
                        size: 12,
                    },
                },
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
            })
        );

        sections.push(...titlePage);
        
        // Process chapters
        book.chapters.forEach((chapter, index) => {
            try {
                if (index > 0) {
                    sections.push(
                        new Paragraph({
                            text: "",
                            pageBreakBefore: true,
                        })
                    );
                }

                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: chapter.title,
                                bold: true,
                                font: TYPOGRAPHY.fonts.heading,
                                size: TYPOGRAPHY.sizes.chapterTitle * 2,
                                color: TYPOGRAPHY.colors.primary,
                            }),
                        ],
                        spacing: {
                            before: TYPOGRAPHY.spacing.chapterBefore,
                            after: TYPOGRAPHY.spacing.chapterAfter,
                        },
                    })
                );

                // Use advanced markdown rendering
                const contentParagraphs = renderMarkdown(null, chapter.content || "");
                sections.push(...contentParagraphs);
            } catch (chapterError) {
                console.error(`Error processing chapter ${index}:`, chapterError);
            }
        });

        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 1440,
                                right: 1440,
                                bottom: 1440,
                                left: 1440,
                            },
                        },
                    },
                    children: sections,
                },
            ],
        });

        const buffer = await Packer.toBuffer(doc);

        res.setHeader(
            "Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
        );
        res.setHeader("Content-Length", buffer.length);

        res.send(buffer);
    } catch (error) {
        console.error("Error exporting document:", error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Server error during document export",
                error: error.message,
            });
        }
    }
};

// Export as PDF
const exportAsPDF = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to export this book" });
        }

        const pdfDoc = new PDFDocument({
            margin: 72,
            size: 'A4',
            info: {
                Title: book.title,
                Author: book.author,
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`
        );

        pdfDoc.pipe(res);

        if (book.coverImage && !book.coverImage.includes("pravatar")) {
            const imagePath = book.coverImage.substring(1);
            try {
                if (fs.existsSync(imagePath)) {
                    pdfDoc.image(imagePath, {
                        fit: [400, 550],
                        align: 'center',
                        valign: 'center'
                    });
                    pdfDoc.addPage();
                }
            } catch (error) {
                console.error(`Could not embed image: ${imagePath}`, error);
            }
        }

        pdfDoc.moveDown(5);
        pdfDoc.font('Helvetica-Bold')
            .fontSize(32)
            .text(book.title, { align: 'center' });

        if (book.subtitle && book.subtitle.trim()) {
            pdfDoc.moveDown(1);
            pdfDoc.font('Helvetica')
                .fontSize(20)
                .fillColor('#4A5568')
                .text(book.subtitle, { align: 'center' });
        }

        pdfDoc.moveDown(1);
        pdfDoc.font('Helvetica')
            .fontSize(18)
            .fillColor('#2D3748')
            .text(`by ${book.author}`, { align: 'center' });

        book.chapters.forEach((chapter, index) => {
            pdfDoc.addPage();
            
            pdfDoc.font('Helvetica-Bold')
                .fontSize(24)
                .fillColor('#1A202C')
                .text(chapter.title);
            
            pdfDoc.moveDown(1);
            
            const content = chapter.content || "";
            const lines = content.split('\n');
            
            lines.forEach(line => {
                if (line.trim()) {
                    pdfDoc.font('Helvetica')
                        .fontSize(12)
                        .fillColor('#2D3748')
                        .text(line, {
                            align: 'justify',
                            lineGap: 5
                        });
                    pdfDoc.moveDown(0.5);
                } else {
                    pdfDoc.moveDown(1);
                }
            });
        });

        pdfDoc.end();

    } catch (error) {
        console.error("Error exporting PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Server error during PDF export",
                error: error.message,
            });
        }
    }
};


export { exportAsDocument, exportAsPDF };