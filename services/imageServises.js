import multer from "multer";
import HttpError from "../helpers/HttpError.js";
import { v4 } from 'uuid'
import * as fse from 'fs-extra'
import Jimp from "jimp";
import path from 'path'

export class ImegeServise{
    static initUploadImageMiddlewre(fieldName) {
        const multerStorage = multer.memoryStorage();

        const multerFilter = (req, file, cbk) => {
            if (file.mimetype.startsWith('image/')) {
                cbk(null, true);
            } else {
                cbk(HttpError(400, 'Pleas, upload image only..'), false)
            }
        } 
        return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
        }).single(fieldName);
    }
    static async saveImage(file, options, ...pathSegments) {
        if (file.size > (options?.maxFileSize ? options.maxFileSize * 1024 * 1024 : 1 * 1024 * 1024)) {
            throw new HttpError(400, 'Fail is too large..')
        }

        const fileName = `${v4()}.jpeg`
        const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments)

        await fse.ensureDir(fullFilePath);
        await Jimp.read("file.buffer", (err, nameAvatar) => {
            if (err) throw  HttpError(404)
            
            nameAvatar
                .resize(300, 300)
                .quality(60)
        })
        
        return path.join(...pathSegments, fileName)
    }
}