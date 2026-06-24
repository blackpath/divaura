import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:     { label: 'Pending',     className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved:    { label: 'Approved',    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected:    { label: 'Rejected',    className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  paid:        { label: 'Paid',        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  packed:      { label: 'Packed',      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  shipped:     { label: 'Shipped',     className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  delivered:   { label: 'Delivered',   className: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  cancelled:   { label: 'Cancelled',   className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  open:        { label: 'Open',        className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  resolved:    { label: 'Resolved',    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  closed:      { label: 'Closed',      className: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium border tracking-wide', config.className)}>
      {config.label}
    </span>
  )
}