import React from "react";
 import '../App.css';

 const Footer: React.FC = () => (
  <footer className="text-white py-3 mt-auto" style={{ backgroundColor: 'var(--rosa)' }}>
   <div className="container text-center small">
    &copy; {new Date().getFullYear()} PaintViz &mdash; Prototipagem
   </div>
  </footer>
 );

 export default Footer;
 export {};