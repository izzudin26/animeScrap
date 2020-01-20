const fs = require('fs')
const db = require('../database/completeDB.json')
const animeDB = require('../database/animeDB.json')
const axios = require('axios')
const cheerio = require('cheerio')

let data = []
let animeData = []

const getTitle = async () => {
    await axios.get('https://animeindo.to/anime-list/')
        .then((body) => {
            let $ = cheerio.load(body.data)
            $('.the-animelist-text').each((idx1, elm1) => {
                $(elm1).find('.row').each((idx2, elm2) => {
                    $(elm2).find('.list-anime').each((idx3, elm3) => {
                        let title = $(elm3).find('.title').text().trim()
                        let url = $(elm3).find('a').attr('href').toString()
                        data.push({ title: title, url: url })
                    })
                })
            })
            console.log(data)
            writeData()
            console.log('=================================')
            console.log('DATA HAS SAVE TO completeDB.json')
            console.log('=================================s')
        })
}


const writeData = () => {
    fs.writeFile('./database/completeDB.json', JSON.stringify(data), (err) => {
        if (err) {
            throw err
        }
    })
}

const checkData = () => {
    db.forEach(element => {
        console.log(element.title)
    })
}

const getAnimeData = () => {
    db.forEach((animeData, idx) => {
        setTimeout(() => {
            findData(animeData.url)
        }, idx * 1500)

    })
    writeAnime()
}

const writeAnime = () => {
    fs.writeFile('./database/animeDB.json', JSON.stringify(animeData), (err) => {
        if (err) {
            throw err
        }
    })
}

const findData = async (url) => {
    await axios.get(url)
        .then((body) => {
            let $ = cheerio.load(body.data)
            let title = ''
            let poster = ''
            let eps = []
            let sinopsis = ''
            let urls = url
            let genre = []

            //   Get poster
            $('.anime-pic').each((idx, elm1) => {
                poster = $(elm1).find('img').attr('src')
            })

            // get title
            title = $('h1').html().trim()

            // get eps

            $('.col-12 .col-sm-6').each((idx, elm) => {
                let urls = $(elm).find('a').attr('href')
                let titles = $(elm).find('.text-h4').text()
                eps.push({ urls: urls, titles: titles })
            })
            // get genre

            $('.animegenre').each((idx, elm) => {
                $(elm).find('li').each((idx, elms) => {
                    let genres = $(elms).find('a').text()
                    genre.push(genres)
                })
            })

            // get sinopsis
            $('.row .mb40').each((idx, elm) => {
                sinopsis = $(elm).find('p').text()
                console.log()
            })

            animeData.push({
                title: title,
                url: urls,
                poster: poster,
                sinopsis: sinopsis,
                episode: eps,
                genre: genre
            })
            writeAnime()
            console.log(animeData)
        })
}

const get = async (req, res) => {
    res.json(animeDB)
}

const getVideo = async (req, res) => {
    let url = req.body.url
    console.log(url)
    let urls = 'hai'
    await axios.get(url)
        .then(body => {
            let $ = cheerio.load(body.data)
            let urls = $('body').find('iframe').attr('src')
            console.log(urls)
            res.json({videoUrl: 'https:'+urls})
        })
}


module.exports = {
    getTitle: getTitle,
    writeData: writeData,
    checkData: checkData,
    getAnimeData: getAnimeData,
    getData: get,
    getVideo: getVideo
}