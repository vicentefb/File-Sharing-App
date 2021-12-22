// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {UploadApiResponse, v2 as cloudinary} from 'cloudinary'
import formidable from 'formidable-serverless';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from "next-connect"

import File from "../../models/File"



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

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err: any, fields: any, files: { myFile: { path: string; name: any; }; }) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    let uploadedFile: UploadApiResponse;
    try{
      uploadedFile = await cloudinary.uploader.upload(files.myFile.path, {
        folder: "file-sharing",
        resource_type: "auto"
      })
    } catch(error){
      return res.status(500).json({message: "Cloudinary Error"})
    }

    // store file in mongo
    const originalname = files.myFile.name;
    const {secure_url, bytes, format} = uploadedFile;
    const file = await File.create({
      filename: originalname,
      sizeInBytes: bytes,
      secure_url: secure_url,
      format: format,
    })
    return res.status(200).json({
      id: file._id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
    });
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
