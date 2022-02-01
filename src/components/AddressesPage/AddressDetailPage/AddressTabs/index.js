import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AddressTransactions from './AddressTransactions'
import AddressInternalTransactions from './AddressInternalTransactions'
import AddressTokenTransfers from './AddressTokenTransfers'
import AddressDelegation from './AddressDelegation'
import AddressVoted from './AddressVoted'
import AddressReward from './AddressReward'
import AddressBonded from './AddressBonded'
import {
    TX_TYPE,
    ADDRESS_TABS,
} from '../../../../utils/const'
import {
    NoBox,
    TabTable
} from '../../../../components'
import {addressRewardList, addressTokenTxList, addressVotedList, addressDelegationList, addressInternalTxList} from '../../../../redux/store/addresses'
import {getBondList} from '../../../../redux/store/iiss'
// export const ADDRESS_TABS = [
//     'Transactions',
//     'Internal Transactions',
//     'Token Transfers',
//     'Delegations',
//     'Voters',
//     'Rewards',
//     'Bonded'
//   ];

class WalletTabs extends Component {
    
    checkTabs = async (address) => {
        let payload = {address: `${address}`, page:1, count:10}
        this.tokentransfers  =  await addressTokenTxList(payload)
        this.voted = await addressVotedList(address)
        this.rewards = await addressRewardList(payload)
        this.deleg = await addressDelegationList(payload)
        this.tokenTx = await addressTokenTxList(payload)
        
        
    }
    
    async componentDidMount(){
        let payload = { address: `${this.props.match.params.addressId}`, page: 1, count: 10 }
        this.bondList = await getBondList(payload)
        this.intTx = await addressInternalTxList(payload)
        this.checkTabs(this.props.match.params.addressId)

    }
    render() {
        const { on, wallet, walletTx, addressInternalTx, walletTokenTx, addressDelegation, addressVoted, hasDelegations, isPrep, addressReward } = this.props
        console.log(this.props, "tab props")
        const { loading, data } = wallet
        const { public_key, tokenList, transaction_count, iscore, internalTxCount, is_prep, claimIScoreCount, log_count } = data
        console.log(this.bondList, "deeper")


        const TABS = []
        TABS.push(ADDRESS_TABS[0])
        console.log(this.intTx, "this int tx")
        if (this.intTx? this.intTx.data.length : null) {
            TABS.push(ADDRESS_TABS[1])
        }
        if (this.tokentransfers? this.tokentransfers.data.length : null) {
            TABS.push(ADDRESS_TABS[2])
        }
        if (this.deleg? this.deleg.data.length : null) {
            TABS.push(ADDRESS_TABS[3])
        }
        if (this.voted? this.voted.data.length : null) {
            // TABS.push(ADDRESS_TABS[6])
            TABS.push(ADDRESS_TABS[4])
        }
        if (this.rewards? this.rewards.data.length: null) {
            TABS.push(ADDRESS_TABS[5])
        }
        //  if (this.bondList ? this.bondList.length : null) {
        //      TABS.push(ADDRESS_TABS[6])
        //  }
        

        return (
            <TabTable
                {...this.props}
                
                TABS={TABS}
                on={on}
                loading={loading}
                TableContents={on => {
                    switch (TABS[on]) {
                        case ADDRESS_TABS[0]:
                            return (
                                <AddressTransactions
                                    txData={walletTx}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[1]:
                            return (
                                <AddressInternalTransactions
                                    txData={addressInternalTx}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_INTERNAL_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_INTERNAL_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[2]:
                            return (
                                <AddressTokenTransfers
                                    txData={walletTokenTx}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_TOKEN_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_TOKEN_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[3]:
                            return (
                                <AddressDelegation
                                    txData={addressDelegation}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_DELEGATIONS}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_DELEGATION}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[4]:

                            return (
                                <AddressVoted
                                    txData={addressVoted}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_VOTED}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_VOTED}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[5]:
                            console.log(addressReward, "what is reward")
                            return (
                                <AddressReward
                                    txData={addressReward}
                                    goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_REWARD}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_REWARD}
                                    address={public_key}
                                />
                            )
                            // case ADDRESS_TABS[6]:
                            //     console.log(this.bondList, "before")
                            //     return (
                            //         <AddressBonded
                            //             txData={this.bondList}
                            //             goAllTx={() => { this.props.history.push(`/${TX_TYPE.ADDRESS_BONDED}/${public_key}`) }}
                            //             txType={TX_TYPE.ADDRESS_BONDED}
                            //             address={public_key}
                            //         />
                            //     )
                        default:
                            return <NoBox text="No Data" />
                    }
                }}
            />
        )
    }
}

export default withRouter(WalletTabs);
