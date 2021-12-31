import {fetchCoinList, getDetailsOfCoin} from './app.js';

describe('Display CoinGecko data', () => {

    it('Get coin list', async function(){
        let coinList = await fetchCoinList();
        expect(coinList).toHaveLength(10);
    });

    it('Valid coin list', async function(){
        let coinList = await fetchCoinList();
        expect(coinList[0].id).toBeTruthy();
        expect(coinList[0].name).toBeTruthy();
        expect(coinList[0].symbol).toBeTruthy();
        expect(coinList[0].current_price).toBeTruthy();
        expect(coinList[0].high_24h).toBeTruthy();
        expect(coinList[0].low_24h).toBeTruthy();
    });

    it('Get coin details', async function(){
        let coinDetails = await getDetailsOfCoin('bitcoin');
        expect(coinDetails.id).toBe('bitcoin');
    })

    it('Valid coin details', async function(){
        let coinDetails = await getDetailsOfCoin('bitcoin');
        expect(coinDetails.id).toBeTruthy();
        expect(coinDetails.name).toBeTruthy();
        expect(coinDetails.symbol).toBeTruthy();
        expect(coinDetails.hashingAlgorithm).toBeTruthy();
        expect(coinDetails.description).toBeTruthy();
        expect(coinDetails.marketCap).toBeTruthy();
        expect(coinDetails.genesisDate).toBeTruthy();
        expect(coinDetails.homepage).toBeTruthy();
    })

})