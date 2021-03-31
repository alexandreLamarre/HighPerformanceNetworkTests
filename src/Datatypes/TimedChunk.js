/**
 * Timed chunk optimizes rendering by performing non blocking timed operations.
 * Best if used in conjunction with web workers.
 *
 * Note that items[index] must match one to one with updates[index]
 *
 * @param items items to update with timed chunk, for example buffer vertices
 * @param updates array of updates to apply to the items
 * @param fn the function that applies the updates from updates array to items
 * @param context canvas context
 * @param callback callback function to proceed with the next round of updates
 */
export default function TimedChunk(items, updates, fn, context, callback){
    var i = 0;
    let tick = function(){
        let start = new Date().getTime();
        for(; updates.length && (new Date().getTime() - start) < 50; i++){
            fn.call(context, items[i], updates[i]);
        }
        if(i < updates.length){
            //yield execution to rendering logic
            setTimeout(tick, 25);
        } else{
            callback(items, updates);
        }
    }
    setTimeout(tick, 25);
}
