import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { Button, Group, TextInput, Menu, Select } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdFileDownloadDone } from "react-icons/md";

import { PiDotsNineBold } from "react-icons/pi";

import "./Memory2Styles.css";

import "react-quill/dist/quill.snow.css";

function SortableElement({ id, type, content }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const baseStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const backgroundOpacity = type === "image" || type === "images" ? 0.1 : 0.2;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={baseStyle}
      className="relative w-full mb-4 bg-transparent"
    >
      <div
        className={`relative z-10 w-full px-2 rounded focus:outline-none font-gluteen ${
          type === "heading" ? "font-bold" : "text-base"
        }`}
        style={{
          minHeight: "2em",
          lineHeight: type === "heading" ? "1.5em" : "1.3em",
          fontSize: type === "heading" ? "2rem" : "1.5rem",
          overflow: "hidden",
          resize: "none",
          background: "transparent",
        }}
      >
        <Element type={type} content={content} />
      </div>

      <div
        className="absolute top-0 left-0 z-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(128, 128, 128, ${backgroundOpacity}) 1px, transparent 1px)`,

          backgroundSize: type === "heading" ? "100% 48px" : "100% 30px",
          filter: "blur(0.5px)",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}

function Element({ type, content }) {
  if (type === "heading") {
    return <h1 className="whitespace-pre-wrap">{content}</h1>;
  } else if (type === "image") {
    return <img src={content} alt="Uploaded" className="max-w-full rounded" />;
  } else if (type === "images") {
    return (
      <div className="flex flex-wrap items-start spaxe-x-2">
        {content.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`Uploaded ${index}`}
            className="flex-initial rounded" // Ensures images keep their original size and do not stretch
            style={{ maxWidth: "100%" }} // Ensures images do not exceed the viewport width
          />
        ))}
      </div>
    );
  } else {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }
}

