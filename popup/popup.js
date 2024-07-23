document.addEventListener("DOMContentLoaded", () => {
  getData("resumes");

  const resumesButton = document.getElementById("resumes-selection");
  const coverLettersButton = document.getElementById("coverletters-selection");
  const dropdownButtonLabel = document.getElementById("dropdown-button-label");

  const githubRepoButton = document.getElementById("githubrepo");
  githubRepoButton.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.create({
      url: "https://github.com/ngntriminh/ResumeGrabber",
    });
  });

  const clickableGitHub = document.getElementById("github");
  const clickableYouTubeTutorial = document.getElementById("youtubetutorial");
  const clickableBuyMeACoffee = document.getElementById("buymeacoffee");
  clickableGitHub.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.create({ url: "https://github.com/ngntriminh" });
  });
  clickableYouTubeTutorial.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.create({
      url: "https://youtu.be/0fU0Y4R2-1A?si=XKixK1RqoWlAGoBy",
    });
  });
  clickableBuyMeACoffee.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.create({
      url: "https://www.buymeacoffee.com/ngntriminh",
    });
  });

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
      displayResumes(resumes, _dataType);
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

function displayResumes(_resumes, _type) {
  const container = document.getElementById("resume-container");
  if (!container) {
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
          <small class="text-nowrap">${timeAgo(_resume.createdAt)}</small>
      </div>
      <p class="mb-1">Template used: ${formatTemplateName(_resume.template)}</p>
      <small>Updated at: ${formatDate(_resume.updatedAt)}</small>

      <div class="d-flex flex-row-reverse mt-4">
          <button id="download-button" class="d-flex align-items-center btn-sm btn-dark ml-2" type="button">
              <svg id="download-icon" xmlns="http://www.w3.org/2000/svg" style="height: 1em;" fill="currentColor"
                  class="bi bi-file-earmark-arrow-down-fill mr-1" viewBox="0 0 16 16">
                  <path
                      d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0" />
              </svg>
              <div id="download-spinner" class="d-none text-secondary spinner-border spinner-border-sm mr-2" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <span id="download-text">Download PDF</span>
          </button>

          <button id="edit-button" class="d-flex align-items-center btn-sm" style="background-color: #f8f9fa;" type="button">
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

    const editButton = document.getElementById("edit-button");
    editButton.addEventListener("click", function (event) {
      event.preventDefault();
      _type === "resumes"
        ? chrome.tabs.create({
            url: "https://resume.io/app/resumes/" + _resume.id + "/edit",
          })
        : chrome.tabs.create({
            url: "https://resume.io/app/cover-letters/" + _resume.id + "/edit",
          });
    });

    document
      .getElementById("download-button")
      .addEventListener("click", async () => {
        const downloader = new ResumeIODownloader(_resume.renderingToken);

        const downloadButton = document.getElementById("download-button");
        const downloadSpinner = document.getElementById("download-spinner");
        const downloadIcon = document.getElementById("download-icon");
        const downloadText = document.getElementById("download-text");

        downloadButton.disabled = true;
        downloadButton.style.backgroundColor = "#f8f9fa";
        downloadSpinner.classList.remove("d-none");
        downloadIcon.style.display = "none";
        downloadText.classList.add("text-secondary");
        downloadText.textContent = "Downloading PDF...";

        try {
          const pdfBytes = await downloader.generatePdf();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "[ResumeGrabber] " + _resume.name;
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          throw new Error(error);
        } finally {
          downloadButton.disabled = false;
          downloadButton.style.removeProperty("background-color");
          downloadSpinner.classList.add("d-none");
          downloadIcon.style.display = "block";
          downloadText.classList.remove("text-secondary");
          downloadText.textContent = "Download";
        }
      });
  });
}
