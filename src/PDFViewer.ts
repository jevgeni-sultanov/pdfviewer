import htmlContent from "./viewer.html";
import pdfjsStyles from "./viewer.css";
import fortAwesomeStyles from "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import pdfjsLib from "./pdf.mjs";
import pdfjsWorker from "./pdf.worker.mjs";
import pdfjsViewer from "./viewer.mjs";

export interface PDFViewerParams {
  readonly container: HTMLElement;
  options?: PDFViewerOptions | undefined;
}

export interface PDFViewerOptions {
  readonly print: boolean;
  readonly download: boolean;
  readonly upload: boolean;
}

interface PDFViewerApplication {
  open(params: { document: string }): void;
  disablePrinting(): void;
}

interface IframeWindow extends Window {
  document: Document;
  PDFViewerApplication: PDFViewerApplication;
}

export class PDFViewer {
  private readonly container: HTMLElement;
  protected options?: PDFViewerOptions | undefined;

  constructor(params: PDFViewerParams) {
    this.container = params.container;
    this.options = params.options;
  }

  public setOptions = (options: PDFViewerOptions): void => {
    this.options = options;
  };

  public loadUrl = async (url: string): Promise<void> => {
    const response = await fetch(url);
    const blob = await response.blob();

    await this.render(URL.createObjectURL(blob));
  };

  public loadBase64 = async (encodedPdf: string): Promise<void> => {
    await this.render(encodedPdf);
  };

  private render = async (pdf: string): Promise<void> => {
    const iframe = document.createElement("iframe") as HTMLIFrameElement;
    this.container.appendChild(iframe);

    const iframeWindow = iframe.contentWindow as IframeWindow;
    const iframeDocument = iframe.contentDocument || iframeWindow.document;

    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();

      this.loadStyles(iframeDocument);
      this.loadScripts(iframeDocument);
    }
  };

  private loadStyles = (document: Document): void => {
    [pdfjsStyles, fortAwesomeStyles].forEach((styles) => {
      const stylesElement = document.createElement('style');
      stylesElement.textContent = styles;
      document.head.appendChild(stylesElement);
    });
  };

  private loadScripts = (document: Document): void => {
    [pdfjsLib, pdfjsWorker, pdfjsViewer].forEach((script) => {
      const scriptElement: HTMLScriptElement = document.createElement("script");
      scriptElement.type = "module";
      scriptElement.defer = true;
      scriptElement.textContent = script;
      document.body.appendChild(scriptElement);
    });
  };
}
