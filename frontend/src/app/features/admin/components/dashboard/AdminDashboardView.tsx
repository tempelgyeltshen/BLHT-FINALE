import React from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { AdminLayout } from '../shared/AdminLayout';
import { Button } from '../../../shared/components/ui';
import { 
  BarChart3, FileText, MessageSquare, Package, Hotel, Plus
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    packages, inquiries, hotels, 
    navigate, updateInquiryStatus 
  } = useApp();

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <AdminLayout 
      title="Executive Overview" 
      subtitle="Real-time portal activity, customer leads, and content metrics"
    >
      <div className="space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div 
            onClick={() => navigate('admin-contacts')}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-stone-500 group-hover:text-amber-950 text-xs font-semibold uppercase tracking-wider transition-colors">Customer Inquiries</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-800 group-hover:text-amber-50 flex items-center justify-center font-bold transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-serif font-bold text-3xl text-amber-950">{inquiries.length}</span>
              {newInquiriesCount > 0 && (
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {newInquiriesCount} NEW
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500">Bespoke tour proposals requested</p>
          </div>

          <div 
            onClick={() => navigate('admin-packages')}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-stone-500 group-hover:text-amber-950 text-xs font-semibold uppercase tracking-wider transition-colors">Tour Packages</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-800 group-hover:text-amber-50 flex items-center justify-center font-bold transition-colors">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif font-bold text-3xl text-amber-950">{packages.length}</span>
            <p className="text-[11px] text-stone-500">Active itineraries on public portal</p>
          </div>

          <div 
            onClick={() => navigate('admin-hotels')}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-stone-500 group-hover:text-amber-950 text-xs font-semibold uppercase tracking-wider transition-colors">5-Star Lodges</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-800 group-hover:text-amber-50 flex items-center justify-center font-bold transition-colors">
                <Hotel className="w-4 h-4" />
              </div>
            </div>
            <span className="font-serif font-bold text-3xl text-amber-950">{hotels.length}</span>
            <p className="text-[11px] text-stone-500">Six Senses, COMO, Pemako, BLHT</p>
          </div>

        </div>

        {/* Quick Action Bar */}
        <div className="bg-amber-950 text-amber-50 rounded-2xl p-6 border border-amber-800 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 hover:border-amber-600 hover:shadow-lg">
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-100">Quick Administrative Actions</h3>
            <p className="text-amber-200/80 text-xs">Manage public brochures, add packages, or update homepage announcements.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('admin-packages')}
              variant="light"
              size="md"
              className="hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tour Package</span>
            </Button>

            <Button
              onClick={() => navigate('admin-brochures')}
              variant="darkOutline"
              size="md"
              className="hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Manage PDF Brochures</span>
            </Button>

            <Button
              onClick={() => navigate('admin-homepage')}
              variant="darkOutline"
              size="md"
              className="hover:scale-[1.02]"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Edit Homepage Sections</span>
            </Button>
          </div>
        </div>

        {/* Recent Inquiries Table */}
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md hover:border-amber-300">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-950">Recent Customer Inquiries</h3>
              <p className="text-stone-500 text-xs">High-net-worth traveler leads submitted through public portal</p>
            </div>
            <button
              onClick={() => navigate('admin-contacts')}
              className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Inbox ({inquiries.length})</span> →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-amber-50 text-amber-950 font-serif font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Client Name</th>
                  <th className="p-3">Email & Country</th>
                  <th className="p-3">Target Dates & Group</th>
                  <th className="p-3">Requested Package</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inquiries.slice(0, 5).map(inq => (
                  <tr key={inq.id} className="hover:bg-amber-50/50">
                    <td className="p-3 font-semibold text-stone-900">{inq.fullName}</td>
                    <td className="p-3">
                      <div className="font-medium text-amber-900">{inq.email}</div>
                      <div className="text-[10px] text-stone-500">{inq.country || 'International'}</div>
                    </td>
                    <td className="p-3">
                      <div>{inq.travelDates || 'Flexible'}</div>
                      <div className="text-[10px] text-stone-500">{inq.groupSize} Guests ({inq.durationDays || 7} Days)</div>
                    </td>
                    <td className="p-3 font-medium text-stone-800">{inq.packageTitle || 'Bespoke Custom'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inq.status === 'new' ? 'bg-rose-100 text-rose-800' :
                        inq.status === 'quoted' ? 'bg-amber-100 text-amber-900' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => updateInquiryStatus(inq.id, 'quoted')}
                        className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold cursor-pointer"
                      >
                        Mark Quoted
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
