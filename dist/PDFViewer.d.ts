interface PDFViewerParams {
    readonly container: HTMLElement;
    options?: PDFViewerOptions | undefined;
}
declare enum Theme {
    Light = "light",
    Dark = "dark",
    PDFApi = "pdfapi"
}
declare enum Scale {
    AutomaticZoom = "auto",
    ActualSize = "page-actual",
    PageFit = "page-fit",
    PageWidth = "page-width"
}
declare enum Event {
    DocumentUploaded = "document-uploaded",
    DocumentSaved = "document-saved",
    DocumentPrinted = "document-printed",
    SignatureRequested = "signature-requested",
    SignatureAdded = "signature-added",
    SignatureCancelled = "signature-cancelled",
    SignatureClickOutside = "signature-click-outside",
    DocumentUpdated = "document-updated"
}
type ToolbarIconSize = 16 | 24 | 32 | 48;
type ToolbarFontSize = NumericRange<10, 24>;
type NumericRange<Start extends number, End extends number, Arr extends unknown[] = [], Acc extends number = never> = Arr['length'] extends End ? Acc | Start | End : NumericRange<Start, End, [...Arr, 1], Arr[Start] extends undefined ? Acc : Acc | Arr['length']>;
interface PDFViewerOptions {
    readonly theme: Theme;
    readonly initialScale: Scale | number;
    readonly toolbarFontSize: ToolbarFontSize;
    readonly toolbarIconSize: ToolbarIconSize;
    readonly scaleDropdown: boolean;
    readonly search: boolean;
    readonly signature: boolean;
    readonly signatureButton: boolean;
    readonly print: boolean;
    readonly download: boolean;
    readonly upload: boolean;
    readonly sidebar: boolean;
}
interface SignatureFlowParams {
    readonly name: string;
    readonly signatureId?: string | undefined;
}
/**
 * The signer's mark and where it belongs on the page, read out of the viewer
 * without modifying the document.
 */
interface SignatureAppearance {
    /** Base64-encoded PNG of the mark, with no data-URL prefix. */
    readonly image: string;
    /** 1-based page number. */
    readonly page: number;
    /** [x1, y1, x2, y2] in PDF points, origin bottom-left. */
    readonly rect: [number, number, number, number];
    /**
     * AcroForm name of the placeholder the mark was placed into, or null when it
     * was placed freely. The signing service fills that field, so no unclaimed
     * "Sign here" is left behind.
     */
    readonly field: string | null;
}
declare class PDFViewer {
    private readonly container;
    /**
     * The iframe window internal ID
     */
    private iframeId;
    /**
     * The iframe state
     */
    private isIframeLoaded;
    /**
     * Interval (in milliseconds) for checking the iframe loading state
     */
    private readonly LOADING_INTERVAL;
    /**
     * Default settings
     */
    private options;
    constructor(params: PDFViewerParams);
    /**
     * Sets application settings
     *
     * @param options - PDFViewerOptions
     */
    setOptions: (options: PDFViewerOptions) => void;
    /**
     * Loads a document via a URL
     *
     * @param url - string
     */
    loadUrl: (url: string) => Promise<void>;
    /**
     * Loads a document that is base64 encoded
     *
     * @param encodedPdf - string
     */
    loadBase64: (encodedPdf: string) => Promise<void>;
    /**
     * Returns the base64 encoded PDF document
     */
    getBase64: () => Promise<string>;
    /**
     * Returns the signer's mark and its position, leaving the document alone.
     *
     * @returns the mark. Throws, naming what was missing, when none can be read.
     */
    getSignatureAppearance: () => Promise<SignatureAppearance>;
    /**
     * Starts the signature flow inside the viewer.
     *
     * @param params - SignatureFlowParams
     */
    startSignatureFlow: (params: SignatureFlowParams) => Promise<void>;
    /**
     * Restricts signing to a single signature field, matched by its id.
     *
     * @param signatureId - string | null
     */
    setActiveSignatureField: (signatureId: string | null) => Promise<void>;
    /**
     * Cancels a signature flow previously started via startSignatureFlow.
     */
    cancelSignatureFlow: () => Promise<void>;
    /**
     * Renders a PDF document using the PDF.js API
     *
     * @param documentParams - OpenDocumentParams
     */
    private render;
    /**
     * Applies global settings
     */
    private applyOptions;
    /**
     * UI initialization
     */
    private initUI;
    /**
     * Style loader
     *
     * @param document - Document
     */
    private loadStyles;
    /**
     * Script loader
     *
     * @param document - Document
     */
    private loadScripts;
    /**
     * Returns the PDF.js application instance
     * Retries until the application is loaded
     */
    private pdfJsApplication;
}

export { Event, PDFViewer, type PDFViewerOptions, type PDFViewerParams, Scale, type SignatureAppearance, type SignatureFlowParams, Theme, type ToolbarFontSize, type ToolbarIconSize };
