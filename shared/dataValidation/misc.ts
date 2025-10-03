export {
    areStrongEqual,
    assertStrongEquality
};

function areStrongEqual(
    one: any, 
    two: any,
) : boolean {
    
    try {
        assertStrongEquality(one, two)
        return true
    } catch(err) {
        return false
    }
}

function assertStrongEquality(
    one: any, 
    two: any
) {
    if(one !== two) throw new Error(`Values are not strictly equal: ${one} !== ${two}`)
}