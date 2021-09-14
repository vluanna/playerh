import {
    DataProvider,
} from 'react-admin';
import { LOCAL_STORAGE_KEY } from "../constants/Defined";
import { RemoteConfigType } from "../hocs/withRemoteConfig"
import LocalStorage from "../utils/localStorage";
import axios from 'axios';

const dataProviderFactory = ({ fshare_config, playerh_api = {} }: RemoteConfigType): DataProvider => {

    const { domain_api_v2, app_name, app_key } = fshare_config;
    const { base_url } = playerh_api;
    const baseURL = base_url || process.env.REACT_APP_API_BASE_URL
    // const baseURL = process.env.REACT_APP_API_BASE_URL



    const getRequestInstance = (options?) => {
        const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
        const instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                'X-Base-Url': domain_api_v2,
                'X-App-Name': app_name,
                // 'X-Session-Id': `session_id=${auth?.session_id}`,
                ...(options?.headers || {}),
            },
        })
        const checkRefreshToken = async (response) => {
            const originalConfig = response.config;
            if (originalConfig?.url !== "/api/user/login") {
                // Access Token was expired
                if (response.status === 201 && response.data.msg === 'Not logged in yet!' && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const rs = await instance.post("/api/user/refreshToken", {
                            token: auth.token, app_key
                        });
                        const { token, session_id } = rs.data;
                        LocalStorage.set(LOCAL_STORAGE_KEY.AUTH, Object.assign(auth, { token, session_id }))

                        return instance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }

            return Promise.resolve(response);
        }
        instance.interceptors.request.use(
            (config) => {
                config.headers["X-Session-Id"] = `session_id=${auth?.session_id}`; // for Node.js Express back-end
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        if (auth && auth.token && auth.session_id) {
            instance.interceptors.response.use(
                async (res) => {
                    return await checkRefreshToken(res)
                },
                (err) => Promise.reject(err)
            );
        }
        return instance
    }

    const fileHandlers = {
        download: {
            getOne: (params) => {
                const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
                return getRequestInstance({
                    headers: {
                        Authorization: `Bearer ${auth?.token}`
                    }
                }).post('/api/session/download', {
                    "zipflag": 0,
                    "url": `https://www.fshare.vn/file/${params.linkcode}`,
                    "password": params.password,
                    "token": auth?.token
                }).then(resp => ({ data: { ...params, location: resp.data.location } }))
            }
        },
    }

    const dataHandlers = {
        ...fileHandlers,
        favorites: {
            getList: (params) => {
                return getRequestInstance().get('/api/fileops/listFavorite').then(response => ({
                    data: (response?.data || []),
                    total: response?.data?.length || 0
                }))
            },
            delete: ({ id, previousData }) => {
                const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
                return getRequestInstance().post('/api/fileops/ChangeFavorite', {
                    items: [previousData.linkcode],
                    status: 0,
                    token: auth?.token
                }).then(response => ({ data: Object.assign(previousData, response?.data || {}) }))
            },
            deleteMany: ({ ids }) => {
                const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
                return getRequestInstance().post('/api/fileops/ChangeFavorite', {
                    items: ids,
                    status: 0,
                    token: auth?.token
                }).then(response => response?.data)
            },
        },
        subtitles: {
            getList: (params) => {
                return axios.post(`${baseURL}/subtitle/search`, params).then(response => ({
                    data: (response?.data?.data || []),
                    total: response?.data?.totalCount || 0
                }))
            },
            getOne: (params) => {
                return axios.post(`${baseURL}/subtitle/detail`, { url: params.url, languages: params.languages.join(',') })
                    .then(response => ({ data: response?.data || {} }))
            },
        },
        subtitle_download: {
            getOne: (params) => {
                return axios.post(`${baseURL}/subtitle/download`, { url: params.url }, { responseType: 'blob' })
                    .then(response => {
                        const blob = response.data //new Blob([response.data], { type: 'text/srt' })
                        return { data: Object.assign(params, { blob }) }
                    })
            }
        },
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

    return parseHandlerFromKeys(['getList', 'getOne', 'getMany', 'create', 'update', 'updateMany', 'delete', 'deleteMany'])

}

export default dataProviderFactory