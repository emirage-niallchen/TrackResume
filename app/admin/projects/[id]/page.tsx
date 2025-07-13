"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

type ProjectForm = {
  name: string;
  description: string;
  links: { label: string; url: string; icon?: string }[];
  images: { url: string; alt?: string }[];
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    links: [],
    images: []
  });

  const fetchProject = useCallback(async () => {
    const response = await fetch(`/api/projects/${params.id}`);
    const data = await response.json();
    setFormData(data);
  }, [params.id]);

  useEffect(() => {
    if (params.id !== 'new') {
      fetchProject();
    }
  }, [params.id, fetchProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = params.id === 'new' 
      ? '/api/projects' 
      : `/api/projects/${params.id}`;
    
    const method = params.id === 'new' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save project');

      router.push('/admin/projects');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save project');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: data.path, alt: '' }]
      }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {params.id === 'new' ? '添加项目' : '编辑项目'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div>
          <label className="block mb-2">项目名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">项目简介</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        {/* 链接管理 */}
        <div>
          <label className="block mb-2">项目链接</label>
          {formData.links.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="链接标签"
                value={link.label}
                onChange={e => {
                  const newLinks = [...formData.links];
                  newLinks[index].label = e.target.value;
                  setFormData(prev => ({ ...prev, links: newLinks }));
                }}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={e => {
                  const newLinks = [...formData.links];
                  newLinks[index].url = e.target.value;
                  setFormData(prev => ({ ...prev, links: newLinks }));
                }}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const newLinks = formData.links.filter((_, i) => i !== index);
                  setFormData(prev => ({ ...prev, links: newLinks }));
                }}
                className="text-red-500"
              >
                删除
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                links: [...prev.links, { label: '', url: '' }]
              }));
            }}
            className="text-blue-500"
          >
            添加链接
          </button>
        </div>

        {/* 图片管理 */}
        <div>
          <label className="block mb-2">项目截图</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  width={200}
                  height={150}
                  className="rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = formData.images.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, images: newImages }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          保存项目
        </button>
      </form>
    </div>
  );
} 