import { useState, useEffect } from 'react';
import { packageService } from '../services/packageService';
import type { Package, PackageFormData } from '../types/package.types';

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.listPackages();
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.getFeaturedPackages();
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch featured packages');
      console.error('Error fetching featured packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagesByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.getPackagesByCategory(category);
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages by category');
      console.error('Error fetching packages by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (data: PackageFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.createPackage(data);
      setPackages(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create package');
      console.error('Error creating package:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (id: string, data: Partial<PackageFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.updatePackage(id, data);
      setPackages(prev => prev.map(pkg => pkg.id === id ? response.data : pkg));
      return response.data;
    } catch (err) {
      setError('Failed to update package');
      console.error('Error updating package:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await packageService.deletePackage(id);
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    } catch (err) {
      setError('Failed to delete package');
      console.error('Error deleting package:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPackage = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await packageService.getPackage(id);
      return response.data;
    } catch (err) {
      setError('Failed to fetch package');
      console.error('Error fetching package:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    fetchPackages,
    fetchFeaturedPackages,
    fetchPackagesByCategory,
    createPackage,
    updatePackage,
    deletePackage,
    getPackage,
  };
}
