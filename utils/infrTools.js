import { getLocalData } from './localStorage';

async function makeServerCall(path, method, info) {
    let userData = getLocalData();

    let url = `${userData.server_host}/${path}`;

    let requestInit = {
        method: method,
        headers: {
            'Infr-API-Key': userData.api_key,
        },
    };

    if (method === 'POST' || method === 'PUT') {
        requestInit.headers['Content-Type'] = 'application/json';
        requestInit.body = JSON.stringify(info);
    }

    let response = await fetch(url, requestInit);
    return response;
}

function strToBase4(query) {
    return Buffer.from(query).toString('base64');
}

export { makeServerCall, strToBase4 };
