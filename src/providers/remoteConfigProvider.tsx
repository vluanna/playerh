import React, { createContext, useEffect, useState } from 'react';
import { remoteConfig } from '../utils/firebase'
import { getAll, fetchAndActivate } from "firebase/remote-config";
import { CircularProgress } from "@material-ui/core";

const RemoteConfigContext = createContext({});

type RemoteConfigProviderProps = {
    children?: any,
}

const RemoteConfigProvider = ({ children }: RemoteConfigProviderProps): JSX.Element => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        remoteConfig.defaultConfig = {};
        fetchAndActivate(remoteConfig)
            .then(activated => {
                if (!activated) console.log('Config not activated');
                return getAll(remoteConfig);
            })
            .then(remoteConfigs => {
                const newConfigs = {
                    ...remoteConfigs,
                };
                for (const [key, config] of Object.entries(remoteConfigs)) {
                    newConfigs[key] = JSON.parse(config.asString())
                }
                console.log('=====> remoteConfigs', newConfigs)
                setConfig(newConfigs);
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <RemoteConfigContext.Provider value={config} >
            {!loading ? children : <div><CircularProgress /></div>}
        </RemoteConfigContext.Provider>
    );
};

export const RemoteConfigConsumer = RemoteConfigContext.Consumer;

export default RemoteConfigProvider