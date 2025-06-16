import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetectionUpload = () => {
  const imageRef = useRef();
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  

    if (file) {
      const img = imageRef.current;
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const detections = await faceapi.detectAllFaces(img);
        setFaceDetected(detections.length > 0);
        if (detections.length === 0) {
          alert('No face detected. Please upload a photo with a human face.');
        }
      };
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <img ref={imageRef} alt="" style={{ display: 'none' }} />
      {faceDetected && <p>✅ Human face detected!</p>}
    </div>
  );
};

export default FaceDetectionUpload;
