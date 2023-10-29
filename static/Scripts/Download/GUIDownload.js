    window.onload = waitToDownload()
    async function waitToDownload() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2000);
        downloadWithProgress()
    }
    function downloadWithProgress() {
      const startTime = new Date().getTime();

      const request = new XMLHttpRequest();

      request.responseType = "blob";
      request.open('POST', `/API/v1/GUI/DownloadFile?file_path={{ file_path }}&__token__={{ __token__ }}`);
      request.send();

      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const imageURL = window.URL.createObjectURL(this.response);

          const anchor = document.createElement("a");
          anchor.href = imageURL;
          anchor.download = '{{ filename }}';
          document.body.appendChild(anchor);
          anchor.click();
        }
      };

      request.onprogress = function (e) {
        const percent_complete = Math.floor((e.loaded / e.total) * 100);

        const duration = (new Date().getTime() - startTime) / 1000;
        const bps = e.loaded / duration;

        const kbps = Math.floor(bps / 1024);

        const time = (e.total - e.loaded) / bps;
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60);

        document.getElementById('downloadProgressValue').style.width = `${percent_complete}%`;
        const progressBar = document.getElementById('downloadProgress');
        progressBar.setAttribute("data-label", `Preparing Download... - ${percent_complete}%` );
        progressBar.setAttribute("value", String(percent_complete));
        if (percent_complete === 100) {
            progressBar.setAttribute("data-label", `Client Download Started` );
        }
        console.log(
          `${percent_complete}% - ${kbps} Kbps - ${minutes} min ${seconds} sec remaining`
        );
      };
    }