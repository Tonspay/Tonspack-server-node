const { createClient } = require('redis');
require('dotenv').config()

const BASE_PATH = 'tonspack_'

const client = createClient({
    url: process.env.REDIS_HOST
});

client.on('error', err => console.log('Redis Client Error', err));

async function init() {
    await client.connect();
}

async function setConfig(uid, types, data) {
    var path =BASE_PATH+ uid.toString() + "_config_" + types;
    await client.set(
        path,
        JSON.stringify(data)
    );
}

async function getConfig(uid, types) {
    var path = BASE_PATH+uid.toString() + "_config_" + types;
    const value = await client.get(path);
    try {
        return JSON.parse(value);
    } catch {
        return false
    }
}

async function setStorage(key, value) {
    var path = BASE_PATH+"storage_" + key;
    // console.log(path)
    // console.log(value)
    await client.set(
        path,
        value
    );
}

async function getStorage(key) {
    var path = BASE_PATH+"storage_" + key;
    const value = await client.get(path);
    return value
}
/**
 * Temp data .
 * TODO : auto clean
 */
async function setAction(id, data) {
    var path =BASE_PATH+ id + "_action";
    await client.set(
        path,
        JSON.stringify(data)
    );
}

async function getAction(id, types) {
    var path = BASE_PATH+id + "_action";
    const value = await client.get(path);
    try {
        return JSON.parse(value);
    } catch {
        return false
    }
}

async function delAction(id)
{
    var path = BASE_PATH+id + "_action";
    await client.del(
        path
    );
    return true;
}


/**
 * Temp data for preconnect .
 * TODO : auto clean
 */
async function setPreconnect(id, data) {
    var path =BASE_PATH+ id + "_preconnect";
    await client.set(
        path,
        JSON.stringify(data)
    );
}

async function getPreconnect(id) {
    var path = BASE_PATH+id + "_preconnect";
    const value = await client.get(path);
    try {
        return JSON.parse(value);
    } catch {
        return false
    }
}

async function delPreconnect(id)
{
    var path = BASE_PATH+id + "_preconnect";
    await client.del(
        path
    );
    return true;
}

/**
 * User auth key
 */

async function newUserAuthKey(uid, key) {
    try {
        //Del the old key if exsit
        const verfiy = await verfiUserAuthUid(uid);
        if (verfiy) {
            await client.del(
                BASE_PATH+"auth_user_" + verfiy
            );
        }

        var path = BASE_PATH+"auth_user_" + key;
        await client.set(
            path,
            uid
        );

        var path = BASE_PATH+"auth_user_" + uid;
        await client.set(
            path,
            key
        );
        return key;
    } catch (e) {
        console.error(e)
    }
    return false;
}

async function getUserAuthKey(uid)
{
    try {
        var path = BASE_PATH+"auth_user_" + uid;
        const value = await client.get(path);
        if (value) {
            return value
        }

    } catch (e) {
        console.error(e)
    }
    return false;
}

async function verfiUserAuthKey(key) {
    try {
        var path = BASE_PATH+"auth_user_" + key;
        const value = await client.get(path);
        if (value && Number(value) > 0) {
            return value
        }

    } catch (e) {
        console.error(e)
    }
    return false;
}


async function verfiUserAuthUid(uid) {
    try {
        var path = BASE_PATH+"auth_user_" + uid;
        const value = await client.get(path);
        if (value) {
            return value
        }

    } catch (e) {
        console.error(e)
    }
    return false;
}

module.exports = {
    setConfig,
    getConfig,
    setStorage,
    getStorage,
    init,
    newUserAuthKey,
    verfiUserAuthKey,
    verfiUserAuthUid,
    getUserAuthKey,
    setAction,
    getAction,
    delAction,
    setPreconnect,
    getPreconnect,
    delPreconnect
}