class ResumeIODownloader {
  constructor(renderingToken, extension = "jpeg", imageSize = 3000) {
    this.renderingToken = renderingToken;
    this.extension = extension;
    this.imageSize = imageSize;
    this.cacheDate = new Date(Date.now()).toISOString().slice(0, -5) + "Z";
    this.METADATA_URL = `https://ssr.resume.tools/meta/${renderingToken}?cache=${this.cacheDate}`;
    this.IMAGES_URL = `https://ssr.resume.tools/to-image/${renderingToken}-{pageId}.${extension}?cache=${this.cacheDate}&size=${imageSize}`;
  }

  async getResumeMetadata() {
    try {
      const response = await axios.get(this.METADATA_URL);
      this.catchFetchingError(response);
      this.metadata = response.data.pages;
    } catch (error) {
      throw new Error("Failed to get resume metadata", error);
    }
  }

  async downloadImages() {
    const images = [];
    for (let pageId = 1; pageId <= this.metadata.length; pageId++) {
      const imageUrl = this.IMAGES_URL.replace("{pageId}", pageId);
      const image = await this.downloadImageFromUrl(imageUrl);
      images.push(image);
    }
    return images;
  }

  async downloadImageFromUrl(url) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      this.catchFetchingError(response);
      return response.data;
    } catch (error) {
      throw new Error("Failed to download image", error);
    }
  }

  async generatePdf() {
    await this.getResumeMetadata();
    const images = await this.downloadImages();
    const pdfDoc = await PDFLib.PDFDocument.create();

    for (let i = 0; i < images.length; i++) {
      const { createWorker } = Tesseract;
      const worker = await createWorker("eng", 1, {
        corePath: chrome.runtime.getURL("/libs/tesseract-core.wasm.js"),
        workerPath: chrome.runtime.getURL("/libs/worker.min.js"),
        workerBlobURL: false,
      });
      const res = await worker.recognize(
        images[i],
        { pdfTitle: "" },
        { pdf: true }
      );

      const pagePdf = res.data.pdf;

      try {
        const embeddedPdf = await PDFLib.PDFDocument.load(pagePdf);
        const [embeddedPage] = await pdfDoc.copyPages(embeddedPdf, [0]);
        pdfDoc.addPage(embeddedPage);

        const metadataPage = this.metadata[i];
        const { width, height } = embeddedPage.getSize();
        const scaleWidth = width / metadataPage.viewport.width;
        const scaleHeight = height / metadataPage.viewport.height;
        const annotations = [];

        for (const link of metadataPage.links) {
          const rect = [
            link.left * scaleWidth,
            link.top * scaleHeight,
            (link.left + link.width) * scaleWidth,
            (link.top + link.height) * scaleHeight,
          ];
          const annotation = createPageLinkAnnotation(
            embeddedPage,
            link.url,
            rect
          );
          annotations.push(annotation);
        }

        if (annotations.length > 0) {
          const annotsArray = pdfDoc.context.obj(annotations);
          embeddedPage.node.set(PDFLib.PDFName.of("Annots"), annotsArray);
        }
      } catch (error) {
        throw new Error("Error loading PDF", error);
      }
      await worker.terminate();
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  catchFetchingError(response) {
    if (response.status !== 200) {
      throw Error("Error fetching metadata or images");
    }
  }
}

// Create annotations for URLs
const createPageLinkAnnotation = (page, uri, rect) => {
  const context = page.doc.context;
  return context.register(
    context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: rect,
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFLib.PDFString.of(uri),
      },
    })
  );
};
