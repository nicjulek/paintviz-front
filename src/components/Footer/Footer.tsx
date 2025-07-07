import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <p>PaintViz | {currentYear}</p>
    </footer>
  );
};

export default Footer;