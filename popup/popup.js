document.addEventListener("DOMContentLoaded", () => {
  getData("resumes");

  const resumesButton = document.getElementById("resumes-selection");
  const coverLettersButton = document.getElementById("coverletters-selection");
  const dropdownButtonLabel = document.getElementById("dropdown-button-label");

  if (resumesButton && coverLettersButton && dropdownButtonLabel) {
    resumesButton.addEventListener("click", () => {
      dropdownButtonLabel.textContent = "Resumes";
      getData("resumes");
    });

    coverLettersButton.addEventListener("click", () => {
      dropdownButtonLabel.textContent = "Cover letters";
      getData("cover-letters");
    });
  }
});

async function getData(_dataType) {
  const container = document.getElementById("resume-container");
  container.innerHTML = "";
  const url = "https://resume.io/api/app/" + _dataType;
  try {
    document.getElementById("spinner-loading-resumes").style.display = "block";
    let resumes = [];
    const response = await axios.get(url);
    if (response.status === 200) {
      _dataType === "resumes"
        ? (resumes = response.data?.resumes)
        : (resumes = response.data?.coverLetters);
      if (resumes?.length === 0) {
        displayAlert(container, true, "Nothing here yet. Try to create one on");
      }
      displayResumes(resumes);
    }
  } catch {
    displayAlert(container, false, "Please sign in at");
  } finally {
    document.getElementById("spinner-loading-resumes").style.display = "none";
  }
}

function displayAlert(_container, _isLoggedIn, _message) {
  _container.innerHTML = `
    <div class='alert alert-dark' role='alert'>
      ${_message} <a id='access-resume-io' href='#'>resume.io</a>!
    </div>
  `;
  const resumeioLink = document.getElementById("access-resume-io");
  if (resumeioLink) {
    resumeioLink.addEventListener("click", function (event) {
      event.preventDefault();
      _isLoggedIn === true
        ? chrome.tabs.create({ url: "https://resume.io/app" })
        : chrome.tabs.create({
            url: "https://resume.io/app/auth/sign-in",
          });
    });
  }
}

function displayResumes(_resumes) {
  const container = document.getElementById("resume-container");
  if (!container) {
    console.error("Resume container element not found");
    return;
  }
  _resumes?.forEach((_resume) => {
    const listItem = document.createElement("div");
    listItem.classList.add(
      ...["d-flex", "flex-column", "w-100", "list-group-item"]
    );
    listItem.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1 mr-4">${_resume.name}</h6>
          <small class="text-nowrap">3 days ago</small>
      </div>
      <p class="mb-1">Template used: ${_resume.template}</p>
      <small>Updated at: ${_resume.updatedAt}</small>

      <div class="d-flex flex-row-reverse mt-4">
          <button class="d-flex align-items-center btn-sm btn-dark ml-2" type="button" id="githubButton">
              <svg xmlns="http://www.w3.org/2000/svg" style="height: 1em;" fill="currentColor"
                  class="bi bi-file-earmark-arrow-down-fill mr-1" viewBox="0 0 16 16">
                  <path
                      d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0" />
              </svg>
              <span id="download-resume">Download</span>
          </button>

          <button class="d-flex align-items-center btn-sm" style="background-color: #f8f9fa;" type="button"
              id="githubButton">
              <svg xmlns="http://www.w3.org/2000/svg" style="height: 1em;" fill="currentColor"
                  class="bi bi-pencil-fill mr-1" viewBox="0 0 16 16">
                  <path
                      d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
              </svg>
              <span>Edit</span>
          </button>
      </div>
    `;
    container.appendChild(listItem);

    document
      .getElementById("download-resume")
      .addEventListener("click", async () => {
        const downloader = new ResumeIODownloader(_resume.renderingToken);
        try {
          const pdfBytes = await downloader.generatePdf();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = _resume.name;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to download resume:", error);
        }
      });
  });
}

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

        console.log("PDF successfully downloaded with PDF-lib.");
      } catch (error) {
        console.error("Error loading PDF with PDF-lib:", error);
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
