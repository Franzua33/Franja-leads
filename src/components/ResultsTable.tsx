import React, { useState } from 'react';
import { BusinessLead } from '../types';
import {
  FileSpreadsheet,
  Download,
  ExternalLink,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ResultsTableProps {
  leads: BusinessLead[];
  sheetUrl?: string;
  querySummary?: string;
  language: 'es' | 'en';
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  leads,
  sheetUrl,
  querySummary,
  language,
  t,
}) => {
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter leads client-side
  const filteredLeads = leads.filter((lead) => {
    if (!filterText.trim()) return true;
    const term = filterText.toLowerCase();
    return (
      (lead.nombre && lead.nombre.toLowerCase().includes(term)) ||
      (lead.telefono_local && lead.telefono_local.toLowerCase().includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.website && lead.website.toLowerCase().includes(term)) ||
      (lead.direccion && lead.direccion.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Generate and download CSV strictly from real leads
  const handleDownloadCsv = () => {
    if (!leads.length) return;

    const headers = [
      'Nombre',
      'Telefono_Local',
      'Telefono_Internacional',
      'WhatsApp_Numero',
      'WhatsApp_Link',
      'Website',
      'Direccion',
      'Google_Maps_URL',
      'Email',
    ];

    const escapeCsv = (str?: string) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((lead) => [
      escapeCsv(lead.nombre),
      escapeCsv(lead.telefono_local),
      escapeCsv(lead.telefono_internacional),
      escapeCsv(lead.whatsapp_numero),
      escapeCsv(lead.whatsapp_link || (lead.whatsapp_numero ? `https://wa.me/${lead.whatsapp_numero.replace(/\D/g, '')}` : '')),
      escapeCsv(lead.website),
      escapeCsv(lead.direccion),
      escapeCsv(lead.google_maps_url),
      escapeCsv(lead.email),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `franja-leads-${(querySummary || 'export').replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#111827] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl mb-12">
      {/* Top action bar */}
      <div className="p-4 sm:p-6 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827]/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              {t('results-title')}
            </h3>
            <span className="font-mono text-xs bg-emerald-500/10 text-[#10B981] px-2 py-0.5 rounded-full border border-emerald-500/20 tabular-nums">
              {leads.length} {language === 'es' ? 'registros' : 'records'}
            </span>
          </div>
          {querySummary && (
            <p className="text-xs text-slate-400 mt-0.5">
              {querySummary}
            </p>
          )}
        </div>

        {/* Action buttons (Sheets + CSV) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t('btn-open-sheets')}</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </a>
          )}

          <button
            onClick={handleDownloadCsv}
            disabled={!leads.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1F2937] hover:bg-[#283548] text-slate-200 border border-white/[0.1] text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>{t('btn-download-csv')}</span>
          </button>
        </div>
      </div>

      {/* Filter row */}
      {leads.length > 0 && (
        <div className="px-6 py-3 border-b border-white/[0.06] bg-[#0B0F17]/50 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t('search-filter-placeholder')}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      {leads.length === 0 ? (
        <div className="py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-white/[0.06] flex items-center justify-center mx-auto mb-3 text-slate-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-300 mb-1">
            {t('empty-results-title')}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('empty-results-desc')}
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-12 px-6 text-center text-xs text-slate-400">
          {t('no-filter-match')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0B0F17]/70 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">{t('col-name')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-phone')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-whatsapp')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-website')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-address')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-maps')}</th>
                <th className="py-3 px-4 font-semibold">{t('col-email')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedLeads.map((lead, idx) => {
                const cleanPhone = lead.telefono_internacional || lead.telefono_local || '';
                const waLink =
                  lead.whatsapp_link ||
                  (lead.whatsapp_numero
                    ? `https://wa.me/${lead.whatsapp_numero.replace(/\D/g, '')}`
                    : cleanPhone
                    ? `https://wa.me/${cleanPhone.replace(/\D/g, '')}`
                    : null);

                return (
                  <tr
                    key={lead.id || `lead_${idx}`}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Name & category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{lead.nombre}</div>
                      {lead.categoria && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {lead.categoria}
                        </div>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {cleanPhone ? (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1 hover:text-[#10B981] transition-colors"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{cleanPhone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-[#10B981] hover:bg-emerald-500/20 font-mono text-[11px] font-medium border border-emerald-500/20 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Website */}
                    <td className="py-3 px-4">
                      {lead.website ? (
                        <a
                          href={
                            lead.website.startsWith('http')
                              ? lead.website
                              : `https://${lead.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 max-w-[140px] truncate"
                          title={lead.website}
                        >
                          <Globe className="w-3 h-3 shrink-0 opacity-70" />
                          <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 max-w-[200px] text-slate-300 truncate" title={lead.direccion}>
                      {lead.direccion ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{lead.direccion}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Google Maps link */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.google_maps_url ? (
                        <a
                          href={lead.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                        >
                          <span>Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4">
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-[#10B981] truncate max-w-[140px]"
                          title={lead.email}
                        >
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredLeads.length > pageSize && (
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0B0F17]/70 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 tabular-nums">
            {t('pagination-page', { page: currentPage, totalPages })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-[#1F2937] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label={t('pagination-prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-[#1F2937] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label={t('pagination-next')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