const Memory2 = () => {
  const [title, setTitle] = useState("Title"); // Initial state can be props if needed
  const [isPlusIconVisible, setIsPlusIconVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Day 1");

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
      setShowPlus(true);
    } else if (option === "Saved Memories") {
      // Add your logic for showing saved memories here
      alert("Saved Memories clicked!");
    }
    setIsClicked(false); // Close the menu after an option is clicked
  };

  //---------------------------------------------plus icon when add new page is clicked-------------------//

  const [elements, setElements] = useState([]);
  const [text, setText] = useState("");
  const [selectedOption, setSelectedOption] = useState("paragraph");
  const [showInput, setShowInput] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track the editing element
  const [editingContent, setEditingContent] = useState(""); // Track the content being edited
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const textareaRefEdit = useRef(null);

  const handleAddElement = () => {
    if (selectedOption === "image") {
      // Image handling is covered in handleImageUpload
    } else if (text.trim()) {
      setElements([
        ...elements,
        { id: elements.length, type: selectedOption, content: text },
      ]);
      setText("");
    }
    setShowInput(false);
    setShowPlus(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Get all selected files
    const imageContents = [];

    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageContents.push(reader.result); // Push each image data to the array

          // After all files are processed, add them as a single element
          if (imageContents.length === files.length) {
            setElements((prevElements) => [
              ...prevElements,
              {
                id: prevElements.length,
                type: "images", // Use a new type for multiple images
                content: imageContents,
              },
            ]);
            setShowInput(false);
            setShowPlus(true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) {
      return;
    }

    const oldIndex = elements.findIndex((e) => e.id === active.id);
    const newIndex = elements.findIndex((e) => e.id === over.id);
    setElements(arrayMove(elements, oldIndex, newIndex));
  };

  const handleShowInputClick = () => {
    setShowInput(true);
  };

  const deletePara = (id) => {
    setElements(elements.filter((element) => element.id !== id));
  };

  // const startEditing = (id, content) => {
  //   setEditingId(id);
  //   setEditingContent(content);
  // };

  const startEditing = (id, type, content) => {
    setEditingId(id);
    setSelectedOption(type); // Store the type of the element being edited
    setEditingContent(content);
  };

  const saveEdit = (id) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, content: editingContent } : el
      )
    );
    setEditingId(null);
  };

  useEffect(() => {
    if (selectedOption === "image") {
      inputRef.current?.click();
    }
  }, [selectedOption]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height first to handle shrinking
      textarea.style.height = "auto";
      // Then set the height based on the scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]); // Trigger the effect whenever the value changes

  useEffect(() => {
    const textareaEdit = textareaRefEdit.current;
    if (textareaEdit) {
      // Reset height first to handle shrinking
      textareaEdit.style.height = "auto";
      // Then set the height based on the scroll height
      textareaEdit.style.height = `${textareaEdit.scrollHeight}px`;
    }
  }, [editingContent]); // Trigger the effect whenever the value changes

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
              <Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e)} // Directly using the value
                data={["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]}
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
              >
                Talk to my Journal
              </Button>
              <Button
                variant="filled"
                color="#dfdfff"
                radius="lg"
                size="lg"
                style={{ fontSize: "1.25rem", color: "#373784" }} // Directly applying the style
              >
                Copy{" "}
              </Button>
              <Button
                variant="filled"
                color="#dfdfff"
                radius="lg"
                size="lg"
                style={{ fontSize: "1.25rem", color: "#373784" }} // Directly applying the style
              >
                Share{" "}
              </Button>
            </div>
          </div>
          <div className="w-full h-full pt-4 pr-4 overflow-y-auto bg-white pb-28">
            <div className="relative ">
              {showInput && (
                <div className="flex flex-row mt-4 space-x-4">
                  <Menu>
                    <Menu.Target>
                      <div className="w-12">
                        <Button className="mb-4 " variant="transparent">
                          <PiDotsNineBold className="text-4xl text-[#373784] rounded-lg hover:bg-[#e5e5ff]" />
                        </Button>
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => setSelectedOption("paragraph")}>
                        Paragraph
                      </Menu.Item>
                      <Menu.Item onClick={() => setSelectedOption("heading")}>
                        Heading
                      </Menu.Item>
                      <Menu.Item onClick={() => setSelectedOption("image")}>
                        Image
                      </Menu.Item>
                      <Menu.Item onClick={handleAddElement}>
                        <MdFileDownloadDone /> {selectedOption}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>

                  {selectedOption === "image" ? (
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      multiple // This allows selecting multiple files
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  ) : (
                    <div className="relative w-full">
                      <textarea
                        value={text}
                        ref={textareaRef}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`Type your ${selectedOption} here...`}
                        className={`relative z-10 w-full px-2 rounded focus:outline-none font-gluteen ${
                          selectedOption === "heading"
                            ? "font-bold"
                            : "text-base"
                        }`}
                        style={{
                          resize: "none",
                          overflow: "hidden",
                          minHeight: "2em",
                          background: "transparent",
                          lineHeight:
                            selectedOption === "heading" ? "1.5em" : "1.3em",
                          fontSize:
                            selectedOption === "heading" ? "2rem" : "1.5rem",
                        }}
                      />
                      <div
                        className="absolute top-0 left-0 z-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(128, 128, 128, 0.2) 1px, transparent 1px)",
                          backgroundSize:
                            selectedOption === "heading"
                              ? "100% 48px"
                              : "100% 30px", // Adjust line spacing for heading
                          filter: "blur(0.5px)",
                          pointerEvents: "none",
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col ">
                {/* Display added elements with drag and drop functionality */}
                {elements.length > 0 && (
                  <DndContext onDragEnd={onDragEnd}>
                    <SortableContext items={elements.map((e) => e.id)}>
                      <div className="py-4 mt-4 font-gluteen">
                        {elements
                          .slice()
                          .reverse()
                          .map((el) => (
                            <div
                              key={el.id}
                              className="flex flex-row space-x-2"
                            >
                              <div>
                                {editingId === el.id ? (
                                  <Menu>
                                    <Menu.Target>
                                      <div className="w-16">
                                        <Button
                                          className="mb-4 "
                                          variant="transparent"
                                        >
                                          <PiDotsNineBold className="text-4xl text-[#373784] rounded-lg hover:bg-[#e5e5ff]" />
                                        </Button>
                                      </div>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Item
                                        onClick={() => saveEdit(el.id)}
                                      >
                                        Save
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                ) : (
                                  <Menu>
                                    <Menu.Target>
                                      <div className="w-16">
                                        <Button
                                          className="mb-4 "
                                          variant="transparent"
                                        >
                                          <PiDotsNineBold className="text-4xl text-[#373784] rounded-lg hover:bg-[#e5e5ff]" />
                                        </Button>
                                      </div>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      {el.type !== "image" && (
                                        <Menu.Item
                                          onClick={() =>
                                            startEditing(
                                              el.id,
                                              el.type,
                                              el.content
                                            )
                                          }
                                        >
                                          Edit
                                        </Menu.Item>
                                      )}
                                      <Menu.Item
                                        onClick={() => deletePara(el.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                )}
                              </div>
                              {editingId === el.id ? (
                                <div className="relative w-full">
                                  <textarea
                                    value={editingContent}
                                    onChange={(e) =>
                                      setEditingContent(e.target.value)
                                    }
                                    placeholder={`Type your ${selectedOption} here...`}
                                    className={`relative z-10 w-full px-2 rounded focus:outline-none font-gluteen ${
                                      selectedOption === "heading"
                                        ? "font-bold"
                                        : "text-base"
                                    }`}
                                    style={{
                                      resize: "none",
                                      overflow: "hidden",
                                      minHeight: "2em",
                                      background: "transparent",
                                      lineHeight:
                                        selectedOption === "heading"
                                          ? "1.5em"
                                          : "1.3em",
                                      fontSize:
                                        selectedOption === "heading"
                                          ? "2rem"
                                          : "1.5rem",
                                    }}
                                    ref={textareaRefEdit}
                                  />
                                  <div
                                    className="absolute top-0 left-0 z-0 w-full h-full"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(to bottom, rgba(128, 128, 128, 0.2) 1px, transparent 1px)",
                                      backgroundSize:
                                        selectedOption === "heading"
                                          ? "100% 48px"
                                          : "100% 30px",
                                      filter: "blur(0.5px)",
                                      pointerEvents: "none",
                                    }}
                                  ></div>
                                </div>
                              ) : (
                                <SortableElement
                                  id={el.id}
                                  type={el.type}
                                  content={el.content}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </SortableContext>
                    <DragOverlay>
                      {/* Render active item during drag */}
                    </DragOverlay>
                  </DndContext>
                )}
                {/* Plus Icon to add content */}
                {showPlus && (
                  <div>
                    <Button
                      className="flex justify-center"
                      onClick={handleShowInputClick}
                      variant="transparent"
                    >
                      <FaPlus className="text-3xl text-[#373784] rounded-lg hover:bg-[#e5e5ff]" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memory2;
