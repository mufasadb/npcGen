function shiftMulti(array, shiftCount) {
    let res = array
    for (let i = 0; i <= shiftCount - 1; i++) {
        res.shift()
    }
    return res
}

module.exports = {
    multiShiftArray: (array, shiftCount) => {return shiftMulti(array, shiftCount)}
}