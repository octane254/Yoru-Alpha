function WebtoonMode({ pages, zoom }) {
  return (
    <div className="reader-scroll-view">
      {pages.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Page ${index + 1}`}
          style={{
            width: `${zoom * 100}%`,
            display: 'block',
            margin: '0 auto'
          }}
        />
      ))}
    </div>
  )
}

export default WebtoonMode