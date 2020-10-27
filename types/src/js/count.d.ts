export default Count;
declare class Count {
    /**
     * Get the aria-label for the count element.
     *
     * @param {Number} count - The comment count
     * @returns {String} The string that should be used as the aria-label
     */
    static getCountLabel(count: number): string;
    static fetchCount(id: any, useStaging: any): Promise<any>;
    /**
     * Class constructor.
     *
     * @param {HTMLElement} [countEl] - The component element in the DOM
     * @param {Object} [opts={}] - An options object for configuring the component
     */
    constructor(countEl?: HTMLElement, opts?: any);
    countEl: HTMLElement;
    articleId: any;
    useStagingEnvironment: boolean;
    /**
     * Render a comment count instance.
     *
     * @access private
     * @returns {Promise<void>} A promise that resolves when the count has been updated
     */
    renderCount(): Promise<void>;
}
