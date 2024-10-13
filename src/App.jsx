import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Import the styles here

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchImages = async (searchQuery = '') => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const endpoint = searchQuery
        ? `https://api.unsplash.com/search/photos?client_id=lghAGHGXG1JixJFfimhB43gDbvrv__e7C4388gyDoMs&page=${page}&per_page=10&query=${searchQuery}`
        : `https://api.unsplash.com/photos?client_id=lghAGHGXG1JixJFfimhB43gDbvrv__e7C4388gyDoMs&page=${page}&per_page=10`;

      const response = await axios.get(endpoint);

      const newImages = searchQuery ? response.data.results : response.data;

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        setImages((prevImages) =>
          page === 1 ? newImages : [...prevImages, ...newImages]
        );
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(searchTerm);
  }, [page, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (windowHeight + scrollTop >= documentHeight - 10 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(query);
    setPage(1);
    setHasMore(true);
  };

  return (
    <>
      <nav className="navbar">
        <h1>GeekGallery</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </nav>
      <div className="image-gallery">
        {images.map((image) => (
          <div key={image.id} className="image-container">
            <a href={image.links.html} target="_blank" rel="noopener noreferrer">
              <img src={image.urls.small} alt={image.alt_description} />
            </a>
            <div className="image-overlay">
              <p>{image.alt_description || 'No description available'}</p>
              <p>By: {image.user.name}</p>
            </div>
          </div>
        ))}
        {loading && <p>Loading more images...</p>}
        {!hasMore && <p>No more images to load.</p>}
      </div>
    </>
  );
};

export default ImageGallery;
