'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
import { Upload, Save, RefreshCw } from 'lucide-react';
import { useAdminContentLanguage } from '@/lib/context/AdminContentLanguageProvider';

interface WebsiteSettings {
  id: string;
  websiteTitle: string | null;
  favicon: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const { withLanguage } = useAdminContentLanguage();

  // 获取网站设置
  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('Fetching website settings from API');
      
      const response = await fetch(withLanguage('/api/website-settings'), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }
      
      const data = await response.json();
      setSettings(data);
      setWebsiteTitle(data.websiteTitle || '');
      setFaviconPreview(data.favicon ? getImageUrl(data.favicon) : null);
      
      console.log('Settings fetched successfully', { 
        hasTitle: !!data.websiteTitle,
        hasFavicon: !!data.favicon 
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('获取网站设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存网站设置
  const saveSettings = async () => {
    try {
      setSaving(true);
      console.log('Saving website settings');
      
      const response = await fetch(withLanguage('/api/website-settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteTitle: websiteTitle.trim(),
          favicon: settings?.favicon || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      
      // 刷新缓存
      try {
        await fetch(withLanguage('/api/website-settings/refresh'), { method: 'POST' });
        console.log('Cache refreshed after settings update');
      } catch (cacheError) {
        console.warn('Failed to refresh cache:', cacheError);
      }
      
      toast.success('网站设置保存成功');
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('保存网站设置失败');
    } finally {
      setSaving(false);
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // Validate file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('图标文件大小不能超过1MB');
      return;
    }

    try {
      setSaving(true);
      console.log('Uploading favicon to S3');
      
      // Upload file to S3
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch(withLanguage('/api/admin/favicon'), {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload favicon');
      }

      const uploadResult = await uploadResponse.json();
      const faviconUrl = uploadResult.favicon;
      
      // Update settings with new favicon URL
      const response = await fetch(withLanguage('/api/website-settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteTitle: websiteTitle.trim(),
          favicon: faviconUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setFaviconPreview(faviconUrl);
      
      // Refresh cache
      try {
        await fetch(withLanguage('/api/website-settings/refresh'), { method: 'POST' });
        console.log('Cache refreshed after favicon upload');
      } catch (cacheError) {
        console.warn('Failed to refresh cache:', cacheError);
      }
      
      toast.success('网站图标上传成功');
      console.log('Favicon uploaded successfully');
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      toast.error('图标上传失败');
    } finally {
      setSaving(false);
    }
  };

  // Get image URL (handles both S3 URLs and base64 for backward compatibility)
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    // If it's already a full URL (S3), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's base64 (legacy), return as is
    if (url.startsWith('data:image/')) {
      return url;
    }
    // Legacy base64 without prefix
    return `data:image/jpeg;base64,${url}`;
  };

  // Remove favicon
  const removeFavicon = async () => {
    try {
      setSaving(true);
      console.log('Removing favicon');
      
      const response = await fetch(withLanguage('/api/website-settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteTitle: websiteTitle.trim(),
          favicon: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove favicon');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setFaviconPreview(null);
      
      // Refresh cache
      try {
        await fetch(withLanguage('/api/website-settings/refresh'), { method: 'POST' });
        console.log('Cache refreshed after favicon removal');
      } catch (cacheError) {
        console.warn('Failed to refresh cache:', cacheError);
      }
      
      toast.success('网站图标已移除');
      console.log('Favicon removed successfully');
    } catch (error) {
      console.error('Failed to remove favicon:', error);
      toast.error('移除图标失败');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>网站设置</CardTitle>
          <CardDescription>管理网站的标题和图标</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>加载中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>网站设置</CardTitle>
        <CardDescription>管理网站的标题和图标</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 网站标题设置 */}
        <div className="space-y-2">
          <Label htmlFor="website-title">网站标题</Label>
          <Input
            id="website-title"
            value={websiteTitle}
            onChange={(e) => setWebsiteTitle(e.target.value)}
            placeholder="请输入网站标题"
            disabled={saving}
          />
          <p className="text-sm text-muted-foreground">
            此标题将显示在浏览器标签页和网站头部
          </p>
        </div>

        {/* 网站图标设置 */}
        <div className="space-y-4">
          <Label>网站图标 (Favicon)</Label>
          
          <div className="flex items-center space-x-4">
            {faviconPreview ? (
              <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={faviconPreview}
                  alt="网站图标"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 border rounded-lg bg-gray-50 flex items-center justify-center">
                <span className="text-xs text-gray-500">无图标</span>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  disabled={saving}
                  className="hidden"
                  id="favicon-upload"
                />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={saving}
                >
                  <label htmlFor="favicon-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {saving ? '上传中...' : '上传图标'}
                  </label>
                </Button>
                
                {faviconPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeFavicon}
                    disabled={saving}
                  >
                    移除图标
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                建议使用 32x32 或 64x64 像素的 PNG/ICO 格式图标
              </p>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={saving || !websiteTitle.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
