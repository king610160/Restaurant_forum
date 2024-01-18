const fs = require('fs') // 引入 fs 模組
const path = require('path')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = async (file) => { // file 是 multer 處理完的檔案
    try {
        if (!file) return null
        const fileName = `upload/${file.originalname}`
        const data = await fs.promises.readFile(file.path)
        await fs.promises.writeFile(fileName, data)
        return `/${fileName}`
    } catch(err){
        throw new Error(err)
    }
}

const imgurFileHandler = async (file) => {
    try {
        if (!file) return null
        const ext = path.extname(file.originalname).toLowerCase()
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.webp') throw new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
        const response = await imgur.uploadFile(file.path)
        return response?.link || null // 檢查 img 是否存在
    } catch(err){
        throw new Error(err)
    }
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}