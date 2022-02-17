import React, { Component, useEffect, useState } from 'react';
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
import {addressRewardList, addressTokenTxList, addressVotedList, addressInternalTxList} from '../../../../redux/store/addresses'
import {getBondList, getDelegation} from '../../../../redux/store/iiss'
// export const ADDRESS_TABS = [
//     'Transactions',
//     'Internal Transactions',
//     'Token Transfers',
//     'Delegations',
//     'Voters',
//     'Rewards',
//     'Bonded'
//   ];

function WalletTabs(props){

    const [bondList, setBondList] = useState("")
    const [intTx, setIntTx] = useState("")
    const [tokenTransfers, setTokenTransfers] = useState("")
    const [rewards, setRewards] = useState("")
    const [deleg, setDeleg] = useState("")
    const [tokenTx, setTokenTx] = useState("")
    const [voted, setVoted] = useState("")



    
    const checkTabs = async (address) => {
        let payload = {address: `${address}`, count:10, page:1}
        let bondData = await getBondList(payload)
        setBondList(bondData)
        let intTxData = await addressInternalTxList(payload)
        setIntTx(intTxData)
        let tokenTansfersData  =  await addressTokenTxList(payload)
        setTokenTransfers(tokenTansfersData)
        let rewardsData = await addressRewardList(payload)
        setRewards(rewardsData)
        let delegData = await getDelegation(payload)
        setDeleg(delegData)
        let tokenTxData = await addressTokenTxList(payload)
        setTokenTx(tokenTxData)
        let votedData = await addressVotedList(payload)
        setVoted(votedData)
    }
    
    

    // async componentDidMount(){
    //     this.checkTabs(this.props.match.params.addressId)
    //     // let payload = { address: `${this.props.match.params.addressId}`, page: 1, count: 10 }
    //     // this.voted = await addressVotedList(payload)
    //     // this.tokentransfers  =  await addressTokenTxList(payload)
    //     // this.rewards = await addressRewardList(payload)
    //     // this.deleg = await getDelegation(payload)
    //     // this.tokenTx = await addressTokenTxList(payload)
        
    // }
    useEffect(() => {
        checkTabs(props.match.params.addressId)
    },[])
    const { on, wallet, walletTx, addressInternalTx, walletTokenTx, addressDelegation, addressVoted, hasDelegations, isPrep, addressReward } = props
    const { loading, data } = wallet
    const { public_key, tokenList, transaction_count, iscore, internalTxCount, is_prep, claimIScoreCount, log_count } = data


    const TABS = []
    TABS.push(ADDRESS_TABS[0])
    if (intTx? intTx.data.length : null) {
        TABS.push(ADDRESS_TABS[1])
    }
    if (tokenTransfers? tokenTransfers.data.length : null) {
        TABS.push(ADDRESS_TABS[2])
    }
    if (deleg? deleg.delegations.length : null) {
        TABS.push(ADDRESS_TABS[3])
    }
    if (voted? voted.data.length : null) {
        TABS.push(ADDRESS_TABS[4])
    }
    if (rewards? rewards.data.length: null) {
        TABS.push(ADDRESS_TABS[5])
    }
     if (bondList ? bondList.length : null) {
         TABS.push(ADDRESS_TABS[6])
     }
    
        

        return (
            <TabTable
                {...props}
                
                TABS={TABS}
                on={on}
                loading={loading}
                TableContents={on => {
                    switch (TABS[on]) {
                        case ADDRESS_TABS[0]:
                            return (
                                <AddressTransactions
                                    txData={walletTx}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[1]:
                            return (
                                <AddressInternalTransactions
                                    txData={addressInternalTx}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_INTERNAL_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_INTERNAL_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[2]:
                            return (
                                <AddressTokenTransfers
                                    txData={walletTokenTx}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_TOKEN_TX}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_TOKEN_TX}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[3]:
                            return (
                                <AddressDelegation
                                    txData={addressDelegation}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_DELEGATIONS}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_DELEGATION}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[4]:

                            return (
                                <AddressVoted
                                    txData={addressVoted}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_VOTED}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_VOTED}
                                    address={public_key}
                                />
                            )
                        case ADDRESS_TABS[5]:
                            return (
                                <AddressReward
                                    txData={addressReward}
                                    goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_REWARD}/${public_key}`) }}
                                    txType={TX_TYPE.ADDRESS_REWARD}
                                    address={public_key}
                                />
                            )
                            case ADDRESS_TABS[6]:
                                return (
                                    <AddressBonded
                                        txData={bondList}
                                        goAllTx={() => { props.history.push(`/${TX_TYPE.ADDRESS_BONDED}/${public_key}`) }}
                                        txType={TX_TYPE.ADDRESS_BONDED}
                                        address={public_key}
                                    />
                                )
                        default:
                            return <NoBox text="No Data" />
                    }
                }}
            />
        )
    
}

export default withRouter(WalletTabs);
