import stl from "./Home.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricImage, ActiveSelection, Textbox } from "fabric";
import "./Styles.css";
import { FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const presets = [
  {
    preset: 1,
    src: "../Preset1.png",
  },
  {
    preset: 2,
    src: "../Preset2.png",
  },
  {
    preset: 3,
    src: "../Preset3.png",
  },
  {
    preset: 4,
    src: "../Preset4.png",
  },
  {
    preset: 5,
    src: "../Preset5.png",
  },
  {
    preset: 6,
    src: "../Preset6.png",
  },
  {
    preset: 7,
    src: "../Preset7.png",
  },
  {
    preset: 8,
    src: "../Preset8.png",
  },
  {
    preset: 9,
    src: "../Preset9.png",
  },
  {
    preset: 10,
    src: "../Preset10.png",
  },
  {
    preset: 11,
    src: "../Preset11.png",
  },
  {
    preset: 12,
    src: "../Preset12.png",
  },
  {
    preset: 13,
    src: "../Preset13.png",
  },
  {
    preset: 14,
    src: "../Preset14.png",
  },
  {
    preset: 15,
    src: "../Preset15.png",
  },
  {
    preset: 16,
    src: "../Preset16.png",
  },
  {
    preset: 17,
    src: "../Preset17.png",
  },
];

const Home = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input
  const [canvas, setCanvas] = useState(false);
  const [fileArray, setFileArray] = useState([]);
  const [textArray, setTextArray] = useState([]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
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
          if (fileArray.length === 0) {
            canvas.setWidth(imgObj.width);
            canvas.setHeight(imgObj.height);
          }
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

    const selection = new ActiveSelection([objects[index]], {
      canvas: canvas,
    });

    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
  };

  const canvasClicked = () => {
    const currentObject = canvas.getActiveObject();
    console.log(currentObject);
  };

  const addPreset = (img) => {
    const imgObj = new Image();
    imgObj.src = img.src;
    imgObj.onload = () => {
      if (fileArray.length === 0) {
        canvas.setWidth(imgObj.width);
        canvas.setHeight(imgObj.height);
      }
      const fabricImg = new FabricImage(imgObj);
      fabricImg.set({
        left: 0,
        top: 0,
        selectable: true,
      });
      setFileArray((prev) => [
        ...prev,
        { ...fabricImg, name: `Preset ${img.preset}` },
      ]);
      canvas.add(fabricImg);
      canvas.renderAll();
    };
  };

  const handleAddText = () => {
    const textObject = new Textbox("YAKUB", {
      left: 0, //Take the block's position
      top: 0,
      fill: "white",
    });
    textObject.set({
      scaleX: 1,
      scaleY: 1,
    });
    canvas.add(textObject);
    setTextArray((prev) => [...prev, textObject]);
    canvas.renderAll();
  };

  const focusText = (index) => {
    const objects = canvas.getObjects();
    canvas.discardActiveObject();

    const selection = new ActiveSelection([objects[index]], {
      canvas: canvas,
    });

    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
  };

  const deleteText = (index) => {
    const objects = canvas.getObjects();

    const updatedTextArray = textArray.filter((_, i) => i !== index);
    setTextArray(updatedTextArray);

    if (objects.length > index) {
      canvas.remove(objects[index]);
      canvas.renderAll();
    }
  };

  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      // Create an anchor element and trigger a download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "YAKUB.png";
      link.click();
    }
  };

  return (
    <div className={stl.home} onClick={canvasClicked}>
      <div className={stl.appWrapper}>
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
          <button className={stl.addCta}>Presets</button>
          {presets.map((preset, index) => (
            <div
              className={stl.fileBlock}
              key={index}
              onClick={() => addPreset(preset)}
            >
              <img src={preset.src} alt="Preset" className={stl.presetImg} />
              <span>Preset {index + 1}</span>
            </div>
          ))}
        </div>
        <div className={stl.assetsArray}>
          <button className={stl.addCta} onClick={handleAddImageClick}>
            <FaPlus />
            Add Image
          </button>
          {fileArray.map((file, index) => (
            <div
              className={stl.fileBlock}
              key={index}
              onClick={() => {
                focusImage(index);
              }}
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

        <div className={stl.assetsArray}>
          <button className={stl.addCta} onClick={handleAddText}>
            <FaPlus />
            Add Text
          </button>
          {textArray.map((text, index) => (
            <div
              className={stl.fileBlock}
              key={index}
              onClick={() => {
                focusText(index);
              }}
            >
              <span>Text {index + 1}</span>
              <FaTrashCan
                className={stl.trash}
                onClick={() => deleteText(index)}
              />
            </div>
          ))}
        </div>
        <button className={stl.saveCta} onClick={saveCanvasAsImage}>
          Save Image
        </button>
      </div>
    </div>
  );
};

export default Home;
