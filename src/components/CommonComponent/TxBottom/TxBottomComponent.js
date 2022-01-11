import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TxBottomTitle from './TxBottomTitle'
import { TxTableHead, TxTableBody, LoadingComponent, NoBox } from '../../../components'

class TxBottomComponent extends Component {
    render() {
        const { txData, txType, goAllTx, address, tableClassName, noBoxText } = this.props
        const { data, listSize, totalSize, loading, } = txData

        const Content = () => {
            if (loading) {
                return <LoadingComponent height="349px" />
            } else if (!data || data.length === 0) {
                return <NoBox text={noBoxText} />
            } else {
                const { from_address, to_address } = data[0]
                return (
                    <div className="contents">
                        <TxBottomTitle txType={txType} listSize={totalSize} totalSize={Number(data.length)} goAllTx={goAllTx} fromAddr={from_address} toAddr={to_address} />
                        <div className="table-box">
                            <table className={tableClassName}>
                                <thead>
                                    <TxTableHead txType={txType} />
                                </thead>
                                <tbody>
                                    {(data || []).map((item, index) => (
                                        <TxTableBody key={index} rank={index +1} data={item} txType={txType} address={address} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        }
        return Content()
    }
}

export default withRouter(TxBottomComponent)
