# ResumeGrabber

![GitHub Release](https://img.shields.io/github/v/release/ngntriminh/ResumeGrabber)

Hello! This Chrome extension helps you download any resume or cover letter created on resume.io for FREE. I understand the frustration of having to purchase a $2.95 weekly subscription just to download a resume, so I created this extension to save you time and money.

# Contents

 1. [About ResumeGrabber](#resumegrabber)  
 2. [How to install](#how-to-install)
 3. [How to use](#how-to-use) 
 4. [Important Notes](#important-notes)
 5. [Contribute and Support](#contribute-and-support)
 6. [Acknowledgement](#acknowledgement)

> **TL;DR:** Watch this tutorial on YouTube to know how to install and use it!

# How to install

-   Go to the release page and download the latest version.
    
-   Open  `chrome://extensions`  in your Chromium-based browser (e.g., Chrome, Edge). Enable  `Developer mode`, then drag and drop the  **.crx**  file you downloaded into the browser.
    
-   For quick access, you can pin the extension.

# How to use

## Sign in first!

After installing and opening the extension, if you see the screen shown below, just sign in at resume.io to get started! This step is **important**, so don't forget it.

<p align="center" >
<img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihavE7jqDXZEfIbwLOTzYOousjshx8urPh2CKZJm1VkPwrF7exPYu2FBe3QXQgg43JdCX8QGBKVeOcBDcDpbsfFZqmFHlcqBVAE=s2560" width="300" height="300">
</p>

## Download a resume

After signing in, **relaunch** the extension, and you will see all your resumes loaded by default. You can see each resume's title, the time since it was created, the template used, and when it was last updated. 

 - Click the `Edit` button to jump to the edit page and preview your resume. You may relaunch the extension until the data is up-to-date with what is on resume.io after editing it.
   
 - If you are happy with your resume, just hit the `Download PDF` button and be patient. It may take a few minutes to download your resume depending on it.

**DO NOT** quit the extension or click anywhere while downloading, as your download could fail!

<p align="center" >
<img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihYsh0q12SQ8JDCcu2r0cHigKYbs-yLTZ71uHn5ntGZuNFlKDL0BSIYqhsyocN9Im1g7A-tI5rxoJEhpr1D5EKs-4tm5Z_tZCg=s1600-rw-v1" width="300" height="300">
</p>

## Download a cover letter

Just switch to `Cover letters` using the dropdown menu and follow the same steps as you would to [download a resume](#download-a-resume).

<p align="center" >
<img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihbNDkgTh2ge7M-CdaxqEe_4nbog9ik50gza3lFic5jpFGn8UJaLSzsPPeEqzyQunBtLfam31enoNoV2WoQMm3dcnt0ormUCE_Q=s2560" width="300" height="300">
</p>

## Why I don't see any resume or cover letter?

- Because you have not [signed in](#sign-in-first) at resume.io. 
- Because you've deleted your resume or cover letter or haven't created one yet, simply create one on resume.io and relaunch the extension. The image below illustrates this.

<p align="center" >
<img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihbJkFafKpTCP3kc7sVibpKoJ_KQzCbpNGgvI7sFX_VGqkdj-JXOS_Oy1sCgupiIm4q-uZ6iJ49RJxK7Qc5XW7a3QEAljQmU050=s1600-rw-v1" width="300" height="300">
</p>

# Important Notes

-   This extension uses OCR technology to scan images of resumes and convert them into PDF files. As a result, the PDFs contain images rather than text. Consequently, the quality of the downloaded PDF may not be as high as when you download it directly from resume.io, but rest assured it remains visually appealing and functional.
    
- Only *English* is supported at the moment.
     
-   Links as annotations work fine; make sure to format links as  `https://...`  for them to be recognized correctly. Without this format, they may not function as links.
    
-   This extension may cease to work in the future if resume.io changes their back-end endpoints. I will do my best to keep it functional, but for now, it works perfectly.
    
-   This project is open-sourced, and the extension is free to use for non-commercial purposes. If you notice anyone using this extension for profit, please report it to me at  minh.ngntri@gmail.com.

# Contribute and Support

-   If you love this project and the extension works for you, please consider giving the repo a star. I truly appreciate your support!
    
-   You can also buy me a [coffee](https://www.buymeacoffee.com/ngntriminh) to show your support—your contribution will be a great motivation for me 🖤.

# Acknowledgement

This project cannot be done without:

| Project & Author | Contribution |
|--|--|
|[resumeio-to-pdf](https://github.com/felipeall/resumeio-to-pdf) by [felipeall](https://github.com/felipeall) | Felipe's amazing Python-based application for downloading resumes from resume.io is truly a lifesaver! Thanks to his great effort, I was able to convert the solution into this extension. You can show your appreciation by giving his repo a star [here](https://github.com/felipeall/resumeio-to-pdf).  |
|[tesseract.js](https://github.com/naptha/tesseract.js) by [naptha](https://github.com/naptha) | Pure Javascript OCR for more than 100 languages. |
|[pdf-lib](https://github.com/Hopding/pdf-lib) by [Hopding](https://github.com/Hopding) | Create and modify PDF documents in any JavaScript environment. |
|[axios](https://github.com/axios/axios)| Promise based HTTP client for the browser and node.js. |
|[bootstrap](https://github.com/twbs/bootstrap)| The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web. |
|[ChatGPT](https://chatgpt.com) by [OpenAI](https://openai.com) | Special thanks to OpenAI's ChatGPT for assistance with this project. |