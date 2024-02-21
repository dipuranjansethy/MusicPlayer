export const uploadAudio = async (audioFile) => {
    if (audioFile) {
      // Create a FormData object to send the file to Cloudinary
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("upload_preset", "audio_app");
  
      try {
        console.log("first")
        // Make a POST request to Cloudinary API
        const response = await fetch("https://api.cloudinary.com/v1_1/dmqz317kh/auto/upload", {
            // https://api.cloudinary.com/v1_1/dyanlnbx0/auto/upload
            // https://api.cloudinary.com/v1_1/dmqz317kh/auto/upload
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error uploading audio: ${response.statusText}`);
        }
  
        const data = await response.json();
        // Set the URL of the uploaded audio in the state
        const newTrack = {
          id: Date.now(),
          name: data.original_filename,
          audio_url: data.secure_url,
        };
  
        return newTrack;
      } catch (error) {
        console.error("Error uploading audio:", error);
        alert("Error uploading audio");
      }
    }
  };
  