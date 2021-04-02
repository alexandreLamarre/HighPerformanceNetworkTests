/**
 * Updates buffer vertices
 * @param item buffer vertex to update
 * @param w amount to scale x-coords by
 * @param h amount to scale y & z coords by
 */
export function updatePositionsFromScalar(item, w, h){
    item[0] *= w
    item[1] *= h
    item[2] *= h
}