class ResumeIODownloader {
  constructor(renderingToken, extension = "jpeg", imageSize = 3000) {
    this.renderingToken = renderingToken;
    this.extension = extension;
    this.imageSize = imageSize;
    this.cacheDate = new Date().toISOString().slice(0, -5) + "Z";
    this.METADATA_URL = `https://ssr.resume.tools/meta/${renderingToken}?cache=${this.cacheDate}`;
    this.IMAGES_URL = `https://ssr.resume.tools/to-image/${renderingToken}-{pageId}.${extension}?cache=${this.cacheDate}&size=${imageSize}`;
  }

  async getResumeMetadata() {
    try {
      const response = await axios.get(this.METADATA_URL);
      this.raiseForStatus(response);
      this.metadata = response.data.pages;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get resume metadata");
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
      this.raiseForStatus(response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to download image");
    }
  }

  async generatePdf() {
    await this.getResumeMetadata();
    const images = await this.downloadImages();
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < images.length; i++) {
      const worker = Tesseract.createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data } = await worker.recognize(images[i]);
      const pagePdf = data.pdf;

      const embeddedPdf = await PDFDocument.load(pagePdf);
      const [embeddedPage] = await pdfDoc.copyPages(embeddedPdf, [0]);
      pdfDoc.addPage(embeddedPage);

      const metadataPage = this.metadata[i];
      for (const link of metadataPage.links) {
        const annotation = pdfDoc.createAnnotation({
          type: "link",
          rect: [link.x, link.y, link.x + link.w, link.y + link.h],
          url: link.url,
        });
        embeddedPage.node.addAnnotation(annotation);
      }
      await worker.terminate();
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  raiseForStatus(response) {
    if (response.status !== 200) {
      throw new Error(
        `Unable to download resume (rendering token: ${this.renderingToken})`
      );
    }
  }
}
