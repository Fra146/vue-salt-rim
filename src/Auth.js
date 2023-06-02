import ApiRequests from "./ApiRequests";

class Auth {
    static rememberUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static rememberToken(token) {
        localStorage.setItem('user_token', token);
    }

    static forgetUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('user_token');
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    static isAdmin() {
        return this.getUser().is_admin;
    }

    static getUserSearchSettings() {
        const user = this.getUser();

        let searchHost = window.srConfig.MEILISEARCH_URL;
        if (!searchHost) {
            searchHost = user.search_host;
        }

        if (!(searchHost.startsWith('http://') || searchHost.startsWith('https://'))) {
            if (!searchHost.startsWith('/')) {
                searchHost = '/' + searchHost;
            }

            searchHost = window.location.origin + searchHost;
        }

        return {
            host: searchHost,
            key: user.search_api_key,
        };
    }

    static async refreshUser() {
        const user = await ApiRequests.fetchUser();

        localStorage.setItem('user', JSON.stringify(user));
    }

    static async isLoggedIn() {
        if (window.srConfig.DISABLE_LOGIN === true) {
            return true;
        }

        try {
            const user = await ApiRequests.fetchUser();

            this.rememberUser(user)
        } catch (e) {
            this.forgetUser()
            return false;
        }

        return true;
    }
}

export default Auth;
