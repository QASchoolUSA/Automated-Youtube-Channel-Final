const TikAPI = require('tikapi').default;
require('dotenv').config()
const chalk = require("chalk");
const log = console.log;

const api = TikAPI(process.env.TIKAPITOKEN);
let usernameList = process.env.USERNAME_LIST.split(",");

/*
* Function to shuffle array, to be able to return random index values.
*/
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Shuffle Username List
usernameList = shuffle(usernameList);

/*
* Get SecUID to the specific user's feed.
*/
const getUsersSecUid = async (username = usernameList[0]) => {
    try {
        let response = await api.public.check({
            username: username
        });
        log(chalk.green(`SecUID for user [@${username}] - ${response.json.userInfo.user.secUid}`));
        return response.json.userInfo.user.secUid;
    } catch (err) {
        console.log(err?.statusCode, err?.message, err?.json);
    }
}

/*
* Get list of links from TikTok by SecUID (specific user)
*/
const getVideosToPost = async (count = 10) => {
    let objectArr = new Array();
    const secUid = await getUsersSecUid();

    try {
        let response = await api.public.posts({
            secUid: secUid,
            count: count
        });
        response.json.itemList.forEach((element) => {
            let video = {
                id: '',
                link: '',
                desc: '',
                author: ''
            };
            video.id = element.id;
            video.link = "https://www.tiktok.com/" + "@" + element.author.uniqueId + "/video/" + element.id;
            video.desc = element.desc;
            video.author = element.author.uniqueId;
            objectArr.push(video);
            log(chalk.yellow.underline(video.link))
        })
        log(chalk.green(`Received Videos Links: ` + objectArr.length));
        console.warn(objectArr);
        return objectArr
    }
    catch (err) {
        console.log(err?.statusCode, err?.message, err?.json)
    }
}

/*
* Get list of links from TikTok by SecUID (specific user) - NOT USED AS OF NOW
*/
// const getLinksForTrendingPosts = async () => {
//     try {
//         const idArr = [];
//         let response = await api.public.explore({
//             session_id: faker.datatype.number( { min: 0, max: 20 }),
//             country: 'ua'
//         });
//         console.log("Response Item List 1");
//         console.log(response.json.itemList[0]);
//         response.json.itemList.forEach((element) => {
//             const newStr = "@" + element.author.uniqueId + "/video/" + element.id
//             idArr.push(newStr);
//         })
//         /*
//         let shuffledArr = shuffle(idArr);
//         return shuffledArr;
//         */
//        return shuffle(idArr);
//     }
//     catch(err) {
//         console.log(err?.statusCode, err?.message, err?.json)
//     }
// }

exports.getVideosToPost = getVideosToPost;