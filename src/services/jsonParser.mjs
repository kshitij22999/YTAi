import YTcred from "../models/YTcred.mjs"

const parser = function (input) {
    const YTcreds = new YTcred();
    YTcreds.username = "kshitij"
    YTcreds.client_id = input.web.client_id;
    YTcreds.client_secret = input.web.client_secret;
    return YTcreds
};

export default parser;