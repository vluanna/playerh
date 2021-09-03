import React from "react"
import { RemoteConfigConsumer } from '../providers/remoteConfigProvider'

export interface FshareConfigType {
    app_key?: string,
    domain_api_v2?: string,
    app_name?: string
}
export interface ApiConfigType {
    base_url?: string
}

export type RemoteConfigType = {
    fshare_config?: any,
    playerh_api?: any,
}

const withRemoteConfig = (Component) => {
    return (props) => (
        <RemoteConfigConsumer>
            {({ ...remoteConfig }) => <Component remoteConfig={{
                ...remoteConfig
            }} {...props} />}
        </RemoteConfigConsumer>
    )
}

export default withRemoteConfig