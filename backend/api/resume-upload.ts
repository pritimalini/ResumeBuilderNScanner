import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import supabase from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

// Disable the default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form with uploaded file
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
    });

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Get the file from the request
    const file = files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get user ID from the session (in a real app, this would come from auth)
    const userId = fields.userId || '00000000-0000-0000-0000-000000000000'; // Default for testing
    
    // Read the file
    const filePath = file.filepath;
    const fileContent = await fs.readFile(filePath);
    
    // Generate unique filename
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalFilename);
    const fileName = `${fileId}${fileExtension}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('resumes')
      .upload(`${userId}/${fileName}`, fileContent, {
        contentType: file.mimetype,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return res.status(500).json({ message: 'Failed to upload file to storage', error: uploadError });
    }

    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(`${userId}/${fileName}`);

    // Create a record in the resumes table
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: file.originalFilename || 'Untitled Resume',
        file_path: urlData?.publicUrl || '',
        file_name: file.originalFilename,
        file_type: file.mimetype,
        file_size: file.size,
      })
      .select()
      .single();

    if (resumeError) {
      console.error('Error creating resume record:', resumeError);
      return res.status(500).json({ message: 'Failed to create resume record', error: resumeError });
    }

    // Return success response
    return res.status(200).json({ 
      message: 'File uploaded successfully',
      resume: resumeData,
      fileUrl: urlData?.publicUrl
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({ message: 'Failed to upload resume', error });
  }
} 