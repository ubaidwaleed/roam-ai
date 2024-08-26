import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { Button, TextInput, Menu, Select } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";

import "./MemoryStyles.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Memory = () => {
  const [title, setTitle] = useState("Title"); // Initial state can be props if needed
  const [isPlusIconVisible, setIsPlusIconVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState("Page 1");

  const navigate = useNavigate();

  //--------------------------page arrow clicked menu--------------------------//

  const [isClicked, setIsClicked] = useState(false);
  const menuRef = useRef(null); // Reference to the menu for click outside detection

  // Toggle the visibility of the dropdown
  const toggleMenu = () => {
    setIsClicked(!isClicked);
  };

  // Close the menu when clicking outside of it
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    // Bind the event listener for clicking outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    if (option === "Add new page") {
      setIsPlusIconVisible(true);
    } else if (option === "Saved Memories") {
      // Add your logic for showing saved memories here
      alert("Saved Memories clicked!");
    }
    setIsClicked(false); // Close the menu after an option is clicked
  };

  //---------------------------------------------plus icon when add new page is clicked-------------------//
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const handleTextBlockClick = () => {
    setIsEditorVisible(true);
  };

  const [editors, setEditors] = useState([]);

  const addNewEditor = (type = "text") => {
    const newEditor = {
      id: Date.now(),
      content: "",
      isEditing: true,
      type: type, // 'text' or 'image'
    };
    setEditors([...editors, newEditor]);
  };

  const updateEditorContent = (id, newContent) => {
    const updatedEditors = editors.map((editor) => {
      if (editor.id === id) {
        return { ...editor, content: newContent };
      }
      return editor;
    });
    setEditors(updatedEditors);
  };

  const getModules = () => ({
    toolbar: {
      container: [
        ["bold", "italic"], // Buttons for bold and italic
        ["image"], // Button for inserting an image
      ],
    },
  });

  const formats = ["header", "bold", "italic", "image"];

  const editorRefs = useRef([]);

  // Update the refs array to match the number of editors
  useEffect(() => {
    // Adjust the length of the refs array to match the number of editors
    editorRefs.current = editorRefs.current.slice(0, editors.length);
  }, [editors.length]);

  const handleImageUpload = (editor, range) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return; // Ensure a file is selected

      const reader = new FileReader();
      reader.onload = (e) => {
        // Handle null range by defaulting to the end of the content
        let position = editor.getLength(); // Default to end of content if no selection

        if (range && typeof range.index === "number") {
          position = range.index; // Use selection index if available
        }

        // Insert the image at the determined position
        editor.insertEmbed(position, "image", e.target.result);

        // Move cursor after the image
        editor.setSelection(position + 1);
      };

      reader.readAsDataURL(file);
    };
  };

  const handleHeaderChange = (header, index) => {
    const editor = editorRefs.current[index].getEditor();
    const range = editor.getSelection();

    if (header === "image") {
      // Trigger the image upload process instead of changing the header format
      handleImageUpload(editor, range);
    } else if (range) {
      // Default header behavior for text headers
      editor.format("header", header ? parseInt(header, 10) : false);
    }
  };

  const [dialogTriggered, setDialogTriggered] = useState({});

  const imageHandler = (quill) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const range = quill.getSelection(); // Get the current selection
        console.log("Current selection range:", range);

        let position = quill.getLength(); // Default to end of content if selection is null

        if (range) {
          position = range.index; // If selection exists, get the index
        }

        quill.insertEmbed(position, "image", reader.result); // Insert image
        quill.setSelection(position + 1); // Move cursor after the image
      };

      reader.readAsDataURL(file);
    };
  };

  useEffect(() => {
    editors.forEach((editor, index) => {
      // Ensure that the editor is of type image, and the ref exists
      if (editor.type === "image" && editorRefs.current[index]) {
        const quill = editorRefs.current[index].getEditor();

        // Ensure that the dialog is only triggered if not already triggered
        if (!dialogTriggered[editor.id]) {
          imageHandler(quill); // Open image dialog for this editor

          // Mark this editor as triggered
          setDialogTriggered((prevState) => ({
            ...prevState,
            [editor.id]: true,
          }));
        }
      }
    });
  }, [editors, dialogTriggered]);

  const extractUsefulData = () => {
    // const usefulData = editors.map((editor) => {
    //   if (editor.type === "text") {
    //     // Extract plain text from the HTML content
    //     const plainText = editor.content.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
    //     return {
    //       id: editor.id,
    //       type: editor.type,
    //       content: plainText,
    //     };
    //   } else if (editor.type === "image") {
    //     // Extract the image source URL or base64 data
    //     const imageUrlMatch = editor.content.match(/<img[^>]+src="([^">]+)"/);
    //     const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;
    //     return {
    //       id: editor.id,
    //       type: editor.type,
    //       content: imageUrl,
    //     };
    //   }
    //   return null;
    // });

    console.log("Extracted useful data:", editors);
  };

  const leftPageEditors = editors.slice(0, 4);
  const rightPageEditors = editors.slice(4, 8);

  useEffect(() => {
    if (editors.length >= 8) setIsPlusIconVisible(false);
  }, [editors]);

  return (
    <div className="flex font-lexend">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="relative flex items-center justify-center flex-1 my-4 mr-4 rounded-3xl ">
        <div className="absolute w-[98%] h-[90vh] bg-[#dadaed] transform -rotate-2 rounded-3xl z-0"></div>

        <div className="absolute w-[98%] h-[90vh] bg-[#b2b2d4] transform rotate-2 rounded-3xl z-0"></div>

        <div className="relative w-full mx-8 shadow rounded-3xl overflow-hidden h-[90vh]    bg-gray-100 z-10 ">
          <div
            className="flex flex-row justify-between p-3 bg-[#f7f7ff]"
            style={{ position: "sticky", top: 0, zIndex: 1000 }}
          >
            <div className="flex flex-row items-center space-x-3">
              <div
                onClick={() => navigate(-1)} // Go back one page in history
                className="text-[#373784] hover:text-[#2a2a63] hover:cursor-pointer "
              >
                <IoArrowBackOutline className="text-2xl" />
              </div>

              <TextInput
                value={title}
                size="lg"
                onChange={(event) => setTitle(event.currentTarget.value)}
                className="bg-[#e6e6ff] rounded-lg w-80"
                styles={{
                  input: {
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    fontSize: "1.875rem", // Equivalent to text-3xl in Tailwind
                    border: 0,
                    color: "#7b7ba4",
                  },
                }}
              />
            </div>

            <div className="ml-64">
              <Button
                className="flex flex-row items-center space-x-2 hover:cursor-pointer"
                size="lg"
                color="#e4e4f3"
                onClick={toggleMenu}
                radius="lg"
              >
                {" "}
                <IoIosArrowDown
                  className="mt-2 text-2xl text-[#6e6e98] cursor-pointer  focus:outline-none"
                  tabIndex={0} // Makes the element focusable
                />
                <h1 className="text-2xl text-[#6e6e98]">Page</h1>
              </Button>

              {isClicked && (
                <div
                  ref={menuRef}
                  className="absolute z-10 p-2 bg-white rounded-lg shadow-lg top-[7vh] cell-menu"
                >
                  <div
                    className="flex flex-row items-center p-2 space-x-3 cursor-pointer hover:bg-gray-200 hover:rounded-lg"
                    onClick={() => handleOptionClick("Add new page")}
                  >
                    <img
                      alt="add-new"
                      src="/images/menu-board.png"
                      className="w-auto h-full"
                    />
                    <span className="text-[#4c4c7c]">Add new page</span>
                  </div>
                  <div
                    className="flex flex-row items-center p-2 space-x-3 cursor-pointer hover:bg-gray-200 hover:rounded-lg"
                    onClick={() => handleOptionClick("Delete this page")}
                  >
                    <img
                      alt="delete"
                      src="/images/delete.png"
                      className="w-auto h-full"
                    />
                    <span className="text-[#4c4c7c]">Delete this page</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center space-x-3">
              {/* <div className="flex flex-row items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold">Page</h1>
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <div className="p-1 px-2 bg-gray-300 rounded-lg">
                    <h1 className="text-xl font-bold">01</h1>
                  </div>
                  <div className="p-1 px-2 bg-gray-300 rounded-lg">
                    <h1 className="text-xl font-bold">02</h1>
                  </div>
                  <div className="p-1 px-2 bg-gray-300 rounded-lg">
                    <h1 className="text-xl font-bold">03</h1>
                  </div>
                </div>
              </div> */}

              <Select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e)} // Directly using the value
                data={["Page 1", "Page 2", "Page 3", "Page 4", "Page 5"]}
                radius="lg"
                size="lg"
                className="w-32"
                color="#e4e4f3"
                styles={{
                  input: {
                    backgroundColor: "#e6e6ff",
                    fontSize: "1.2rem",
                    fontFamily: "inherit",
                    border: 0,
                    color: "#7171a9",
                  },
                }}
              />

              <Button
                variant="filled"
                leftSection={<FaWandMagicSparkles />}
                color="#373784"
                radius="lg"
                size="lg"
                style={{ fontSize: "1.25rem" }} // Directly applying the style
                onClick={extractUsefulData}
              >
                Talk to my Journal
              </Button>
              <Button
                variant="filled"
                color="#dfdfff"
                radius="lg"
                size="lg"
                style={{ fontSize: "1.25rem", color: "#373784" }} // Directly applying the style
                onClick={extractUsefulData}
              >
                Copy{" "}
              </Button>
              <Button
                variant="filled"
                color="#dfdfff"
                radius="lg"
                size="lg"
                style={{ fontSize: "1.25rem", color: "#373784" }} // Directly applying the style
                onClick={extractUsefulData}
              >
                Share{" "}
              </Button>
            </div>
          </div>
          <div className="w-full h-screen p-2 bg-white">
            <div className="relative h-full">
              {/* Dashed vertical line */}
              <div className="absolute inset-y-0 transform -translate-x-1/2 border-l-2 border-gray-400 border-dashed left-1/2"></div>

              {/* Notebook pages container */}
              <div className="flex h-full ">
                {/* Left page */}
                <div className="w-1/2   p-4 space-y-4  h-[80vh] overflow-y-auto journal-scrollbar">
                  {leftPageEditors.map((editor, index) => (
                    <>
                      <div key={editor.id} className="flex flex-row space-x-4 ">
                        {editor.type === "text" ? (
                          <div key={`menu-${editor.id}`}>
                            <Menu position="right" offset={4} withArrow>
                              <Menu.Target>
                                <button className="p-2 text-2xl text-black hover:bg-gray-300 rounded-xl">
                                  <img
                                    alt="options"
                                    className="w-full h-auto"
                                    src="/images/options.png"
                                  />
                                </button>
                              </Menu.Target>
                              <Menu.Dropdown className="flex flex-col">
                                <Menu.Item
                                  onClick={() => handleHeaderChange("1", index)}
                                >
                                  <div className="flex flex-row items-center space-x-3">
                                    <h1 style={{ margin: 0, fontSize: "20px" }}>
                                      Heading
                                    </h1>
                                    <img
                                      alt="heading"
                                      src="/images/smallA.png"
                                      className="h-full"
                                    />
                                  </div>
                                </Menu.Item>

                                <Menu.Item
                                  onClick={() => handleHeaderChange("2", index)}
                                >
                                  <div className="flex flex-row items-center space-x-3">
                                    <h1 style={{ margin: 0, fontSize: "20px" }}>
                                      Body
                                    </h1>
                                    <img
                                      alt="body"
                                      src="/images/capitalA.png"
                                      className="h-full"
                                    />
                                  </div>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        ) : editor.type === "image" ? (
                          <div key={`icon-${editor.id}`} className="p-2">
                            <button
                              className="p-2 text-2xl text-black hover:bg-gray-300 rounded-xl"
                              onClick={() => handleHeaderChange("image", index)}
                            >
                              <img
                                alt="options"
                                className="w-full h-auto"
                                src="/images/options.png"
                              />
                            </button>
                          </div>
                        ) : null}

                        <div
                          key={editor.id}
                          className="w-full mb-4 editor-container "
                        >
                          <ReactQuill
                            ref={(el) => (editorRefs.current[index] = el)}
                            value={editor.content}
                            onChange={(content) =>
                              updateEditorContent(editor.id, content)
                            }
                            theme="snow"
                            modules={getModules()}
                            formats={formats}
                          />
                        </div>
                      </div>
                    </>
                  ))}
                  {isPlusIconVisible && leftPageEditors.length < 4 && (
                    <div className="menu-container">
                      <Menu position="right" offset={4} withArrow>
                        <Menu.Target>
                          <button className="p-2 text-2xl text-black rounded-lg hover:bg-gray-300">
                            <FaPlus />
                          </button>
                        </Menu.Target>
                        <Menu.Dropdown className="flex flex-row">
                          <Menu.Item onClick={() => addNewEditor("text")}>
                            <img
                              alt="text"
                              src="/images/text-block.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item onClick={() => addNewEditor("image")}>
                            <img
                              alt="gallery"
                              src="/images/gallery.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item>
                            {" "}
                            <img
                              alt="location"
                              src="/images/location.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item>
                            {" "}
                            <img
                              alt="smiley"
                              src="/images/smileys.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}{" "}
                </div>
                {/* Right page */}
                <div className="w-1/2 p-4 space-y-4 h-[80vh] overflow-y-auto journal-scrollbar">
                  {rightPageEditors.map((editor, index) => (
                    <>
                      <div key={editor.id} className="flex flex-row space-x-4">
                        {editor.type === "text" ? (
                          <div key={`menu-${editor.id}`}>
                            <Menu position="right" offset={4} withArrow>
                              <Menu.Target>
                                <button className="p-2 text-2xl text-black hover:bg-gray-300 rounded-xl">
                                  <img
                                    alt="options"
                                    className="w-full h-auto"
                                    src="/images/options.png"
                                  />
                                </button>
                              </Menu.Target>
                              <Menu.Dropdown className="flex flex-col">
                                <Menu.Item
                                  onClick={() => handleHeaderChange("1", index)}
                                >
                                  <div className="flex flex-row items-center space-x-3">
                                    <h1 style={{ margin: 0, fontSize: "20px" }}>
                                      Heading
                                    </h1>
                                    <img
                                      alt="heading"
                                      src="/images/smallA.png"
                                      className="h-full"
                                    />
                                  </div>
                                </Menu.Item>

                                <Menu.Item
                                  onClick={() => handleHeaderChange("2", index)}
                                >
                                  <div className="flex flex-row items-center space-x-3">
                                    <h1 style={{ margin: 0, fontSize: "20px" }}>
                                      Body
                                    </h1>
                                    <img
                                      alt="body"
                                      src="/images/capitalA.png"
                                      className="h-full"
                                    />
                                  </div>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        ) : editor.type === "image" ? (
                          <div key={`icon-${editor.id}`} className="p-2">
                            <button
                              className="p-2 text-2xl text-black hover:bg-gray-300 rounded-xl"
                              onClick={() => handleHeaderChange("image", index)}
                            >
                              <img
                                alt="options"
                                className="w-full h-auto"
                                src="/images/options.png"
                              />
                            </button>
                          </div>
                        ) : null}
                        <div
                          key={editor.id}
                          className="w-full mb-4 editor-container"
                        >
                          <ReactQuill
                            ref={(el) => (editorRefs.current[index] = el)}
                            value={editor.content}
                            onChange={(content) =>
                              updateEditorContent(editor.id, content)
                            }
                            theme="snow"
                            modules={getModules()}
                            formats={formats}
                          />
                        </div>
                      </div>
                    </>
                  ))}
                  {isPlusIconVisible && leftPageEditors.length >= 4 && (
                    <div className="menu-container">
                      <Menu position="right" offset={4} withArrow>
                        <Menu.Target>
                          <button className="p-2 text-2xl text-black rounded-lg hover:bg-gray-300">
                            <FaPlus />
                          </button>
                        </Menu.Target>
                        <Menu.Dropdown className="flex flex-row">
                          <Menu.Item onClick={() => addNewEditor("text")}>
                            <img
                              alt="text"
                              src="/images/text-block.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item onClick={() => addNewEditor("image")}>
                            <img
                              alt="gallery"
                              src="/images/gallery.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item>
                            {" "}
                            <img
                              alt="location"
                              src="/images/location.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                          <Menu.Item>
                            {" "}
                            <img
                              alt="smiley"
                              src="/images/smileys.png"
                              className="w-auto h-full"
                            />
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}{" "}
                  {/* Plus icon for adding new editor, moved to right page */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memory;
