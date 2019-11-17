var saveAsFileObj = (function() {
  return {
    save: function(binaryData, filename, filetype) {
      var file;
      var downloadLink;
      file = new Blob([binaryData], { type: filetype });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
      } else {
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(file);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    }
  };
})(saveAsFileObj || {});
