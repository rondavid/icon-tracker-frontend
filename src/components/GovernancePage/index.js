import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
// import { getMainInfo } from '../../redux/api/restV3/main';
import { getMainInfo } from '../../redux/api/restV3';
import { numberWithCommas, convertLoopToIcxDecimal, convertNumberToText } from '../../utils/utils'
import { getPReps, getIISSInfo,icxCall } from '../../redux/api/restV3';
import { IconConverter, IconAmount } from 'icon-sdk-js'
import { getLastBlock, getStepPrice, prepList, getTotalSupply, coinGeckoMarketCap, getAllTransactions } from '../../redux/api/restV3/iiss';
// import { prepMain, prepSub, getPRep } from '../../redux/api/restV3/iiss';
import {
    LoadingComponent,
} from '../../components'
import { POPUP_TYPE } from '../../utils/const'
import { getTrackerApiUrl } from '../../redux/api/restV3/config';
import { GetAddressForPrepList } from '../../utils/const';
// import { calcFromLastBlock } from '../../utils/utils';

class GovernancePage extends Component {

	state = {
		totalSupply: 0,
		publicTreasury: 0,
		totalStaked: 0,
		totalVoted: 0,
		irep: 0,
		rrep: 0,
		glbComRate: 0,
		height: 0,
		stepPrice: 0,
		mainChecked: true,
		subChecked: true,
		restChecked: true,
		blackChecked: false,
		allPrep: [],
		blackPrep: [],
		lastBlockPrepName: "",
		search: '',
		loading: true
	}

	checkedState = {}
	getAdditionalData=async method=>{
		const network=await getTrackerApiUrl()
		const address=GetAddressForPrepList[network]
		const params={
			to:address,
			dataType:'call',
			data:{
				method:method
			}
		}
		const response = await icxCall(params);
		return response && response.data&&response.data.result?response.data.result:method==='get_PReps'?[]:{}
	}
	governanceData=[];
	sponsorData={}
	async componentDidMount() {
		this.governanceData = await this.getAdditionalData('get_PReps');
		this.sponsorData = await this.getAdditionalData('get_sponsors_record')
		// const { tmainInfo } = await getMainInfo()
		const { preps, totalStake: totalStakedLoop, totalDelegated: totalVotedLoop } = await getPReps()		
		const { variable } = await getIISSInfo()
		const lastBlock = await getLastBlock()
		const stepPriceLoop = await getStepPrice()
		const _allPrep = await prepList()
		const _blackPrep = await prepList(3)

		const  publicTreasury  = 4930167.9322
		const icxSupply = await getTotalSupply()
		const { height, peer_id } = lastBlock || {}
		const allPrep = (_allPrep || []).map(prep => {
			const index = preps.findIndex(p => prep.address === p.address)
			if (index !== -1) {
				prep.stake = IconAmount.of(preps[index].stake || 0x0, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).value.toString(10)
				prep.unstake = IconAmount.of(preps[index].unstake || 0x0, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).value.toString(10)
			}
			prep.balance = Number(prep.balance)
			return prep
		})
		const blackPrep = (_blackPrep || []).map(bp => {
			bp.grade = 3
			bp.status = bp.penaltyStatus
			return bp
		})

		const lastPrepIndex = allPrep.findIndex(prep => prep.address === peer_id)
		const lastBlockPrepName = lastPrepIndex === -1 ? "" : `#${lastPrepIndex+1} ${allPrep[lastPrepIndex].name}`
	
		const totalSupply = Number(icxSupply || 0)
		const totalStaked = !totalStakedLoop ? 0 : IconConverter.toNumber(IconAmount.of(totalStakedLoop || 0x0, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).value.toString(10))
		const totalVoted = !totalVotedLoop ? 0 : IconConverter.toNumber(IconAmount.of(totalVotedLoop || 0x0, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).value.toString(10))
		const irep =  IconConverter.toNumber(convertLoopToIcxDecimal((variable || {}).irep || 0));
		const rrep = IconConverter.toNumber((variable || {}).rrep || 0);
		const glbComRate = ((1 / totalVoted * 100 * 12 * irep / 2) / ((rrep * 3 / 10000) + 1 / totalVoted * 100 * 12 * irep / 2)) * 100;
		const stepPrice = !stepPriceLoop ? 0 : IconAmount.of(stepPriceLoop || 0x0, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).value.toString(10)
		
		this.setState({ 
			loading: false,
			totalSupply, 
			publicTreasury,
			totalStaked,
			totalVoted,
			irep,
			rrep,
			glbComRate,
			height,
			stepPrice,
			allPrep,
			blackPrep,
			lastBlockPrepName
		})
	}

