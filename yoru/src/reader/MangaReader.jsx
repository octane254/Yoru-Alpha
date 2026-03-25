import { useState, useEffect, useRef } from 'react'
import MangaMode from './MangaMode'
import WebtoonMode from './WebtoonMode'
import WesternMode from './WesternMode'

function MangaReader({ chapterId }) {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [readingMode, setReadingMode] = useState('manga')
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const readerRef = useRef(null)

  // Fetch pages from MangaDex when chapter changes
  useEffect(() => {
    async function fetchPages() {
      setIsLoading(true)
      try {
        const res = await fetch(
          `https://api.mangadex.org/at-home/server/${chapterId}`
        )
        const data = await res.json()
        const baseUrl = data.baseUrl
        const hash = data.chapter.hash
        const imageUrls = data.chapter.data.map(
          (filename) => `${baseUrl}/data/${hash}/${filename}`
        )
        setPages(imageUrls)

        // Restore saved progress for this chapter
        const saved = localStorage.getItem(`progress-${chapterId}`)
        setCurrentPage(saved ? parseInt(saved) : 0)
      } catch (err) {
        console.error('Failed to load chapter:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (chapterId) fetchPages()
  }, [chapterId]) // runs every time chapterId changes

  // Save progress whenever page changes
  useEffect(() => {
    if (chapterId && pages.length > 0) {
      localStorage.setItem(`progress-${chapterId}`, currentPage)
    }
  }, [currentPage, chapterId, pages.length])

  // Fullscreen toggle
  function toggleFullscreen() {
    if (!isFullscreen) {
      readerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (isLoading) return <div className="reader-loading">Loading chapter...</div>

  return (
    <div className="reader-shell" ref={readerRef}>

      {/* Top toolbar */}
      <div className="reader-toolbar">
        <span>{currentPage + 1} / {pages.length}</span>

        <select value={readingMode} onChange={e => setReadingMode(e.target.value)}>
          <option value="manga">Manga (RTL)</option>
          <option value="webtoon">Webtoon (Scroll)</option>
          <option value="western">Western (LTR)</option>
        </select>

        <button onClick={() => setZoom(z => Math.min(z + 0.25, 3))}>Zoom +</button>
        <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}>Zoom -</button>
        <button onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Reading area — swaps based on mode */}
      {readingMode === 'manga' && (
        <MangaMode
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          zoom={zoom}
        />
      )}
      {readingMode === 'webtoon' && (
        <WebtoonMode pages={pages} zoom={zoom} />
      )}
      {readingMode === 'western' && (
        <WesternMode
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          zoom={zoom}
        />
      )}
    </div>
  )
}

export default MangaReader