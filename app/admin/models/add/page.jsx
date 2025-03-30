// app/admin/models/add/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UploadForm from '@/components/UploadForm';

export default function AddModelPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedThumbnail, setUploadedThumbnail] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
  });
  
  const router = useRouter();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    
    if (!formData.name || !formData.description || !uploadedThumbnail) {
      setError('Please fill in all required fields and upload a thumbnail.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const modelData = {
        name: formData.name,
        description: formData.description,
        thumbnailUrl: uploadedThumbnail.fileUrl,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      const response = await axios.post('/api/models', modelData);
      
      if (response.data.success) {
        setSuccess('Model created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          tags: '',
        });
        setUploadedThumbnail(null);
        
        // Redirect to the model page after a short delay
        setTimeout(() => {
          router.push(`/models/${response.data.model._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating model:', error);
      setError(
        error.response?.data?.error || 
        'Failed to create model. Please try again.'
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
          <h1 className="text-3xl font-bold">Add New Model</h1>
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
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full rounded-md bg-gray-700 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Thumbnail Image <span className="text-red-500">*</span></h3>
              <p className="text-sm text-gray-400 mb-3">
                Upload a thumbnail image for the model. This will be displayed on the models page.
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
                {isLoading ? 'Creating...' : 'Create Model'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}