'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LocationForm() {
  const { location, loading, error, fetchLocation, updateLocation } = useLocation();
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    address: '',
    description: '',
  });

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (location) {
      setFormData({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        address: location.address,
        description: location.description,
      });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLocation({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });
      alert('位置信息已更新');
    } catch (error) {
      alert('更新失败');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>纬度</Label>
        <Input
          type="number"
          step="any"
          value={formData.latitude}
          onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label>经度</Label>
        <Input
          type="number"
          step="any"
          value={formData.longitude}
          onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label>地址</Label>
        <Input
          value={formData.address}
          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label>描述</Label>
        <Input
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? '保存中...' : '保存'}
      </Button>
    </form>
  );
} 