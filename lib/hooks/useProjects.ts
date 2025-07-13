import { useState, useCallback } from 'react';
import type { Project } from '@prisma/client';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {

      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(prev => [...prev, data]);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(prev => prev.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
} 