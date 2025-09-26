import React, { useState, useRef } from 'react';
import { Upload, File, Link, Check, X, Image } from 'lucide-react';
import ipfsService from '../../services/ipfsService';

interface IPFSUploaderProps {
  onUploadComplete?: (cid: string, url: string) => void;
  allowedFileTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

const IPFSUploader: React.FC<IPFSUploaderProps> = ({
  onUploadComplete,
  allowedFileTypes = ['image/*', 'application/pdf', 'application/json'],
  maxSizeMB = 10,
  className = ''
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ cid: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    const fileType = selectedFile.type;
    const isAllowedType = allowedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return type === fileType;
    });

    if (!isAllowedType) {
      setError('File type not supported');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadResult(null);

    // Create preview for images
    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const cid = await ipfsService.uploadFile(file);
      const url = ipfsService.getGatewayUrl(cid);
      
      setUploadResult({ cid, url });
      onUploadComplete?.(cid, url);
    } catch (err) {
      console.error('IPFS upload error:', err);
      setError('Failed to upload file to IPFS');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Upload size={18} />
          IPFS File Uploader
        </h3>
      </div>
      
      <div className="p-4">
        {uploadResult ? (
          <div className="text-center py-2">
            <div className="bg-green-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Check size={24} />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Successful!</h4>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm mb-3">
              <div className="font-medium mb-1">IPFS CID:</div>
              <div className="text-gray-700 break-all font-mono">{uploadResult.cid}</div>
            </div>
            
            <div className="flex justify-center gap-3 mt-4">
              <a 
                href={uploadResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Link size={16} />
                View File
              </a>
              <button
                onClick={resetUpload}
                className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload size={16} />
                Upload Another
              </button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
              } transition-colors`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="flex flex-col items-center">
                  <img src={preview} alt="Preview" className="max-h-48 max-w-full mb-3 rounded" />
                  <p className="text-sm text-gray-500">{file?.name}</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                    <File size={32} className="text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-500">{file.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <Image size={32} className="text-gray-500" />
                  </div>
                  <p className="text-gray-500 mb-1">Drag and drop a file here or click to browse</p>
                  <p className="text-xs text-gray-400">
                    Max file size: {maxSizeMB}MB
                  </p>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={allowedFileTypes.join(',')}
              />
            </div>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-start gap-2">
                <X size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !file || uploading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                } transition-colors`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload to IPFS
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IPFSUploader;