import React, {useState, useEffect} from 'react';
import './app.css'

async function fetchCoinList(){
    try{
        let response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10');
        let json = await response.json();
        let coinListData = [];
        json.forEach(element => {
            coinListData.push({id: element.id, image: element.image, name: element.name, symbol: element.symbol,
                current_price: element.current_price, high_24h: element.high_24h, low_24h: element.low_24h});
        });
        return coinListData;
    }catch(error){
        return error;
    }
    
}

async function getDetailsOfCoin(coinId){
    try{
        let response = await fetch('https://api.coingecko.com/api/v3/coins/'+coinId);
        let json = await response.json();
        let coinDetails = {id: json.id, name: json.name, symbol: json.symbol, hashingAlgorithm: json.hashing_algorithm,
            description: json.description.en, marketCap: json.market_data.market_cap.eur, genesisDate: json.genesis_date,
            homepage: json.links.homepage};
        return coinDetails;
    }catch(error){
        return error;
    }
}

function CoinGecko(){
    const [coinListData, setCoinListData] = useState([]);
    const [coinDetails, setCoinDetails] = useState(null);
    const [listMode, setListMode] = useState(true); //state object to indicate the coin list or coin info mode

    // Shows details/info of coin on click of on coin in the list
    const showDetailsOfCoin = (coinId) => {
        getDetailsOfCoin(coinId).then((coinDetails) => {
            setCoinDetails(coinDetails);
            setListMode(false);
        })
        .catch(err => console.error(err));
    }

    // Restores the coin list view
    const gotoHomepage = () => {
        setListMode(true);
    }

    // Initial call to fetch coin list data and render it in UI
    useEffect(() => {
        fetchCoinList().then(coinListData => setCoinListData(coinListData))
            .catch(err => console.error(err));
    }, []);

    return(
        <div className="container">
            <h1>CoinGecko</h1>
            <table className="table-container">
            {
                /* In list mode, render list of coins, otherwise render detail info of selcted coin */
                listMode ? (
                    <><thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Current Price</th>
                            <th>High 24 hour Price</th>
                            <th>Low 24 hour Price</th>
                        </tr>
                    </thead>
                    <tbody id='coinListTableBody'>
                    {
                        coinListData.map((item) => (
                            <tr key={item.id} onClick={() => showDetailsOfCoin(item.id)}>
                                <td><img src={item.image} alt='' width='50' height='50'></img></td>
                                <td id={item.id} >{item.name}</td>
                                <td>{item.symbol}</td>
                                <td>&euro; {item.current_price}</td>
                                <td>&euro; {item.high_24h}</td>
                                <td>&euro; {item.low_24h}</td>
                            </tr>
                        ))
                    }   
                    </tbody></>
                ) : (
                    <><tbody id='coinDetailsTableBody'>
                    <tr>
                        <th>Name</th>
                        <td>{coinDetails.name}</td>
                    </tr>
                    <tr>
                        <th>Symbol</th>
                        <td>{coinDetails.symbol}</td>
                    </tr>
                    <tr>
                        <th>Hashing Algorithm</th>
                        <td>{coinDetails.hashingAlgorithm ? (coinDetails.hashingAlgorithm) : ('-')}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>
                            {   
                                /* Rendering the html from description text */
                                coinDetails.description
                                ? (<div style={{width: '1000px'}} dangerouslySetInnerHTML={{ __html: coinDetails.description }} />)
                                : ('-') 
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Market Cap</th>
                        <td>&euro; {coinDetails.marketCap}</td>
                    </tr>
                    <tr>
                        <th>Genesis Date</th>
                        <td>{coinDetails.genesisDate ? (coinDetails.genesisDate) : ('-')}</td>
                    </tr>
                    <tr>
                        <th>Homepage</th>
                        <td>
                            <div dangerouslySetInnerHTML={{ __html: coinDetails.homepage ? (coinDetails.homepage.map((item, idx) => {
                                /* Adding homepage url into anchor tag */ 
                                if(idx > 0 && item){
                                    return ` <a href='`+item+`'>`+item+`</a>`;
                                }else if(item){
                                    return `<a href='`+item+`'>`+item+`</a>`;
                                }else{
                                    return ``;
                                }
                            })) : ('-') }} />
                        </td>
                    </tr>
                    </tbody></>
                    )
            }
            </table>
            {
                /* Rendering button to go back from details to list view */
                listMode ? (<div></div>) : 
                (<button id="btnGoBack" style={{marginTop: '25px'}} onClick={gotoHomepage}>Back</button>)
            }
        </div>
    );
}

export {CoinGecko, fetchCoinList, getDetailsOfCoin};