	handleChange = e => {
		const { type, value } = e.target
		switch(type) {
			case 'checkbox':
				if (value === 'main') {
					this.setState({ 
						mainChecked: !this.state.mainChecked,
						blackChecked: false,
					})
				}
				else if (value === 'sub') {
					this.setState({ 
						subChecked: !this.state.subChecked,
						blackChecked: false,
					})
				}
				else if (value === 'rest') {
					this.setState({ 
						restChecked: !this.state.restChecked,
						blackChecked: false,
					})
				}
				else if (value === 'black') {
					if (this.state.blackChecked) {
						this.setState({ 
							blackChecked: false,
							...this.checkedState,
						})	
					}
					else {
						const { 
							mainChecked,
							subChecked,
							restChecked
						} = this.state

						this.checkedState = {
							mainChecked,
							subChecked,
							restChecked
						}

						this.setState({ 
							blackChecked: true,
							mainChecked: false,
							subChecked: false,
							restChecked: false
						})	
					}
				}
				return
			case 'text':
				this.setState({ search: value })
				return
			default:							
		}
	}
	getGovernanceStatus = address=>{
		let result =false;
		this.governanceData.forEach(item=>{
			if(item.address===address){
				result = true;
			}
		})
		return result
	}
	getSponsorCount=address=>{
		return this.sponsorData[address]?parseInt(this.sponsorData[address]):0
	}
	render() {
		console.log(this.state, "lower chart state governance")
		const {
			totalSupply,
			publicTreasury,
			totalStaked,
			totalVoted,
			irep,
			rrep,
			glbComRate,
			height,
			stepPrice,
			allPrep,
			blackPrep,
			lastBlockPrepName,
			search,
			loading,
			mainChecked,
			subChecked,
			restChecked,
			blackChecked
		} = this.state

		const totalStakedRate = !totalSupply ? '-' : totalStaked / totalSupply * 100
		const totalVotedRate = !totalSupply ? '-' : totalVoted / totalSupply * 100
		
		const list = blackChecked ? blackPrep : allPrep.filter(p => {
			return (mainChecked && (p.grade === 0 || p.grade === '0x0')) || (subChecked && (p.grade === 1 || p.grade === '0x1')) || (restChecked && (p.grade === 2 || p.grade === '0x2'))
		})
		console.log(list, "this is list")
		const searched = !search ? list : list.filter(prep => prep.name.toLowerCase().includes(search.toLowerCase().trim()) || prep.address.toLowerCase().includes(search.trim()))

		return (
			<div className="content-wrap governance">
				<div className="screen0">
					{loading && <LoadingComponent height='400px'/>}
					{!loading && <div className="wrap-holder">
						<p className="title">Governance<span onClick={() => {this.props.setPopup({ type: POPUP_TYPE.ABOUT })}}><i className="img"></i>About Governance</span></p>
						<div className="contents">
							<div className="graph">
								<div className="txt"><span><i className="img"></i>Total Supply : {convertNumberToText(totalSupply, 0)}</span><span><i className="img"></i>Staked : {convertNumberToText(totalStaked, 0)}</span><span><i className="img"></i>Voted : {convertNumberToText(totalVoted, 0)}</span></div>
								<div className="bar-group">
									<div className="bar" style={{ width: "100%" }}><span>100<em>%</em></span></div>
									<div className={`bar${totalStakedRate - totalVotedRate < 11 ? ' small' : ''}`} style={{ width: `${totalStakedRate}%` }}>{totalStakedRate > 8 && <span>{totalStakedRate.toFixed(2)}<em>%</em></span>}</div>
									<div className="bar" style={{ width: `${totalVotedRate}%` }}>{totalVotedRate > 8 && <span>{totalVotedRate.toFixed(2)}<em>%</em></span>}</div>
								</div>
								<div className="total">
									<p>Public Treasury <em>(ICX)</em></p>
									<p><span>{convertNumberToText(publicTreasury, 4)}</span></p>
								</div>
							</div>
							<ul>
								<li>
									<div>
										<p>Global Commission Rate <em>(%)</em> <i className="img screamer" onClick={() => {this.props.setPopup({ type: POPUP_TYPE.COMMISSION })}}></i></p>
										<p><span>{convertNumberToText(glbComRate, 4)}</span></p>
									</div>
								</li>
								<li>
									<div>
										<p>Global i_rep <em>(ICX)</em></p>
										<p><span>{convertNumberToText(irep, 4)}</span></p>
									</div>
								</li>
								<li>
									<div>
										<p>Reward Rate <em>(%)</em></p>
										<p><span>{convertNumberToText((rrep / 100) * 3, 4)}</span></p>
									</div>
								</li>
								<li>
									<div>
										<p>Step Price <em>(ICX)</em></p>
										<p><span>{numberWithCommas(stepPrice)}</span></p>
									</div>
								</li>
								<li>
									<div>
										<p>Last Block{lastBlockPrepName && <span className='last-block-name-tag'>{lastBlockPrepName}</span>}</p>
										<p><span>{numberWithCommas(IconConverter.toNumber(height))}</span></p>
									</div>
								</li>
							</ul>
						</div>
					</div>}
				</div>
				<div className="screen2">
					{loading && <LoadingComponent height='500px'/>}
					{!loading && <div className="wrap-holder">
						<div className="contents">
							<div className="search-group">
								<span>
									<input id="cbox-01" className="cbox-type" type="checkbox" name="main" value="main" checked={mainChecked} onChange={this.handleChange}/>
									<label htmlFor="cbox-01" className="label _img">Main P-Rep ({allPrep.filter(p => p.grade === 0 || p.grade === '0x0').length})</label>
								</span>						
								<span>
									<input id="cbox-02" className="cbox-type" type="checkbox" name="sub" value='sub' checked={subChecked} onChange={this.handleChange}/>
									<label htmlFor="cbox-02" className="label _img">Sub P-Rep ({allPrep.filter(p => p.grade === 1 || p.grade === '0x1').length})</label>
								</span>						
								<span>
									<input id="cbox-03" className="cbox-type" type="checkbox" name="rest" value='rest' checked={restChecked} onChange={this.handleChange}/>
									<label htmlFor="cbox-03" className="label _img">Candidate ({allPrep.filter(p => p.grade === 2 || p.grade === '0x2').length})</label>
								</span>
								<span className="blacklist">
									<input id="cbox-04" className="cbox-type" type="checkbox" name="black" value='black' checked={blackChecked} onChange={this.handleChange}/>
									{/* <label htmlFor="cbox-04" className="label _img">Unregistered ({blackPrep.length})</label>									 */}
									<label htmlFor="cbox-04" className="label _img">Unregistered</label>									
								</span>
								<span className="search on"><input type="text" className="txt-type-search modified" placeholder="P-Rep name / Address" value={search} onChange={this.handleChange}/><i className="img"></i></span>
							</div>
							<div className="table-box">
								<table className="table-typeP">
									<colgroup>
										<col className="add" />
										<col className="rank" />
										<col />
										<col />
										<col />
										<col />
										<col />
										<col />
										<col />
										<col />
									</colgroup>
									<thead>
										<tr>
											<th className="add">Add</th>
											<th className="rank"><span className="sort">Rank ↓</span></th>
											<th>Name</th>
											<th>Governance<i style={{marginLeft:'5px'}} className='img screamer' onClick={()=>{
												this.props.setPopup({
													type:POPUP_TYPE.GOVERNANCE
												})
											}}></i></th>
											<th><span>Sponsored<br/>Projects</span><i style={{marginLeft:'5px'}} className="img screamer" onClick={()=>{
												this.props.setPopup({type:POPUP_TYPE.SPONSOR})
											}}></i></th>
											<th>Productivity<br/><em>Produced /<br/>(Produced + Missed)</em></th>
											{!blackChecked && <th>Staked</th>}
											{!blackChecked && <th>Total Votes</th>}
										</tr>
									</thead>
									<tbody>
										{console.log(searched, "what is searched")}
										{searched.map((prep, index) => (
											<TableRow 
											governanceStatus={this.getGovernanceStatus(prep.address)}
											sponsorCount={this.getSponsorCount(prep.address)} 
											lastBlockHeight={height}
												key={index}
												index={index}
												prep={prep} 
												totalStaked={totalStaked} 
												totalVoted={totalVoted}
												rrep={rrep}
												history={this.props.history}
												blackChecked={blackChecked}
											/>
										))}
									</tbody>
								</table>
							</div>
							<p className='prep-causion'>
								The detailed informations of P-Rep will be updated every UTC 00:00, UTC 06:00, UTC 12:00, and UTC 18:00. Please check the URL of the submitted JSON file for each P-Rep.
							</p>
						</div>
					</div>}
				</div>
			</div>
		)
	}
}

