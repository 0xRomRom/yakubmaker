import stl from "./Home.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricImage, ActiveSelection } from "fabric";
import "./Styles.css";
import { FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const Home = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input
  const [canvas, setCanvas] = useState(false);
  const [fileArray, setFileArray] = useState([]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        // width: 500,
        // height: 500,
      });
      initCanvas.backgroundColor = "#000";
      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = () => {
          canvas.setWidth(imgObj.width);
          canvas.setHeight(imgObj.height);
          const fabricImg = new FabricImage(imgObj);
          fabricImg.set({
            left: 0,
            top: 0,
            selectable: true,
          });
          setFileArray((prev) => [...prev, { ...fabricImg, name: file.name }]);
          canvas.add(fabricImg);
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    console.log(fileArray);
  }, [fileArray]);

  const deleteImage = (index) => {
    const objects = canvas.getObjects();

    const updatedFileArray = fileArray.filter((_, i) => i !== index);
    setFileArray(updatedFileArray);

    if (objects.length > index) {
      canvas.remove(objects[index]);
      canvas.renderAll();
    }
  };

  const focusImage = (index) => {
    const objects = canvas.getObjects();
    canvas.discardActiveObject();
    console.log(objects[index]);
    const selection = new ActiveSelection([objects[index]], {
      canvas: canvas,
    });

    console.log(sel);
    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
  };

  return (
    <div className={stl.home}>
      <h1 className={stl.title}>
        <img
          src="../Yakublogo.webp"
          alt="Yakublogo"
          className={stl.yakubLogo}
        />{" "}
        Maker
      </h1>
      <canvas
        id="canvas"
        ref={canvasRef}
        className={stl.canvas}
        width="100vw"
      />
      <div className={stl.assetsArray}>
        <button className={stl.addCta} onClick={handleAddImageClick}>
          <FaPlus />
          Add Image
        </button>
        {fileArray.map((file, index) => (
          <div
            className={stl.fileBlock}
            key={index}
            onClick={() => focusImage(index)}
          >
            <span>{file?.name}</span>
            <FaTrashCan
              className={stl.trash}
              onClick={() => deleteImage(index)}
            />
          </div>
        ))}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={stl.hidden}
        />
      </div>
    </div>
  );
};

export default Home;
