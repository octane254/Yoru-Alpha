function MangaMode({ pages, currentPage, setCurrentPage, zoom }) {
  function goNext() {
    // RTL: "next" goes to lower index (right side of page)
    setCurrentPage(p => Math.max(p - 1, 0))
  }
  function goPrev() {
    setCurrentPage(p => Math.min(p + 1, pages.length - 1))
  }

  return (
    <div className="reader-page-view" style={{ direction: 'rtl' }}>
      <div className="tap-left" onClick={goNext} />
      <img
        src={pages[currentPage]}
        alt={`Page ${currentPage + 1}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      />
      <div className="tap-right" onClick={goPrev} />
    </div>
  )
}

export default MangaMode