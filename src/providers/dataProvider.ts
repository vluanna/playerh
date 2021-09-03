import {
    DataProvider,
} from 'react-admin';
import { LOCAL_STORAGE_KEY } from "../constants/Defined";
import { RemoteConfigType } from "../hocs/withRemoteConfig"
import LocalStorage from "../utils/localStorage";
import axios from 'axios';

const dataProviderFactory = ({ fshare_config, playerh_api = {} }: RemoteConfigType): DataProvider => {

    const { app_key, domain_api_v2, app_name } = fshare_config;
    const { base_url } = playerh_api;
    const baseURL = base_url || process.env.REACT_APP_API_BASE_URL



    const getRequestInstance = (options?) => {
        const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
        return axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                'X-Base-Url': domain_api_v2,
                'X-App-Name': app_name,
                'X-Session-Id': `session_id=${auth?.session_id}`,
                ...(options?.headers || {}),
            },
        })
    }

    const fileHandlers = {
        getOne: (params) => {
            console.log('=====> Favorite GetOne', params)
            const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
            return getRequestInstance({
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            }).post('/api/session/download', {
                "zipflag": 0,
                "url": `https://www.fshare.vn/file/${params.id}`,
                "password": params.password,
                "token": auth?.token
            }).then(resp => ({ data: { ...params, location: resp.data.location } }))
        },
    }

    const dataHandlers = {
        favorites: {
            ...fileHandlers,
            getList: (params) => {
                return getRequestInstance().get('/api/fileops/listFavorite').then(response => ({
                    data: (response.data || []).map(item => Object.assign(item, { id: item.linkcode })),
                    total: response.data?.length || 0
                }))
            },
        }
    }

    const getHandler = (resource, name) => {
        return dataHandlers[resource] && typeof dataHandlers[resource][name] === 'function'
            ? dataHandlers[resource][name]
            : (...params) => console.log('Mision Handler for:', resource, name, ...params)
    }

    const parseHandlerFromKeys = (keys): DataProvider => keys.reduce((result: DataProvider, name: string) => {
        result[name] = (resource, ...restParams) => getHandler(resource, name)(...restParams);
        return result
    }, {})

    return parseHandlerFromKeys(['getList', 'getOne'])

}

export default dataProviderFactory