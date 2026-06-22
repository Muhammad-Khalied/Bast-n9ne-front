'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Check } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  selectable = false,
  onRowClick,
  onSelectionChange,
  isLoading = false,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      const result = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortField, sortDirection]);

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(data.map((d) => d[keyField]));
      setSelectedIds(allIds);
      onSelectionChange?.(data);
    }
  };

  const toggleSelect = (row: T) => {
    const newSelected = new Set(selectedIds);
    const id = row[keyField];
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(data.filter((d) => newSelected.has(d[keyField])));
  };

  const getValue = (row: T, accessor: string) => {
    return accessor.split('.').reduce((obj: any, key) => obj?.[key], row);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-brand-ivory-dark rounded-brand-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-ivory-50">
                {columns.map((col, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ivory-dark">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-brand-ivory-light rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-ivory-dark rounded-brand-lg overflow-hidden">
      {/* Selection bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="px-4 py-2 bg-brand-sage/10 border-b border-brand-sage/20 flex items-center gap-3">
          <span className="text-sm text-brand-sage font-medium">{selectedIds.size} selected</span>
          <button
            onClick={() => { setSelectedIds(new Set()); onSelectionChange?.([]); }}
            className="text-xs text-brand-muted hover:text-brand-charcoal transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-brand-ivory-50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleSelectAll} className="w-4 h-4 border border-brand-ivory-dark rounded flex items-center justify-center hover:border-brand-sage transition-colors">
                    {selectedIds.size === data.length && data.length > 0 && <Check className="w-3 h-3 text-brand-sage" />}
                  </button>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className={`px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-brand-charcoal' : ''
                  } ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(String(col.accessor))}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-brand-ivory-dark">
                        {sortField === String(col.accessor) ? (
                          sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-ivory-dark">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-brand-muted text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-brand-ivory-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${
                    selectedIds.has(row[keyField]) ? 'bg-brand-sage/5' : ''
                  }`}
                >
                  {selectable && (
                    <td className="w-10 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSelect(row)}
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                          selectedIds.has(row[keyField]) ? 'border-brand-sage bg-brand-sage' : 'border-brand-ivory-dark hover:border-brand-sage'
                        }`}
                      >
                        {selectedIds.has(row[keyField]) && <Check className="w-3 h-3 text-white" />}
                      </button>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={String(col.accessor)} className={`px-4 py-3 text-sm text-brand-charcoal ${col.className || ''}`}>
                      {col.render ? col.render(getValue(row, String(col.accessor)), row) : getValue(row, String(col.accessor))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
