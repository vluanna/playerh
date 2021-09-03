import { AuthProvider } from "react-admin";
import { LOCAL_STORAGE_KEY } from "../constants/Defined";
import { RemoteConfigType } from "../hocs/withRemoteConfig"
import LocalStorage from "../utils/localStorage";

const authProviderFactory = ({ fshare_config, playerh_api = {} }: RemoteConfigType): AuthProvider => {

    const { app_key, domain_api_v2, app_name } = fshare_config;
    const { base_url } = playerh_api;
    const baseURL = base_url || process.env.REACT_APP_API_BASE_URL

    const headers = {
        'Content-Type': 'application/json',
        'X-Base-Url': domain_api_v2,
        'X-App-Name': app_name,
    }


    const authProvider = {
        login: ({ username, password }) => {
            const request = new Request(`${baseURL}/api/user/login`, {
                method: 'POST',
                body: JSON.stringify({ user_email: username, password, app_key }),
                headers: new Headers(headers),
            });
            return fetch(request)
                .then(response => {
                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(auth => {
                    LocalStorage.set(LOCAL_STORAGE_KEY.AUTH, auth);
                })
                .catch(() => {
                    throw new Error('Network error')
                });
        },
        checkError: (error) => {
            const status = error.status;
            if (status === 401 || status === 403) {
                LocalStorage.remove(LOCAL_STORAGE_KEY.AUTH);
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        checkAuth: () => LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
            ? Promise.resolve()
            : Promise.reject({ redirectTo: '/no-access' }),
        logout: () => {
            LocalStorage.remove(LOCAL_STORAGE_KEY.AUTH);
            const request = new Request(`${baseURL}/api/user/logout`, {
                method: 'GET',
            });
            return new Promise<void>((resolve) => {
                fetch(request)
                    .finally(() => {
                        LocalStorage.remove(LOCAL_STORAGE_KEY.AUTH);
                        resolve()
                    })
            })

        },
        getIdentity: (): Promise<any> => {
            const auth = LocalStorage.get(LOCAL_STORAGE_KEY.AUTH)
            if (!auth) return Promise.reject()
            const request = new Request(`${baseURL}/api/user/get`, {
                method: 'GET',
                headers: new Headers(Object.assign(headers, { 'x-session-id': `session_id=${auth.session_id}` })),
            });
            return new Promise((resolve, reject) => {
                fetch(request)
                    .then(response => {
                        if (response.status < 200 || response.status >= 300) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(user => {
                        LocalStorage.set(LOCAL_STORAGE_KEY.USER, user);
                        const userInfo = {
                            id: user.id,
                            fullName: user.fullname || user.name,
                            avatar: user.avatar
                        }
                        resolve(userInfo)
                    })
                    .catch(reject);
            })
        },
        // // authorization
        getPermissions: () => {
            const user = LocalStorage.get(LOCAL_STORAGE_KEY.USER);
            return user ? Promise.resolve(['super_admin']) : Promise.reject();
        }
    }

    return authProvider
}




export default authProviderFactory