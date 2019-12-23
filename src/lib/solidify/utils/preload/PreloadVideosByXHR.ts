/**
 * Preload videos via XHR
 * @param pURLs
 * @param pCallBack
 */
import { Signal } from "../../helpers/Signal";

export class PreloadVideosByXHR {
  // ------------------------------------------------------------------------- SINGLETON

  /**
   * Create an instance if it doesn't already exist when instance method
   */
  protected static __instance: PreloadVideosByXHR;

  static get instance(): PreloadVideosByXHR {
    if (this.__instance == null) this.__instance = new PreloadVideosByXHR();
    return this.__instance;
  }

  // ------------------------------------------------------------------------- STATIC

  /**
   * Percentage loaded of all XHR
   */
  public static __percentLoaded = 0;
  /**
   * When progress number change
   */
  // Create a signal
  protected static __progressChange: Signal = new Signal();
  // return this signal
  public static get progressChange(): Signal {
    return this.__progressChange;
  }

  // ------------------------------------------------------------------------- VIDEO
  /**
   * Preload Videos list
   * - Calc percent loaded and dispatch it w/ Signal of solidify
   * -
   * @param pURLs
   * @param pCallBack
   * @constructor
   */
  public start(pURLs: string[], pCallBack?: () => void): void {
    // Initialize the counter
    let counter = 0;
    // Initialize an empty array about each elements percent loading
    let percentsArray: Array<number> = [];

    /**
     * On Load
     * @param pURL
     * @param pContext
     * @private
     */
    let _onLoad = (pURL: string, pContext): void => {
      // Onload is triggered even on 404 so we need to check the status code
      if (pContext.status == 200 || pContext.status == 0) {
        //console.log(pContext)
        // Create video element and set him an src
        let video = document.createElement("video");
        video.src = pURL;
      }
    };

    /**
     * On Progress
     * This method allow possibily to calc the current progress of load
     * and return a total percent of loading progress
     * @param pEvent
     * @param pIndex Current index element loading
     * @private
     */
    let _onProgress = (pEvent, pIndex) => {
      // If pEvent return a number
      if (pEvent.lengthComputable) {
        // Capture the current loaded percent of one element index
        // (divisie by 100 to get decimale value)
        // Each progress update the value on an external table
        percentsArray[pIndex] = ((pEvent.loaded / pEvent.total) * 100) / 100;
        // Get sum of all array entries
        let sum = percentsArray.reduce((a, b) => a + b, 0);
        // Get total percent of all items
        PreloadVideosByXHR.__percentLoaded = (sum / pURLs.length) * 100;
        // Dispach a Signal
        PreloadVideosByXHR.__progressChange.dispatch();
      }
    };

    /**
     * When the viddeo is loaded loaded
     * @private
     */
    let _onLoaded = () => {
      // Increment the counter
      counter++;
      // If all URLs are loaded
      if (pURLs.length === counter) {
        // Exectute callback if exist
        pCallBack?.();
      }
    };

    // Loop each URLs
    for (let i in pURLs) {
      // New XHR Instance
      let request = new XMLHttpRequest();
      // Open this URL
      request.open("get", pURLs[i], true);
      // Check when video is loading
      request.onload = () => _onLoad(pURLs[i], request);
      // Send XHR request
      request.send();
      // Check the progress on transfers
      request.addEventListener("progress", e => _onProgress(e, i));
      // When the video is loaded (passe resolve callback)
      request.addEventListener("load", () => _onLoaded());
      // If error
      request.addEventListener("error", () =>
        console.warn("An error occurred while transferring the file.")
      );
      // If aborted
      request.addEventListener("abort", () =>
        console.warn("The transfer has been canceled by the user.")
      );
    }
  }
}
