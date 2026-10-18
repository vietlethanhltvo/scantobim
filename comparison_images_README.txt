ScanToBIM Tools — Homepage comparison images

The Home page now includes an interactive Point Cloud ↔ BIM Model comparison slider. The image slots are intentionally left as placeholders for you to fill later.

How to add your own images:
1. Open index.html.
2. Find the comment: AFTER / RIGHT IMAGE SLOT.
3. Replace the <div class="media-placeholder model-placeholder"> ... </div> block with:
   <img class="comparison-image" src="assets/bim-model.jpg" alt="Completed Revit BIM model">
4. Find the comment: BEFORE / LEFT IMAGE SLOT.
5. Replace the <div class="media-placeholder pointcloud-placeholder"> ... </div> block with:
   <img class="comparison-image" src="assets/point-cloud.jpg" alt="Original laser scan point cloud">
6. Create an assets folder next to index.html and put your images there using those filenames (or update the src paths).
7. Commit and push the changes to GitHub Pages.

Tips:
- Use images from the same camera angle and crop so the comparison is convincing.
- Landscape images around 1600 x 900 px work well.
- Compress images before uploading to keep the site fast.
- The slider works with local image files; no external image host is required.

The existing download_urls.txt and other pages are preserved.
