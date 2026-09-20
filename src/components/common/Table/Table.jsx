import { cn } from '../../../utils/cn';

// Generic column-config table — feed it `columns` ({key, header, render, align})
// and `data`, reusable for any row shape (seller listings today, an Admin
// products/orders table later) without changing this file.
export function Table({ columns, data, getRowKey = (row) => row.id, className }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-neutral-100 bg-neutral-0', className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-100 bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-xs font-medium tracking-wide text-neutral-500 uppercase',
                  column.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {data.map((row) => (
            <tr key={getRowKey(row)} className="transition-colors duration-150 hover:bg-neutral-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3', column.align === 'right' ? 'text-right' : 'text-left')}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
