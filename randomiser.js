const spreadArray = []


function resolveWeightedObject(objs) {
    let weightArray = []
    let itemArray = []
    for (obj of objs) {
        weightArray.push(obj.weight)
        itemArray.push(obj.name)
    }
    let totalWeighted = weightArray.reduce(function (a, b) { return a + b }, 0);
    let randomNumber = (Math.random() * (totalWeighted));
    let curMax = 0
    let finalPos = -1
    for (i in weightArray) {
        curMax = curMax + weightArray[i]
        if (randomNumber <= curMax) {
            finalPos = i;
            break;
        }
    }
    if (finalPos == -1) {
    }
    return itemArray[finalPos]

}


module.exports = {
    evenSplit: (array) => {
        let selection = array[Math.floor(Math.random() * array.length)]
        return selection
    },
    weightedSplit: (weightedObjectWithArrays) => {
        return resolveWeightedObject(weightedObjectWithArrays)
    }
}

