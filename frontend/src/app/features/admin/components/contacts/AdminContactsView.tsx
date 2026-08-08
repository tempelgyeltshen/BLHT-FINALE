import React, { useState } from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { AdminLayout } from '../shared/AdminLayout';
import { Button, Pagination, TextArea } from '../../../shared/components/ui';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Mail, Send } from 'lucide-react';

export const AdminContactsView: React.FC = () => {
  const { inquiries, updateInquiryStatus, showToast } = useApp();
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(inquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const { currentPage, totalPages, pageItems, goToPage } = usePagination(inquiries, 8);
  // Keep the selected inquiry when possible; otherwise fall back to the first visible item
  // on the current page so the details pane stays aligned with the paginated sidebar.
  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || pageItems[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedInquiry) return;

    updateInquiryStatus(selectedInquiry.id, 'quoted', `Reply sent on ${new Date().toLocaleDateString()}: ${replyText}`);
    setReplyText('');
    showToast(`Email proposal sent to ${selectedInquiry.email}`);
  };

  return (
    <AdminLayout
      title="Customer Inquiries Inbox"
      subtitle="Review travel leads, update proposal status, and dispatch tailored proposals"
    >
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List Sidebar */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-amber-950 pb-2 border-b">Inquiries Inbox ({inquiries.length})</h3>
            <div className="space-y-2">
              {pageItems.map(inq => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiryId(inq.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-amber-950 text-amber-100 border-amber-900 shadow-sm'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate max-w-[150px]">{inq.fullName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      inq.status === 'new' ? 'bg-rose-500 text-white' : 'bg-amber-600 text-amber-950'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1 truncate">{inq.packageTitle || 'Custom Itinerary'}</p>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>

          {/* Details Pane */}
          {selectedInquiry ? (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-amber-950">{selectedInquiry.fullName}</h3>
                  <p className="text-stone-500 text-xs">{selectedInquiry.email} • {selectedInquiry.phone} ({selectedInquiry.country})</p>
                </div>
                <div className="flex items-center gap-2">
                  {['new', 'contacted', 'quoted', 'booked'].map(st => (
                    <button
                      key={st}
                      onClick={() => updateInquiryStatus(selectedInquiry.id, st as any)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        selectedInquiry.status === st
                          ? 'bg-amber-900 text-amber-50'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <span className="text-amber-800 font-bold block text-[10px] uppercase">Target Dates</span>
                  <span>{selectedInquiry.travelDates || 'Flexible'}</span>
                </div>
                <div>
                  <span className="text-amber-800 font-bold block text-[10px] uppercase">Group Size & Duration</span>
                  <span>{selectedInquiry.groupSize} Guests ({selectedInquiry.durationDays || 7} Days)</span>
                </div>
                <div>
                  <span className="text-amber-800 font-bold block text-[10px] uppercase">Estimated Budget</span>
                  <span>{selectedInquiry.estimatedBudgetPerPerson || '$7,000+'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs uppercase text-amber-900 mb-1">Customer Message / Requests:</h4>
                <p className="p-4 bg-stone-50 rounded-xl border text-xs text-stone-800 font-serif leading-relaxed">
                  "{selectedInquiry.message}"
                </p>
              </div>

              {selectedInquiry.adminNotes && (
                <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-300 text-xs text-amber-950">
                  <strong className="block text-[10px] uppercase">Internal Staff Notes:</strong>
                  <span>{selectedInquiry.adminNotes}</span>
                </div>
              )}

              {/* Email Reply Simulator */}
              <form onSubmit={handleSendReply} className="pt-4 border-t space-y-3">
                <h4 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-700" /> Dispatch Email Proposal to Client
                </h4>
                <TextArea
                  rows={3}
                  required
                  placeholder="Type official reply proposal details to send directly to client..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="p-3 rounded-xl"
                />
                <Button type="submit" variant="primary" size="lg">
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Proposal & Update Status to 'Quoted'</span>
                </Button>
              </form>

            </div>
          ) : (
            <div className="lg:col-span-2 p-12 text-center text-stone-500">
              Select an inquiry from the inbox to review.
            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
};
