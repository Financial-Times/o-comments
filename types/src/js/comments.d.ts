export default Comments;
declare class Comments {
    static getCount(id: any): Promise<any>;
    /**
     * Get the data attributes from the element. If the component is being set up
     * declaratively, this method is used to extract the data attributes from the DOM.
     *
     * @param {HTMLElement} rootEl - The component element in the DOM
     * @returns {Object} - Data attributes as an object
     */
    static getDataAttributes(rootEl: HTMLElement): any;
    /**
     * Initialise the component.
     *
     * @param {(HTMLElement|String)} rootEl - The root element to intialise the component in, or a CSS selector for the root element
     * @param {Object} [opts={}] - An options object for configuring the component
     * @returns {(Comments|Array<Comments>)} - Comments instance(s)
     */
    static init(rootEl: (HTMLElement | string), opts?: any): (Comments | Array<Comments>);
    constructor(rootEl: any, opts: any);
    options: any;
}
