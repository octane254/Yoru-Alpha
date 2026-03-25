function WesternMode({ pages, currentPage, setCurrentPage, zoom }) {
  return (
    <div className="reader-page-view">
      <div
        className="tap-left"
        onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
      />
      <img
        src={pages[currentPage]}
        alt={`Page ${currentPage + 1}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      />
      <div
        className="tap-right"
        onClick={() => setCurrentPage(p => Math.min(p + 1, pages.length - 1))}
      />
    </div>
  )
}

export default WesternMode