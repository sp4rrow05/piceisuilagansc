type Props = {
  page: number
  total: number
  setPage: (p: number) => void
}

export default function Pagination({ page, total, setPage }: Props) {
  if (total <= 1) return null

  return (
    <div className="flex justify-between items-center p-3 border-t">
      <span className="text-sm text-gray-500">
        Page {page} of {total}
      </span>

      <div className="flex gap-2">
        <button
          className="btn-secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <button
          className="btn-secondary"
          disabled={page === total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
