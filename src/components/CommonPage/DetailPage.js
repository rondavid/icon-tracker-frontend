import React, { Component } from 'react';
import {
    startsWith,
    findTabIndex,
    noSpaceLowerCase,
    isHxAddress
} from 'utils/utils'
import {
    NotFoundPage,
} from 'components';

class DetailPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            on: 0
        }
    }

    componentWillMount() {
        this.setInitialData(this.props.url)
    }

    componentWillReceiveProps(nextProps) {
        const { pathname: currentPath } = this.props.url
        const { pathname: nextPath } = nextProps.url
        const { ROUTE } = this.props
        if (currentPath !== nextPath && startsWith(nextPath, ROUTE)) {
            this.setInitialData(nextProps.url)
            return
        }
        else {
            const { hash: currentHash } = this.props.url
            const { hash: nextHash } = nextProps.url
            if (currentHash !== nextHash) {
                const { TABS } = this.props
                this.setTab(findTabIndex(TABS, nextHash))
            }    
        }
    }

    setInitialData = (url) => {
        const query = url.pathname.split("/")[2]
        if (query) {
            const { TABS } = this.props
            this.props.getInfo(query)
            this.setTab(findTabIndex(TABS, url.hash), query)
        }
    }

    setTab = (index, query) => {
        const _index = index !== -1 ? index : 0
        this.setState({ on: _index },
            () => {
                this.setList(this.props.getList[_index], query)
            }
        )
    }

    setList = (getListFunc, query) => {
        const _query = query ? query : this.props.url.pathname.split("/")[2]
        if (typeof getListFunc === 'function') {
            getListFunc(_query)
        }
    }

    changeTab = (index) => {
        const { TABS, url } = this.props
        console.log(TABS)
        const { pathname } = url
        this.props.history.push(`${pathname}#${noSpaceLowerCase(TABS[index])}`);
    }

    render() {
        const { loading, error } = this.props
        const isNotFoundPage = !loading && error !== "" && !isHxAddress(error)
        
        const Content = () => {
            if (isNotFoundPage) {
                return <NotFoundPage error={error}/>
            }
            else {
                const { InfoComponent, TabsComponent } = this.props
                return (
                    <div className="content-wrap">
                        <InfoComponent {...this.props}/>
                        <TabsComponent {...this.props} {...this.state} changeTab={this.changeTab}/>
                    </div>
                )
            }
        }
        return Content();
    }
}

export default DetailPage;
