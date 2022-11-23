const fetch = require("node-fetch");
const chalk = require("chalk");
const fs = require("fs");
const { readFileSync } = require('fs');
const { exit } = require("process");
const { resolve } = require("path");
const { reject, forEach } = require("lodash");
const { Headers } = require('node-fetch');
const TikAPI = require('tikapi').default;

const api = TikAPI('NGKr2sJ6NqpTm6shMBwNt3Il5nQyq1s1CAzqmv8sgAa3QKC7');

//adding useragent to avoid ip bans
const headers = new Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');

// To shuffle array
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const getListOfLinksFromTikTok = async () => {
    try {
        const idArr = [];
        let response = await api.public.posts({
            secUid: "MS4wLjABAAAATjb2XRpt183Q1Z1j1dCcOqjvuNMUA23aTkHq5GnZwebGJyHtGZLfqdc9uc0otHFm",
            count: 3
        });
        response.json.itemList.forEach((element) => {
            const newStr = "@" + element.author.uniqueId + "/video/" + element.id
            idArr.push(newStr);
        })
        let shuffledArr = shuffle(idArr);
        return shuffle(shuffledArr);
    }
    catch(err) {
        console.log(err?.statusCode, err?.message, err?.json)
    }
}


const downloadMediaFromList = async (list) => {
    const folder = "videos/"
    list.forEach((item) => {
        const fileName = `${item.id}.mp4`
        const downloadFile = fetch(item.url)
        const file = fs.createWriteStream(folder + fileName)
        
        console.log(chalk.green(`[+] Downloading ${fileName}`))

        downloadFile.then(res => {
            res.body.pipe(file)
            file.on("finish", () => {
                file.close()
                resolve()
            });
            file.on("error", (err) => reject(err));
        });
    });
}

const getVideoNoWM = async (url) => {
    const idVideo = await getIdVideo(url)
    const API_URL = `https://api19-core-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}&version_code=262&app_name=musical_ly&channel=App&device_id=null&os_version=14.4.2&device_platform=iphone&device_type=iPhone9`;
    const request = await fetch(API_URL, {
        method: "GET",
        headers : headers
    });
    const body = await request.text();
                try {
                 var res = JSON.parse(body);
                } catch (err) {
                    console.error("Error:", err);
                    console.error("Response body:", body);
                }
                const urlMedia = res.aweme_list[0].video.play_addr.url_list[0]
                const data = {
                    url: urlMedia,
                    id: idVideo
                }
                return data
}

const getRedirectUrl = async (url) => {
    if(url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")) {
        url = await fetch(url, {
            redirect: "follow",
            follow: 10,
        });
        url = url.url;
        console.log(chalk.green("[*] Redirecting to: " + url));
    }
    return url;
}

const getIdVideo = (url) => {
    const matching = url.includes("/video/")
    if(!matching){
        console.log(chalk.red("[X] Error: URL not found"));
        exit();
    }
    const idVideo = url.substring(url.indexOf("/video/") + 7, url.length);
    return (idVideo.length > 19) ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo;
}

(async () => {
    var listVideo = [];
    var listMedia = [];
    let urlInputs = await getListOfLinksFromTikTok();
    for (let i = 0; i < urlInputs.length; i++) {
        const url = await getRedirectUrl(urlInputs[i]);
        listVideo.push(url);
    }

    for(let i = 0; i < listVideo.length; i++){
        var data = await getVideoNoWM(listVideo[i]);
        listMedia.push(data);
    }

    downloadMediaFromList(listMedia)
        .then(() => {
            console.log(chalk.green("[+] Downloaded successfully"));
        })
        .catch(err => {
            console.log(chalk.red("[X] Error: " + err));
    });
    
})();