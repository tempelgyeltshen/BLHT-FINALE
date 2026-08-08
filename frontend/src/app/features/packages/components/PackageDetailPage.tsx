import React from 'react';
import { useParams } from 'react-router-dom';
import { usePackages } from '../hooks/usePackages';
import type { Package } from '../types/package.types';

export const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPackage, loading, error } = usePackages();
  const [packageData, setPackageData] = React.useState<Package | null>(null);

  React.useEffect(() => {
    if (id) {
      getPackage(id).then(setPackageData).catch(console.error);
    }
  }, [id, getPackage]);

  if (loading) {
    return <div className="p-8 text-center">Loading package details...</div>;
  }

  if (error || !packageData) {
    return <div className="p-8 text-center text-red-600">Failed to load package details</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-amber-950 mb-2">{packageData.title}</h1>
        <p className="text-lg text-stone-600">{packageData.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img src={packageData.heroImage} alt={packageData.title} className="w-full h-96 object-cover rounded-2xl mb-6" />
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">Description</h2>
            <p className="text-stone-700">{packageData.description}</p>
          </div>

          {packageData.highlights && packageData.highlights.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">Highlights</h2>
              <ul className="list-disc list-inside space-y-2">
                {packageData.highlights.map((highlight, index) => (
                  <li key={index} className="text-stone-700">{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {packageData.itinerary && packageData.itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-serif font-bold text-amber-950 mb-4">Itinerary</h2>
              <div className="space-y-4">
                {packageData.itinerary.map((item, index) => (
                  <div key={index} className="border-l-4 border-amber-600 pl-4">
                    <h3 className="font-bold text-amber-950">Day {item.day}: {item.title}</h3>
                    <p className="text-stone-600 text-sm mb-2">{item.location}</p>
                    <p className="text-stone-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 rounded-2xl p-6">
            <h3 className="text-xl font-serif font-bold text-amber-950 mb-4">Package Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-600">Duration:</span>
                <span className="font-bold text-amber-950">{packageData.durationDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Price:</span>
                <span className="font-bold text-amber-950">${packageData.priceUSD.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Category:</span>
                <span className="font-bold text-amber-950">{packageData.category}</span>
              </div>
              {packageData.hotelCategory && (
                <div className="flex justify-between">
                  <span className="text-stone-600">Hotel Style:</span>
                  <span className="font-bold text-amber-950">{packageData.hotelCategory}</span>
                </div>
              )}
            </div>
          </div>

          {packageData.included && packageData.included.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-serif font-bold text-green-950 mb-4">Included</h3>
              <ul className="list-disc list-inside space-y-2">
                {packageData.included.map((item, index) => (
                  <li key={index} className="text-stone-700">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {packageData.excluded && packageData.excluded.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-6">
              <h3 className="text-xl font-serif font-bold text-red-950 mb-4">Not Included</h3>
              <ul className="list-disc list-inside space-y-2">
                {packageData.excluded.map((item, index) => (
                  <li key={index} className="text-stone-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
