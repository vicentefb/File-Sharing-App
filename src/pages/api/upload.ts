// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {UploadApiResponse, v2 as cloudinary} from 'cloudinary'
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect"

import {connectDB} from "../config/db";
import File from "../../models/File"


const upload = multer();
connectDB;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});
// We can use upload.array('myFile') to upload multiple files as well
apiRoute.use(upload.single('myFile'));

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const documentFile = (req as any).file;
  try{
    if(!documentFile){
      return res.status(400).json({message: "A file is needed"});
    }
    let uploadedFile: UploadApiResponse;
    try{
      uploadedFile = await cloudinary.uploader.upload(documentFile.path, {
        folder: "file-sharing",
        resource_type: "auto"
      })
    } catch(error){
      //console.log(error.message);
      //console.log(process.env.CLOUDINARY_API_CLOUD_NAME)
      return res.status(500).json({message: "Cloudinary Error"})
    }

    // store file in mongo
    const {originalname} = documentFile
    const {secure_url, bytes, format} = uploadedFile;

    const file = await File.create({
      filename: originalname,
      sizeInBytes: bytes,
      secure_url,
      format
    })
    res.status(200).json({
      id: file._id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
    });
  }
  catch(error){
    
    res.status(500).json({message: "Server Error"})
  }

});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
