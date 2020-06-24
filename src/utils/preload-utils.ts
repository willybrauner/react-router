/**
 * @copyright Original work by Alexis Bouhet - https://zouloux.com
 */

/**
 * Preload images
 * @param pURLs
 * @param pHandler
 * @param pAppendToBody
 * @param pRemove
 */
export function preloadImages(
  pURLs: string[],
  pHandler: (pImages: HTMLElement[]) => void,
  pAppendToBody = false,
  pRemove = false
): HTMLImageElement[] {
  // Count images
  let total = pURLs.length;
  let current = 0;

  // Images elements
  let images: HTMLImageElement[] = [];

  // Called when an image is loaded
  let handler = function ($pElement: HTMLImageElement) {
    // Add image element to list
    images.push($pElement[0] as HTMLImageElement);
    // Remove element to avoid memory leaks
    $pElement?.remove();
    // Count loaded image
    // If all are loaded, call handler
    if (++current === total) {
      pHandler(images);
    }
  };

  // Return list of created images
  let outputImages = [];

  // Browse URL's to load
  for (let i in pURLs) {
    // Create image tag
    let $img = document.createElement("img");
    // set src an attribute
    $img.src = pURLs[i];
    // push it in array
    outputImages.push($img);

    // Append to body to keep in memory
    if (pAppendToBody) {
      // Hide image
      $img.style.position = "absolute";
      $img.style.left = "-100000";
      // append image in body
      document.body.appendChild($img);
    }

    // check
    if (!$img) {
      throw new Error("Image need to target only one DOM element.");
    }
    // when image is loaded...
    $img.onload = () => handler($img);
  }

  return outputImages;
}
