// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  // Quick server-side auth using ADMIN_UPLOAD_KEY
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.ADMIN_UPLOAD_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'products' }, // optional folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload failed', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


export async function PUT(req : Request){
  const auth = req.headers.get('authorization') || '';
  if(auth != `Bearer ${process.env.ADMIN_UPLOAD_KEY}`){
    return NextResponse.json({ error : 'Authoriation failed'}, { status : 401});
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const oldPublicId = formData.get('public_id') as string | null;

  if(!file){
    return NextResponse.json({ error : 'No file Provided '}, {status : 400})
  }
  try {
    //deleting old image from cloudinary

    if(oldPublicId){
      await cloudinary.uploader.destroy(oldPublicId);
      console.log(`Deleted old image : ${oldPublicId}`);
    }

    //uploading new image 
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject)=> {
      const stream = cloudinary.uploader.upload_stream(
        { folder : 'products'},
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url : uploadResult.secure_url,
      public_id : uploadResult.public_id,
    });
  } catch (error) {
    console.error('Cloudinary Update Failed', error);
    return NextResponse.json({ error : 'Update Failed'}, { status : 500})
  }
}