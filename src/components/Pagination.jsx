function getVisiblePages(currentPage, totalPages) {
  const first = Math.max(1, currentPage - 2);
  const last = Math.min(totalPages, currentPage + 2);
  const pages = [];

  for (let page = first; page <= last; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Anime results pages">
      <button
        type="button"
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>
      {visiblePages[0] > 1 && (
        <>
          <button type="button" disabled={disabled} onClick={() => onPageChange(1)} aria-label="Page 1">
            1
          </button>
          {visiblePages[0] > 2 && <span className="pagination-ellipsis" aria-hidden="true">…</span>}
        </>
      )}
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          disabled={disabled}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={page === currentPage ? 'current' : ''}
        >
          {page}
        </button>
      ))}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="pagination-ellipsis" aria-hidden="true">…</span>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(totalPages)}
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        type="button"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
