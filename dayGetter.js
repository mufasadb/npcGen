const dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const dayinMonthCountArray = [31,28,31,30,31,30,31,31,30,31,30,31]    


function beachiesDayGetter (year, month, day) {
    if(issLeap())
    const totalDays = 0 
    let countOfLeaps = Math.floor(year / 4)
    let countofCenturies = Math.floor(year/ 100)
    let daysInYear = ( year - 1 ) * 365 - countofCenturies + countOfLeaps
        
    
    let daysInMonth = dayinMonthCountArray.reduce(function(total, currentMonth, currentIndex){
        if(currentIndex < Month - 2){return total + currentMonth}
    })
    
    console.log(daysInMonth)


    // return dOW
}

function issLeap (year) {
    if(year%100 != 0 && year%4 == 0 ){
        return true
    }else {return false} 
}

beachi