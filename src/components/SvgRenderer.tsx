const SvgRenderer: React.FC<{ svgString: string; className?: string; style?: React.CSSProperties }> = ({ 
  svgString, 
  className, 
  style 
}) => {
  // Remove scripts maliciosos do SVG (básico)
  const sanitizedSvg = svgString.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  return (
    <div 
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
    />
  );
};

export default SvgRenderer;