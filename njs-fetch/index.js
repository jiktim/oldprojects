import url from 'url'
import http from 'http'
import https from 'https'

const fetch = (inUrl, pData) => {
    // Parses the URL
    let reqUrl = ''
    if (typeof inUrl !== 'object') {
        reqUrl = url.parse(inUrl)
    }
    let client
    let reqfunc
    // Checks for a valid HTTP address
    /*eslint-disable */
    if (reqUrl.hostname && reqUrl.protocol.startsWith('http') || typeof inUrl === 'object' && inUrl.method) {
	/* eslint-enable */

        /*eslint-disable */
	// if http
        if (reqUrl.protocol == 'http:' || inUrl.port != 443 || inUrl.protocol != "https") {
            client = http
        } else {
	    // https
            client = https
        }
	
	/* eslint-enable */
        return new Promise((output) => {
            if (typeof inUrl === 'object') {
                reqfunc = client.request
            } else {
                reqfunc = client.get
            }
	    // pulls a git request
            const req = reqfunc(inUrl, (hand) => {
		// makes output thing
                let data = ''
		// when recieve data
                hand.on('data', (chunk) => {
		// add output
                    data += chunk
                })

                hand.on('end', () => {
                    // hacky as shit way to make a request object but it works soo ¯\_(ツ)_/¯
                    output({
                        headers: hand.headers,
                        status: hand.statusCode,
                        statusMessage: hand.statusMessage,
                        body: { text: data, json: JSON.parse(data) || {} },
                    })
                })
	    // ono error
            }).on('error', (err) => {
                throw err
            })
            if (pData) {
                req.write(pData)
            }
            req.end()
        })
    } 
    // or else
    throw Error('invalid url')
}

export default fetch