class TableRow extends Component {

	state = {
		logoError: false,
	}

	getBadge = (grade, active, status) => {
		const className = (active ? 'prep-tag' : 'prep-tag off')

		switch(grade) {
			case 0:
			case '0x0':
				return <span className={className}><i></i>Main P-Rep</span>			
			case 1:
			case '0x1':
				return <span className={className}><i></i>Sub P-Rep</span>
			case 2:
			case '0x2':
				return <span className={className}><i></i>Candidate</span>
			case 3:
			case '0x3':
				return <span className={'prep-tag'}>{status === 2 ? 'Disqualified' : 'Unregistered'}</span>
			default:
				return null		
		}
	}

	goAddress = address => {
		this.props.history.push('/address/' + address)
	}

	onError = () => {
		this.setState({ logoError: true })
	}

	render() {
		const {
			logoError
		} = this.state

		const {
			totalVoted,
			// rrep,
			prep,
			// lastBlockHeight,
			blackChecked,
			index,
			governanceStatus,
			sponsorCount
		} = this.props

		const { 
			name,
			address,
			grade,
			totalBlocks,
			validatedBlocks,
			stake,
			delegated,
			// irep,
			// irepUpdatedBlockHeight,
			active,
			logo,
			// balance,
			// unstake,
			status
		} = prep

		// const sugComRate = ( (1 / totalVoted * 100 * 12 * irep / 2) / ((rrep * 3 / 10000) + 1 / totalVoted * 100 * 12 * irep / 2) ) * 100;
		const productivity = !totalBlocks || Number(totalBlocks) === 0 ? 'None' : (Number(validatedBlocks) === 0 ? '0.00%' : `${(Number(validatedBlocks) / Number(totalBlocks) * 100).toFixed(2)}%`)
		const prepStaked = IconConverter.toNumber(stake || 0)
		const prepVoted = IconConverter.toNumber(delegated || 0)
		// const totalBalcne = balance + prepStaked + prepUnstaked
		// const stakedRate = !totalBalcne ? 0 : prepStaked / totalBalcne * 100
		const votedRate = !totalVoted ? 0 : prepVoted / totalVoted * 100
		const badge = this.getBadge(grade, active, status)
		const rank = index + 1

		return(
			<tr>
				<td className="rank"><span>{rank || '-'}</span></td>
				<td className={(grade > 2 || grade === '0x3') ? 'black' : 'on'}>
					<ul>
						<li>{badge}</li>
						{logo && !logoError && <li><img src={ logo } onError={this.onError} loading="lazy" alt='logo'/></li>}
						<li>
							<span className="ellipsis pointer" onClick={()=>{this.goAddress(address)}}>{name}</span>
							<em className="ellipsis pointer" onClick={()=>{this.goAddress(address)}}>{address}</em>
						</li>
					</ul>
				</td>
				<td>{governanceStatus===true?'YES':'NO'}</td>
				<td>{sponsorCount}</td>
				<td><span>{productivity}</span><em>{numberWithCommas(Number(validatedBlocks))} / {numberWithCommas(Number(totalBlocks))}</em></td>
				{/* <td><span>{convertNumberToText(sugComRate, 2)}</span></td> */}
				{/* <td><span>{calcFromLastBlock(lastBlockHeight - irepUpdatedBlockHeight)}</span></td> */}
				{/* <td><span>{stakedRate.toFixed(1)}%</span><em>{convertNumberToText(prepStaked, 4)}</em></td> */}
				{!blackChecked && <td><span>{convertNumberToText(prepStaked, 4)}</span></td>}
				{!blackChecked && <td><span>{votedRate.toFixed(1)}%</span><em>{convertNumberToText(prepVoted, 4)}</em></td>}
			</tr>
		)
	}
}

export default withRouter(GovernancePage);
