export function convertToStr(amount) {
    let strAmount = amount.toString();
    let amountArr = strAmount.split('.')
    console.log("amountArr[0]", amountArr[0]);
    console.log("amountArr[1]", amountArr[1]);
    if (amountArr[1] === undefined) {
        let concatedAmount = amountArr[0].concat('000000000')
        console.log("concatedamunt", concatedAmount);
        return concatedAmount
    } else {
        let concatedAmount = amountArr[0].concat(amountArr[1].slice(0, 9))
        for (let i = 0; i < 9 - amountArr[1].length; i++) {
            concatedAmount = concatedAmount.concat('0')
        }
        console.log("concatedamunt", concatedAmount);
        return concatedAmount
    }
}