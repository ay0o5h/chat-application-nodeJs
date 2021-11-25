module.exports = {
    errRes :(res, err, code = 400) => {
        if (typeof err == "object" && typeof err.message != "undefined") {
            err = err.message;
        } else if (typeof err == "string") {
            let obj = {};
            obj[key] = [err];
            err = obj;
        }
        if (typeof code !== "undefined") res.statusCode = code;
        console.log(typeof err);
        return res.json({ status: false, errMsg: err });
    },

    /**
     * ReS
     * @param body
     */
    okRes : (res, data, code = 200) => {
        // Success Web Response
        let sendData = { status: true, errMsg: "" };

        if (typeof data == "object") {
            sendData = Object.assign(data, sendData); //merge the objects
        }
        if (typeof code !== "undefined") res.statusCode = code;
        return res.json(sendData);
    }
}

// const getOtp = () => Math.floor(1000 + Math.random() * 9000);


