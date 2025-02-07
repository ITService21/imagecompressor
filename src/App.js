import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageCompressor = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
    const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
    setCompressedImages(compressedFiles);
  };

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 0.1, // Adjust the max size of the image in MB
      useWebWorker: true,
    };

    try {
      return await imageCompression(imageFile, options);
    } catch (error) {
      console.error("Compression error:", error);
      return null;
    }
  };

  const handleDownload = (image, index) => {
    if (image) {
      const url = URL.createObjectURL(image);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compressed_image_${index + 1}.jpg`; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-5 text-center bg-green-500">
      <h2 className="text-lg font-bold">Image Compressor</h2>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      {compressedImages.length > 0 && (
        <div className="mt-4">
          <p>Compressed Image Previews:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {compressedImages?.map((image, index) => (
              image && (
                <div key={index} className="text-center w-[80vw] md:w-[600px] bg-red-500 flex flex-row">
                  <div className="">                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Compressed Preview ${index + 1}`}
                    className="max-w-xs mx-auto mt-2 "
                  /></div>
                  <div className="mt-[20px]">                  <button
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleDownload(image, index)}
                  >
                    Download Image {index + 1}
                  </button></div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;