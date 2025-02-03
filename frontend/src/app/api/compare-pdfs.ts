import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // 禁用默认的 bodyParser，使用 formidable 处理文件上传
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data.' });
    }

    const file1 = files.file1;
    const file2 = files.file2;

    if (!file1 || !file2) {
      return res.status(400).json({ error: 'Both files are required.' });
    }

    const formData = new FormData();
    formData.append('file1', fs.createReadStream(file1.filepath));
    formData.append('file2', fs.createReadStream(file2.filepath));

    try {
      // 替换为你的后端 API 地址
      const backendResponse = await axios.post('http://127.0.0.1:8000/compare-pdfs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'stream', // 接收二进制流
      });

      // 将后端响应直接返回给前端
      backendResponse.data.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the files.' });
    }
  });
}