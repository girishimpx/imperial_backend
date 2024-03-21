function getBalanceUsdt(ccy, bal) {
    try {
        let usdtBalance;
            switch (ccy) {
            case "ETH":
                usdtBalance = 1589.15 * bal;
                return usdtBalance

            case "BTC":
                usdtBalance = 28378.67 * bal;
                return usdtBalance

            case "LTC":
                usdtBalance = 63.17 * bal;
                return usdtBalance
            case "DOT":
                usdtBalance = 3.75 * bal;
                return usdtBalance

            case "FIL":
                usdtBalance = 3.24 * bal;
                return usdtBalance
            case "XRP":
                usdtBalance = 0.4913 * bal;
                return usdtBalance

            case "ADA":
                usdtBalance = 0.2505 * bal;
                return usdtBalance

            case "TRX":
                usdtBalance = 0.00854 * bal;
                return usdtBalance
            case "BCH":
                usdtBalance = 228.68 * bal;
                return usdtBalance

            case "BSV":
                usdtBalance = 38.88 * bal;
                return usdtBalance

            case "EOS":
                usdtBalance = 0.5546 * bal;
                return usdtBalance
            case "LINK":
                usdtBalance = 7.48 * bal;
                return usdtBalance

            case "ETC":
                usdtBalance = 15.18 * bal;
                return usdtBalance

            case "USDT":
                usdtBalance = 1* bal;
                return usdtBalance
                case "USD":
                    usdtBalance = 0 * bal;
                    return usdtBalance
        }
       
    } catch (err) {
        console.log(err)
    }
   
}
module.exports = { getBalanceUsdt };