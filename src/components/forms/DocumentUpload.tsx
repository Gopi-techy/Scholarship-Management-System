import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { useApi, api } from '../hooks/useApi';
import { toast } from 'react-toastify';

interface DocumentUploadProps {
  documentType: string;
  applicationId?: string;
  onUploadComplete?: (document: any) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  applicationId,
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'],
}) => {
  const { currentUser } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadDocument = useApi(async (formData: FormData) => {
    const token = await currentUser?.getIdToken();
    const endpoint = applicationId
      ? `/documents/upload/${applicationId}`
      : '/documents/upload';

    return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        // Create upload progress handler
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        };

        const result = await uploadDocument.execute(formData);
        if (result) {
          toast.success('Document uploaded successfully');
          onUploadComplete?.(result);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload document');
      } finally {
        setUploadProgress(0);
      }
    },
    [documentType, applicationId, onUploadComplete, uploadDocument]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : isDragReject
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-primary'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-4xl mb-2">📄</div>
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <>
              <p className="text-gray-600">
                Drag and drop your document here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Accepted files: {acceptedFileTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Maximum size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </>
          )}
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {uploadDocument.error && (
        <p className="mt-2 text-sm text-red-600">{uploadDocument.error}</p>
      )}
    </div>
  );
};

export default DocumentUpload; 