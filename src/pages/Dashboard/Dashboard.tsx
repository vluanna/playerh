import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import List from '../../components/List'
import Search from '../../components/Search'

import Navigation, { VerticalList, HorizontalList } from 'react-key-navigation';

// import clsx from 'clsx';

import './Dashboard.scss'

type DashboardProps = {
    children?: JSX.Element,
    list?: string[],
}


const Dashboard = ({ children, list = ["Title 1", "Title 2", "Title 3", "Title 4", 'Title 5', 'Title 6', 'Title 7'] }: DashboardProps): JSX.Element => {

    const [active, setActive] = useState(-1)

    const onBlurList = () => {
        setActive(-1)
    }

    const changeFocusTo = (index) => {
        setActive(index);
    }

    return (
        <div className="dashboard-wrapper">
            <Navigation>
                <div>
                    <HorizontalList>
                        <Sidebar />
                        <div className="mainbox">
                            <VerticalList navDefault>
                                <Search />
                                <VerticalList id="content" onBlur={() => onBlurList()}>
                                    {list.map((list, i) =>
                                        <List key={i} title={list}
                                            onFocus={() => changeFocusTo(i)}
                                            visible={active !== null ? i >= active : true}
                                        />
                                    )}
                                </VerticalList>
                            </VerticalList>
                        </div>
                    </HorizontalList>
                </div>
            </Navigation>
        </div>
    )
}

export default Dashboard