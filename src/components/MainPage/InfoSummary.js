import React, { Component, Fragment } from 'react'
import { numberWithCommas, convertNumberToText, getIsSolo } from '../../utils/utils'
import { getTotalSupply, coinGeckoMarketCap } from '../../redux/api/restV3/iiss'

class InfoSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSolo: false,
            totalSupply: 0, 
            marketCap: 0
        }
    }

    

    async componentDidMount() {
        const isSolo = await getIsSolo()
        const totalSupply = await getTotalSupply()
        const marketCap = await coinGeckoMarketCap()
        this.setState({ isSolo, totalSupply, marketCap })
    }
    
    render() {

        const { tmainInfo } = this.props.info || {}
        const { transactionCount, icxCirculationy } = tmainInfo || {}
        const marketCapStr = numberWithCommas(Math.floor(this.state.marketCap))
        return (
            <Fragment>
                <li>
                    <div>
                        <span className="usd"><i className="img"></i></span>
                        <p>Market Cap <em>(USD)</em></p>
                        <p>{marketCapStr}</p>									
                    </div>
                </li>
                <li>
                    <div>
                        <span className="icx"><i className="img"></i></span>
                        <p>ICX Supply</p>
                        <p>{convertNumberToText(this.state.totalSupply, 0)}</p>									
                    </div>
                </li>
                <li>
                    <div>
                        <span className="icx"><i className="img"></i></span>
                        <p>ICX Circulation</p>
                        <p>{convertNumberToText(icxCirculationy, 0)}</p>									
                    </div>
                </li>
                <li>
                    <div>
                        <span><i className="img">T</i></span>
                        <p>All Transactions</p>
                        <p>{numberWithCommas(transactionCount)}</p>									
                    </div>
                </li>
            </Fragment>
        )
    }
}

export default InfoSummary
