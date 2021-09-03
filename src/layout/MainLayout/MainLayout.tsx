// @ts-nocheck
import React from 'react'
import authProviderFactory from '../../providers/authProvider';
import dataProviderFactory from '../../providers/dataProvider';
import withRemoteConfig, { RemoteConfigType } from '../../hocs/withRemoteConfig';
import { Admin, Resource } from 'react-admin';
import { Star } from '@material-ui/icons'

// import Dashboard from '../../pages/Dashboard';
import Login from '../../pages/Login';
import FavoriteList from '../../pages/favorites/FavoriteList';
import PlayOverview from '../../components/PlayOverview';
// import clsx from 'clsx';
import Theme from '../../constants/Theme';

import './MainLayout.scss'

type MainLayoutProps = {
    remoteConfig?: RemoteConfigType,
}


const MainLayout = ({ remoteConfig = {} }: MainLayoutProps): JSX.Element => {

    return (
        <Admin
            dataProvider={dataProviderFactory(remoteConfig)}
            authProvider={authProviderFactory(remoteConfig)}
            loginPage={Login}
            theme={Theme}
        // dashboard={Dashboard}
        >
            <Resource name="favorites" list={FavoriteList} show={PlayOverview} icon={Star} />
            {/* {children} */}
        </Admin>
    )
}

export default withRemoteConfig(MainLayout)