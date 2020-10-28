var http = require("https");
var Nominatim = require("nominatim-browser");
var country = require('countryjs');
var result;

// Dominos constructor
class Dominos {
  constructor() {
    let ugly = "";
  }

  // Geocode
  async iThinkYouAutistBro(City, Country) {
    await Nominatim.geocode({
        city: City,
        country: Country
      }).then((results) => {
        result = [results[0].lat, results[0].lon];
      })
      .catch((error) => {
        console.error(error);
      });
    return result;
  }

  // Generates a Dominos UUID
  async generateDominosUUID() {
    var t = new Uint8Array(16);
    t = require("crypto").randomBytes(16).toJSON().data;
    t[6] = t[6] & 15 | 64;
    t[8] = t[8] & 63 | 128;
    var otherArrayLol = [];
    for (var yetanotherindex = 0; yetanotherindex < 256; ++yetanotherindex) {
      otherArrayLol[yetanotherindex] = (yetanotherindex + 256).toString(16).substr(1);
    }
    var increment = 0;
    var n = otherArrayLol;
    return [n[t[increment++]], n[t[increment++]], n[t[increment++]], n[t[increment++]], "-", n[t[increment++]], n[t[increment++]], "-", n[t[increment++]], n[t[increment++]], "-", n[t[increment++]], n[t[increment++]], "-", n[t[increment++]], n[t[increment++]], n[t[increment++]], n[t[increment++]], n[t[increment++]], n[t[increment++]]].join("");
  }

  async getMenu(storeID, Country) {
    var dominosuuid = await this.generateDominosUUID();
    var options = {
      "method": "GET",
      "hostname": "order.golo02.dominos.com",
      "port": null,
      // #BlameFireC
      // cheater "Resolved"
      "path": `/power/store/${storeID}/menu?lang=en&structured=true`,
      "headers": {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "DPZ-Language": "en",
        "dpz-market": Country.toUpperCase(),
        "x-dpz-d": dominosuuid,
        "market": Country.toUpperCase(),
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
        "Sec-Fetch-Mode": "cors",
        "Referer": "https://order.golo02.dominos.com/assets/build/xdomain/proxy.html",
        "Pragma": "no-cache",
      }
    }; // :'(

    return await new Promise((rs, rj) => {
      const r = http.request(options, (res) => {
        const buf = [];
        res.on("data", (chunk) => {
          buf.push(chunk);
        });

        res.on("end", () => {
          rs(Buffer.concat(buf).toString());
        });
        res.on("error", (e) => rj(e));
      });
      r.end();
    });
  }

  // Locates a store.
  async locateStores(Country, CountryCode) {
    let iamNotAUTIST = country.capital(CountryCode);
    let result = await this.iThinkYouAutistBro(iamNotAUTIST, Country);
    var smoke = `${result[1]}0000000315`;
    // Bypass Dominos's awful proxy
    var dominosuuid = await this.generateDominosUUID();
    var options = {
      "method": "GET",
      "hostname": "order.golo02.dominos.com",
      "port": null,
      "path": `/store-locator-international/locate/store?regionCode=${CountryCode}&latitude=${result[0]}&longitude=${smoke}`,
      "headers": {
        "accept": "application/vnd.com.dominos.ecommerce.store-locator.response+json;version=1.2",
        "dpz-market": Country.toUpperCase(),
        "x-dpz-d": dominosuuid,
        "market": Country.toUpperCase(),
        "dpz-language": "en",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
        "referer": "https://order.golo02.dominos.com/assets/build/xdomain/proxy.html",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": "DPZUser=true; DPZUserFirstVisit=true; raygun4js-userid=186365b5-b270-f5f6-f0f3-6e8e8a3a696b; AMCVS_1F046398524DCCF80A490D44%40AdobeOrg=1; AMCV_1F046398524DCCF80A490D44%40AdobeOrg=-1712354808%7CMCIDTS%7C18124%7CMCMID%7C88621470558671910775612535609629452908%7CMCAID%7CNONE%7CMCOPTOUT-1565889380s%7CNONE%7CvVersion%7C4.3.0; s_cc=true; s_sq=%5B%5BB%5D%5D; JSESSIONID=671FDEA94EAAE37AB51E1E946A995CC2; utag_main=v_id:016c95d9d4d80001c19be721543d03072002106a0086e$_sn:2$_ss:1$_st:1565888452668$vapi_domain:dominos.com$ses_id:1565886652668%3Bexp-session$_pn:1%3Bexp-session; DPZUser=true; DPZUserFirstVisit=true; raygun4js-userid=186365b5-b270-f5f6-f0f3-6e8e8a3a696b; AMCVS_1F046398524DCCF80A490D44%40AdobeOrg=1; AMCV_1F046398524DCCF80A490D44%40AdobeOrg=-1712354808%7CMCIDTS%7C18124%7CMCMID%7C88621470558671910775612535609629452908%7CMCAID%7CNONE%7CMCOPTOUT-1565889380s%7CNONE%7CvVersion%7C4.3.0; s_cc=true; s_sq=%5B%5BB%5D%5D; JSESSIONID=671FDEA94EAAE37AB51E1E946A995CC2; utag_main=v_id:016c95d9d4d80001c19be721543d03072002106a0086e$_sn:2$_ss:1$_st:1565888452668$vapi_domain:dominos.com$ses_id:1565886652668%3Bexp-session$_pn:1%3Bexp-session",
        "cache-control": "no-cache"
      }
    };
    // Sends data
    return await new Promise((rs, rj) => {
      const r = http.request(options, (res) => {
        const buf = [];
        res.on("data", (chunk) => {
          buf.push(chunk);
        });

        res.on("end", () => {
          rs(Buffer.concat(buf).toString());
        });
        res.on("error", (e) => rj(e));
      });
      r.end();
    });
  }

  // Locates store
  async locateStoreByCity(City, Country, CountryCode) {
    let vladim;
    let vladims = [];
    let bro = await this.locateStores(Country, CountryCode).then(vadim => {
      console.log(vadim);
      vladim = JSON.parse(vadim);
      console.log(vladim);
      vladim.Stores.forEach(v => {
        if (v.City) {
          console.log(v.City);
          console.log(v.City.toLowerCase() == City.toLowerCase());
          if (v.City.toLowerCase() == City.toLowerCase()) vladims.push(v);
        }
      });
      // log
      console.log(vladims);
    });
    return vladims;
  }
}

module.exports = Dominos;
