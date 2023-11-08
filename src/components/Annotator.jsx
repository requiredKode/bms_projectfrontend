import React from 'react';
import { PdfAnnotator } from 'react-pdf-annotator';
import 'react-pdf-annotator/build/css/react-pdf-annotator.css';

const Annotator = ({ pdfFile }) => {
  // State para mantener las anotaciones
  const [annotations, setAnnotations] = React.useState([]);

  // Método para guardar las anotaciones
  const saveAnnotations = (newAnnotations) => {
    setAnnotations(newAnnotations);
    // Aquí puedes enviar las anotaciones a tu servidor o almacenarlas de alguna manera
  };

  return (
    <PdfAnnotator
      pdfDocument={pdfFile}
      annotations={annotations}
      onAnnotationSelected={annotation => console.log('selected', annotation)}
      onAnnotation deselected={annotation => console.log('deselected', annotation)}
      onAnnotationAdded={annotation => saveAnnotations([...annotations, annotation])}
    />
  );
};

export default Annotator;
