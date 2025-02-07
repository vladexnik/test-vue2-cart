export function getPriceDynamic(updatedRate, exchangeRate) {
    return updatedRate > exchangeRate ? 'price-up' :
        updatedRate < exchangeRate ? 'price-down' :
        '';
}

export function getRandomCurrencyRate() {
    return Math.floor(Math.random() * (80 - 20 + 1)) + 20;
}