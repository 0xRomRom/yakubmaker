import stl from "./Home.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricImage, ActiveSelection, Textbox } from "fabric";
import "./Styles.css";
import { FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";

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
  const fileInputRef = useRef(null);
  const [canvas, setCanvas] = useState(false);
  const [fileArray, setFileArray] = useState([]);
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (balance) return;
    const url =
      "https://mainnet.helius-rpc.com/?api-key=a337d1f8-468e-4627-8fb9-3145064cfe8e";

    const getAssetsByOwner = async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: "F8zic9M9j2df3sTFtQdLTUSa4rQakTt1vZp2xwnMozt3",
            page: 1,
            limit: 1000,
            displayOptions: {
              showFungible: true,
            },
          },
        }),
      });
      const { result } = await response.json();
      const yakubBalance = Math.floor(
        result.items[0].token_info.balance / 1_000_000
      );
      setBalance(yakubBalance || 0);

      const percentage = Math.floor((yakubBalance / 1_000_000) * 100);
      setProgress(percentage);
      console.log(percentage);
      console.log(yakubBalance);
      console.log("Assets by Owner: ", result.items);
    };
    getAssetsByOwner();
  }, []);

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

  const addPreset = (img) => {
    const imgObj = new Image();
    imgObj.src = img.src;
    imgObj.onload = () => {
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
      left: 0,
      top: 0,
      fill: "white",
      editable: true,
      fontFamily: "Helvetica",
    });

    canvas.add(textObject);

    setFileArray((prev) => [...prev, { ...textObject, name: "Text" }]);
    canvas.renderAll();
  };

  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "YAKUB.png";
      link.click();
    }
  };

  const handleCopy = async () => {
    navigator.clipboard
      .writeText("F8zic9M9j2df3sTFtQdLTUSa4rQakTt1vZp2xwnMozt3")
      .then(() => {
        alert(`Thanks so much <3 uwu`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className={stl.home}>
      {fileArray.length === 0 && (
        <div className={stl.overlay}>
          <span>
            Yakub Maker is <u>the</u> tool to Yakibufy anything!
          </span>
          <span>Start by uploading your image.</span>
          <img src="../Preset2.png" alt="Yakub" className={stl.overlayImg} />
        </div>
      )}
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
          <button className={stl.addCta} onClick={handleAddText}>
            <FaPlus />
            Add Text
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

        <button className={stl.saveCta} onClick={saveCanvasAsImage}>
          Save Image
        </button>
        <div className={stl.devBox}>
          <span>
            Yakub Maker is an unofficial community tool by{" "}
            <span
              className={stl.dev}
              onClick={() => window.open("https://x.com/0xromrom", "_blank")}
            >
              0xRomRom
            </span>
          </span>
          <span>Tip me some $YAKUB ♥</span>
          <div className={stl.goalbox}>
            <span>Goal: 1M $YAKUB</span>
            <div className={stl.trackBox}>
              <img
                src="../Preset2.png"
                alt="Yakub"
                className={stl.progressyakub}
                style={{
                  left: `calc(${progress}% - 10px)`,
                }}
              />
              <div className={stl.track}></div>
              <span className={stl.zero}>0%</span>
              <span className={stl.oneM}>100%</span>
              <span className={stl.counter}>{balance.toLocaleString()}</span>
            </div>
          </div>
          <div className={stl.walletBox}>
            <span className={stl.walletSpan} onClick={handleCopy}>
              F8zic9M9j2df3sTFtQdLTUSa4rQakTt1vZp2xwnMozt3{" "}
              <FaRegCopy className={stl.copyIcon} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
