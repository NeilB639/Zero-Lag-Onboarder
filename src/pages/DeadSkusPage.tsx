import { useState } from 'react';
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid';
import { useDeadSkusTable, useReports } from '../hooks/useReports';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { useUiStore } from '../store/uiStore';

export const DeadSkusPage = () => {
  const { search } = useUiStore();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const reports = useReports();
  const deadSkus = useDeadSkusTable({
    reportId: reports.data?.[0]?.id,
    search,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  if (deadSkus.isLoading) return <p>Loading dead SKU table...</p>;

  return (
    <div className="rounded-xl bg-white p-2 dark:bg-slate-900">
      <DataGrid
        rows={deadSkus.data?.rows ?? []}
        rowCount={deadSkus.data?.count ?? 0}
        columns={[
          { field: 'sku', headerName: 'SKU', flex: 1, minWidth: 140 },
          { field: 'product_name', headerName: 'Product', flex: 1.2, minWidth: 220 },
          { field: 'inventory', headerName: 'Inventory', width: 110 },
          {
            field: 'sales_price',
            headerName: 'Sales Price',
            width: 130,
            valueFormatter: (params) => formatCurrency(Number(params), 'USD'),
          },
          {
            field: 'trapped_capital',
            headerName: 'Trapped Capital',
            width: 150,
            valueFormatter: (params) => formatCurrency(Number(params), 'USD'),
          },
          {
            field: 'last_sale_date',
            headerName: 'Last Sale',
            width: 150,
            valueFormatter: (params) => formatDateTime(params ? String(params) : null),
          },
        ]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        loading={deadSkus.isFetching}
        disableRowSelectionOnClick
      />
    </div>
  );
};
