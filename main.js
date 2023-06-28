let imageArray = [];
let currentIndex = 0;
let isPlay = false;

let uploadElement = document.getElementById('fileUpload');
let previewElement = document.getElementById('preview');
let imageContainerElement = document.getElementById('imageContainer');

// image upload and preview
uploadElement.addEventListener('change', function(e) {
  let files = e.target.files;
  imageArray = [];  // clear previous images
  previewElement.innerHTML = '';  // clear previous preview images
  let loadDone = files.length;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (!file.type.startsWith('image/')) {
      continue;
    }
    let reader = new FileReader();
    reader.onload = (function(i) { 
      return function(e) {
        src = e.target.result;
        imageArray[i] = src;
        if(--loadDone == 0) {
          imageArray.forEach(src => {
            let img = document.createElement("img");
            img.src = src;
            img.draggable = true;
            previewElement.appendChild(img);
          });
          loadImagesForSlideshow();  // load images for slideshow after images are uploaded
        }
      };
    })(i);
    reader.readAsDataURL(file);
  }
});

// load images for slideshow
function loadImagesForSlideshow() {
  imageContainerElement.innerHTML = '';  // clear previous slideshow images
  imageArray.forEach((image, index) => {
    let img = document.createElement("img");
    img.src = image;
    img.style.zIndex = imageArray.length - index;  // stack images in reverse order
    imageContainerElement.appendChild(img);
  });
}

function stopSlideshow() {
  isPlay = false;
  imageContainerElement.innerHTML = '';
}

// image slideshow
function startSlideshow() {
  loadImagesForSlideshow();
  isPlay = true;
  setTimeout(function () {
    currentIndex = 0;
    if (imageArray.length > 0) {
      showNextImage();
    }
  }, 1000);
}

function showNextImage() {
  if (currentIndex >= imageArray.length) {
    startSlideshow();  // reload images and start slideshow again
    return;
  }

  setTimeout(() => {
    imageContainerElement.getElementsByTagName("img")[currentIndex].classList.add("half-size");
    if(currentIndex > 0){
    imageContainerElement.getElementsByTagName("img")[currentIndex-1].classList.add("hide");
      }
  }, 0);

  setTimeout(() => {
    if(!isPlay) {
      return;
    }
    currentIndex++;
    showNextImage();
  }, 3000);
}

// drag and drop to reorder images
let dragEl;
previewElement.addEventListener('dragstart', function(e) {
  dragEl = e.target;
  // e.dataTransfer.setData('text/plain', e.target.src);
}, false);

previewElement.addEventListener('drop', function(e) {
  e.preventDefault();
  // let oldSrc = e.dataTransfer.getData('text/plain');
  let oldSrc = dragEl.src;
  let newSrc = e.target.src;
  e.target.src = oldSrc;
  dragEl.src = newSrc;
  let oldIndex = imageArray.findIndex(img => img == oldSrc);
  let newIndex = imageArray.findIndex(img => img == newSrc);
  if (oldIndex !== -1 && newIndex !== -1) {
    let tmp = imageArray[oldIndex];
    imageArray[oldIndex] = imageArray[newIndex];
    imageArray[newIndex] = tmp;
    loadImagesForSlideshow();  // reload images for slideshow after reordering
  }
}, false);

previewElement.addEventListener('dragover', function(e) {
  e.preventDefault();
}, false);


