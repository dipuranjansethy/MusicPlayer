import React, { useState, useRef, useEffect } from "react";
import { uploadAudio } from "./assets/utils/cloudinary";
import { BarLoader } from "react-spinners";
import photo  from "./download.png";

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [audio, setAudio] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [counter, setCounter] = useState(0);
  const audioRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [currentSong,setCurrentSong]=useState(0)
 
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Save the current index to local storage before unloading
      localStorage.setItem('current_song', currentIndex);
    };

    const handleLoad = () => {
      // Retrieve the current index from local storage on page load
      const savedIndex = localStorage.getItem('current_song');
      if (savedIndex !== null) {
        setCurrentIndex(parseInt(savedIndex, 10));
        playAudio(data[parseInt(savedIndex, 10)].audio_url, parseInt(savedIndex, 10));
      }
    };

    // Add the event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Add the event listener for page load
    window.addEventListener('load', handleLoad);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [currentIndex, playlist]);
  const onChangeHandler = async (e) => {
    const file = e.target.files[0];

    try {
      setLoading(true);
      const res = await uploadAudio(file);
      setAudio(res);
      console.log("res", res);
      setLoading(false);
    } catch (error) {
      setError(true);
      alert("something went wrong... while uploading")
      console.log("errrrrr", error);
    }

    // if (file) {
    //   const newTrack = {
    //     id: Date.now(),
    //     name: file.name,
    //     file,
    //   };
    // }
  };

  const addToPlaylist = () => {
    audio && setPlaylist((oldPlaylist) => [...oldPlaylist, audio]);
    audio && localStorage.setItem("playlist", JSON.stringify([...playlist, audio]));
  };

  // console.log("playlist", playlist);
  // console.log("audio", audio);

  const playAudio = (file, index) => {
    localStorage.setItem("current_song",index)
    console.log(index)
    audioRef.current.src = file;
    console.log(file);
    audioRef.current.currentTime =JSON.parse(localStorage.getItem('currentPlayingTime')); // Set the starting time to 2 minutes (120 seconds)
    audioRef.current.play();
    setCurrentIndex(index);
    setHighlightedIndex(index);
  };
  
  const data = JSON.parse(localStorage.getItem("playlist"));
  console.log("data", data);
  // console.log(counter);

  const handleEnded = () => {
    if (currentIndex < data.length - 1) {
      const nextIndex = currentIndex + 1;
      // localStorage.setItem("current_song",currentIndex)
      setCurrentIndex(nextIndex);
      setCounter(0);
      localStorage.setItem("currentPlayingTime", "0");
      playAudio(data[nextIndex].audio_url, nextIndex);
      console.log(nextIndex)
    } else {
      

      // If it's the last song, go back to the first song
      setCurrentIndex(0);
      setCounter(0);
      localStorage.setItem("current_song","0")
      localStorage.setItem("currentPlayingTime", "0");
      playAudio(data[0].audio_url, 0);
    }
  };
  
  useEffect(() => {
    const storedTime = localStorage.getItem("currentPlayingTime");
    if (storedTime !== null) {
      setCounter(parseFloat(storedTime));
      audioRef.current.currentTime = parseFloat(storedTime);
    }

    const handleTimeUpdate = () => {
      const currentTime = audioRef.current.currentTime;
      setCounter(currentTime);
      localStorage.setItem("currentPlayingTime", currentTime.toString());
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio, playlist]);
  console.log(counter);

  return (
    <>
    <div className="audio-player">

      <h1 style={{fontSize:"50px"}}>Audio Player</h1>
      <img src={photo} alt="img" style={{padding:"20px"}} />
      <br />
      {
            (
              <>
                <div style={{fontSize:"2rem"}}>Now Playing........</div>
                <div style={{fontSize:"2rem"}}>{data && data[currentIndex].name}</div>
                <br />
                <audio ref={audioRef} onEnded={handleEnded} controls />

              </>
            )
          }
          <br />
          <br />
          <br />
      <>
      <div style={{ display: "flex", alignItems: "center" }}>
  <input
    type="file"
    accept="audio/*"
    onChange={onChangeHandler}
    style={{
      cursor: "pointer",
      marginLeft: "-5%",
      width: "100%",
      border: "none",
      height: "100%",
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      borderRadius: "10px",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    }}
  />
  {!loading ? (
    <button
      className="addtoplaylist"
      type="submit"
      onClick={addToPlaylist}
      style={{
        marginTop:"-19px",
        marginLeft: "10px",
        padding: "5px",
        borderRadius: "10px",
        backgroundColor: "#white",
        color: "black",
        border: "none",
        cursor: "pointer",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
        width:"full"
      }}
    >
      Add to Playlist
    </button>
  ) : (
    <span style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
      <BarLoader color="#36d7b7" />
      <span style={{ marginLeft: "5px" }}>Uploading...</span>
    </span>
  )}
</div>

      </>
          
      <h1>Playlist</h1>
      <div className="playlist">

        {data && data.map((item, index) => (
          <div
            key={item.id}
            className={`playlist-item ${
              highlightedIndex === index ? "highlighted" : ""
            }`}
          >
            <div>{item.name}</div>
            <button onClick={() => playAudio(item.audio_url, index)}>Play</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AudioPlayer;
