import React, { useState, useEffect } from 'react';
import pptxgenjs from 'pptxgenjs';

const PresentationTool = () => {
  const [slides, setSlides] = useState([{ id: 1, content: '', template: 'blank', animations: [] }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [templates, setTemplates] = useState(['blank', 'title', 'content', 'image']);
  const [pptx, setPptx] = useState(null);

  useEffect(() => {
    setPptx(new pptxgenjs());
  }, []);

  const addSlide = (template = 'blank') => {
    const newSlide = { id: slides.length + 1, content: '', template, animations: [] };
    setSlides([...slides, newSlide]);
    if (pptx) {
      const slide = pptx.addSlide();
      slide.addText(newSlide.content, { x: 1, y: 1, w: '80%', h: 1 });
    }
  };

  const removeSlide = (id) => {
    setSlides(slides.filter(slide => slide.id !== id));
    if (currentSlide >= slides.length - 1) {
      setCurrentSlide(slides.length - 2);
    }
    // Note: pptxgenjs doesn't have a direct method to remove slides
    // We would need to recreate the presentation without the removed slide
  };

  const updateSlideContent = (id, content) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, content } : slide
    ));
    if (pptx) {
      const slideIndex = slides.findIndex(slide => slide.id === id);
      const pptxSlide = pptx.getSlides()[slideIndex];
      pptxSlide.addText(content, { x: 1, y: 1, w: '80%', h: 1 });
    }
  };

  const changeTemplate = (id, template) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, template } : slide
    ));
    // Here you would apply the template to the pptx slide
    // This would depend on how you've defined your templates
  };

  const addAnimation = (id, animation) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, animations: [...slide.animations, animation] } : slide
    ));
    // Here you would add the animation to the pptx slide
    // pptxgenjs supports basic animations, but the exact implementation would depend on the animation type
  };

  const insertMedia = (id, mediaType, mediaUrl) => {
    const mediaContent = `<${mediaType} src="${mediaUrl}"></${mediaType}>`;
    updateSlideContent(id, slides.find(slide => slide.id === id).content + mediaContent);
    if (pptx) {
      const slideIndex = slides.findIndex(slide => slide.id === id);
      const pptxSlide = pptx.getSlides()[slideIndex];
      if (mediaType === 'img') {
        pptxSlide.addImage({ path: mediaUrl, x: 1, y: 1, w: 2, h: 2 });
      }
      // Add other media types as needed
    }
  };

  const navigateSlide = (index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  const savePptx = async () => {
    if (pptx) {
      try {
        await pptx.writeFile({ fileName: 'presentation.pptx' });
        console.log('Presentation saved successfully');
      } catch (error) {
        console.error('Error saving presentation:', error);
      }
    }
  };

  return (
    <div className="presentation-tool">
      <div className="toolbar">
        <button onClick={() => addSlide()}>Add Slide</button>
        <button onClick={() => removeSlide(slides[currentSlide].id)}>Remove Slide</button>
        <button onClick={() => navigateSlide(currentSlide - 1)} disabled={currentSlide === 0}>Previous</button>
        <button onClick={() => navigateSlide(currentSlide + 1)} disabled={currentSlide === slides.length - 1}>Next</button>
        <select onChange={(e) => changeTemplate(slides[currentSlide].id, e.target.value)}>
          {templates.map(template => (
            <option key={template} value={template}>{template}</option>
          ))}
        </select>
        <button onClick={() => addAnimation(slides[currentSlide].id, 'fade')}>Add Fade Animation</button>
        <button onClick={() => insertMedia(slides[currentSlide].id, 'img', 'placeholder.jpg')}>Insert Image</button>
        <button onClick={savePptx}>Save as .pptx</button>
      </div>
      <div className="slide-preview">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${index === currentSlide ? 'active' : ''}`}
            onClick={() => navigateSlide(index)}
          >
            Slide {slide.id} - {slide.template}
          </div>
        ))}
      </div>
      <div className="slide-editor">
        <textarea
          value={slides[currentSlide].content}
          onChange={(e) => updateSlideContent(slides[currentSlide].id, e.target.value)}
          placeholder="Enter slide content..."
        />
      </div>
    </div>
  );
};

export default PresentationTool;
