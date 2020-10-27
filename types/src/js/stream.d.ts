export default Stream;
declare class Stream {
    /**
     * Class constructor.
     *
     * @param {HTMLElement} [streamEl] - The component element in the DOM
     * @param {Object} [opts={}] - An options object for configuring the component
     */
    constructor(streamEl?: HTMLElement, opts?: any);
    streamEl: HTMLElement | Document;
    options: any;
    eventSeenTimes: {};
    useStagingEnvironment: boolean;
    init(): any;
    login(): void;
    authenticateUser(displayName: any): Promise<boolean | void>;
    displayName: any;
    authenticationToken: any;
    userHasValidSession: any;
    renderComments(): any;
    embed: any;
    displayNamePrompt({ purgeCacheAfterCompletion }?: {
        purgeCacheAfterCompletion?: boolean;
    }): void;
    /**
     * Emits events that have a valid o-comment event name.
     *
     * @param {String} name - The event name
     * @param {Object} data - The event payload
     * @returns {void}
     */
    publishEvent({ name, data }: string): void;
    renderSignedInMessage(): void;
}
