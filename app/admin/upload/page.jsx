// app/admin/upload/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UploadForm from '@/components/UploadForm';

export default function UploadContentPage() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modelId: '',
    isPremium: false,
    tags: '',
  });
  
  const router = useRouter();
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/models');
        setModels(response.data.models);
      } catch (error) {
        console.error('Error fetching models:', error);
        setError('Failed to load models. Please refresh the page.');
      }
    };
    
    fetchModels();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleMainFileUploaded = (data) => {
    setUploadedFile({
      fileUrl: data.fileUrl,
      fileKey: data.fileKey,
      contentType: data.contentType,
    });
  };
  
  const handleThumbnailUploaded = (data) => {
    setUploadedThumbnail({
      fileUrl: data.fileUrl,
      fileKey: data.fileKey,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (
      !formData.title ||
      !formData.modelId ||
      !uploadedFile ||
      !uploadedThumbnail
    ) {
      setError('Please fill in all required fields and upload both files.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const contentData = {
        title: formData.title,
        description: formData.description,
        modelId: formData.modelId,
        fileUrl: uploadedFile.fileUrl,
        thumbnailUrl: uploadedThumbnail.fileUrl,
        contentType: uploadedFile.contentType,
        isPremium: formData.isPremium,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      const response = await axios.post('/api/content', contentData);
      
      if (response.data.success) {
        setSuccess('Content uploaded successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          modelId: '',
          isPremium: false,
          tags: '',
        });
        setUploadedFile(null);
        setUploadedThumbnail(null);
        
        // Redirect to the content page after a short delay
        setTimeout(() => {
          router.push(`/content/${response.data.content._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating content:', error);
      setError(
        error.response?.data?.error || 
        'Failed to create content. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/admin/dashboard"
            className="text-blue-400 hover:underline flex items-center mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Upload New Content</h1>
        </div>
        
        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-md mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-green-200 p-4 rounded-md mb-6">
            <p className="font-medium">{success}</p>
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label
                  htmlFor="modelId"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  id="modelId"
                  name="modelId"
                  value={formData.modelId}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a model</option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPremium"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                />
                <label
                  htmlFor="isPremium"
                  className="ml-2 block text-sm font-medium text-gray-300"
                >
                  Premium Content
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Premium content is only visible to subscribers with active premium membership.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Main File Upload <span className="text-red-500">*</span></h3>
              <p className="text-sm text-gray-400 mb-3">
                Upload the main content file (image or video).
              </p>
              
              {uploadedFile ? (
                <div className="bg-gray-700 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">File uploaded successfully!</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Type: {uploadedFile.contentType === 'image' ? 'Image' : 'Video'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <UploadForm onSuccess={handleMainFileUploaded} />
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Thumbnail Upload <span className="text-red-500">*</span></h3>
              <p className="text-sm text-gray-400 mb-3">
                Upload a thumbnail image for the content.
              </p>
              
              {uploadedThumbnail ? (
                <div className="bg-gray-700 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Thumbnail uploaded successfully!</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedThumbnail(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <UploadForm onSuccess={handleThumbnailUploaded} />
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Uploading...' : 'Upload Content'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}