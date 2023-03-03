<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Display Images from a Folder using JavaScript</title>
</head>
<body>
  <div id="image-list"></div>

  <script>
    // Define the folder path
    const folderPath = "images/";

    // Make an AJAX request to get the list of image files
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "getfilenames.php?path=" + folderPath);
    xhr.onload = function() {
      if (xhr.status === 200) {
        const imageList = document.getElementById("image-list");

        // Parse the response as a JSON array of filenames
        const filenames = JSON.parse(xhr.responseText);

        // Loop through the filenames and create <img> elements
        filenames.forEach(function(filename) {
          const img = document.createElement("img");
          img.src = folderPath + filename;
          imageList.appendChild(img);
        });
      } else {
        console.error("Request failed. Status: " + xhr.status);
      }
    };
    xhr.send();
  </script>

</body>
</html>
