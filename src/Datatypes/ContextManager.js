/**
 * Context manager is a wrapper for all the important variables that
 * need to be accessed to do work and update the network data
 */
export default class ContextManager{
    /**
     * Constructors an object wrapper from the specified properties
     * @param properties Object
     */
    constructor(properties){
        for(const key in properties){
            if(properties.hasOwnProperty(key)) this.key = properties[key]
        }
    }

    /**
     * Sets the attribute of a context manager
     * @param key string key of the attribute
     * @param value value to set the property to
     */
    setAttribute(key, value){
        if (this.hasOwnProperty(key)){
            //TODO: error check (key, value) pairs
            this.key = value;
        } else{
            console.warn("Cannot set property '", key, " ' in ContextManager");
        }
    }

    /**
     * Gets the attribute of a context manager.
     * Returns undefined if it does not exist.
     * @param key string key of the attribute
     * @returns{Object || undefined}
     */
    getAttribute(key){
        if(this.hasOwnProperty(key)) return this.key;
        console.warn("Cannot get property '", key, "' in ContextManager")
    }
}