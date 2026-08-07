import { useAuth } from "@/context/AuthContext"
import { useState, useRef, useEffect } from "react"
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import { ArrowLeft, BookOpen, Plus, Sparkle, Trash2 } from "lucide-react";
import SelectField from "./ui/SelectField";
import { Button } from "./ui/button";
import { showError, showSuccess } from "./ui/ToastFunctions";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const CreateBookModal = ({ isOpen, onclose, onBookCreated }) => {
  const { user } = useAuth()
const actualUser = user?.user || user; // Handle nested structure
  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState("")
  const [numChapters, setNumChapters] = useState(5)
  const [aiTopic, setAiTopic] = useState("")
  const [aiStyle, setAiStyle] = useState("Informative")
  const [chapters, setChapters] = useState([])
  const [isGeneratinfOutline, setIsGeneratinfOutline] = useState(false)
  const [isFinalizingBook, setIsFinalizingBook] = useState(false)
  const chapterContainerRef = useRef(null)

  const resetModal = () => {
    setStep(1);
    setBookTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative")
    setChapters([])
    setIsGeneratinfOutline(false)
    setIsFinalizingBook(false)
  }
  const handleGenerateOutline = async () => {
    if (!bookTitle || !numChapters) {
      showError("Please provide a book title and number of chapters")
      return;
    }
    setIsGeneratinfOutline(true)
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: bookTitle,
        description: aiTopic || "",
        style: aiStyle,
        numChapters: numChapters,
      })
      setChapters(response.data.outline);
      setStep(2)
      showSuccess("Outline generated! Review and edit chapters.")
    } catch (error) {
      showError(error.response?.data?.message || "Failed to generate outline")
    } finally {
      setIsGeneratinfOutline(false)
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [ ...chapters ];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters)
  }
  const handleDeleteChapter = (index) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((__, i) => i !== index))
  }
  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: `Chapter ${chapters.length + 1}`, description: "" },
    ])
  }
  const handleFinalizeBook = async () => {
    if (!bookTitle || chapters.length === 0) {
      showError("Book title and at least one chapter are required")
      return;
    }
    setIsFinalizingBook(true)
    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
        title: bookTitle,
        author: actualUser?.name || actualUser?.email?.split('@')[0] || "Unknown Author",
        chapters:chapters,
      });
      showSuccess("eBook created successfully!")
      onBookCreated(response.data._id);
      onclose();
      resetModal();
    } catch (error) {
      console.log("TESR__",bookTitle,chapters);
      showError(error.response?.data?.message || "Failed to create eBook.")
    } finally {
      setIsFinalizingBook(false)
    }
  };

  useEffect(() => {
    if (step === 2 && chapterContainerRef.current) {
      const scrollableDiv = chapterContainerRef.current
      scrollableDiv.scrollTo({
        top: scrollableDiv.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [chapters.length, step])

  return (
    <Modal
      isOpen={isOpen}
      onclose={() => {
        onclose();
        resetModal();
      }}
      title="Create New eBook"
    >
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-500 text-sm font-semibold">
              1
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 text-sm font-semibold">
              2
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <Input
              placeholder="Enter your book title..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of chapters
            </label>
            <Input
              type="number"
              placeholder="5"
              value={numChapters}
              onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic (optional)
            </label>
            <Input
              placeholder="Specific topic for AI generation..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
            />
          </div>
          <SelectField
            label="Writing Style"
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            options={[
              "Informative",
              "Storytelling",
              "Casual",
              "Professional",
              "Humorous",
              "Romantic",
              "Emotional"
            ]}
          />
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGenerateOutline}
              isLoading={isGeneratinfOutline}
              icon={Sparkle}
            >
              Generate outline with AI
            </Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
              ✓
            </div>
            <div className="flex-1 h-0.5 bg-linear-to-b from-teal-400 to-cyan-400"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 text-sm font-semibold">
              2
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Chapters
            </h3>
            <span className="text-sm text-gray-500">
              {chapters.length} chapters
            </span>
          </div>
          <div
            ref={chapterContainerRef}
            className="space-y-3 max-h-96 overflow-y-auto pr-1"
          >
            {chapters.length === 0 ? (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-xl">
                <BookOpen className="w-12 h-12 text-geay-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No chapters yet.Add one to get started
                </p>
              </div>
            ) : (chapters.map((chapter, index) => (
              <div
                key={index}
                className="group p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-50 text-cyan-600 text-xs font-semibold flex-shrink-0 mt-2">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) =>
                      handleChapterChange(index, "title", e.target.value)
                    }
                    placeholder="Chapter Title"
                    className="flex-1 text-base font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  />
                  <button
                    onClick={() => handleDeleteChapter(index)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <textarea
                  value={chapter.description}
                  onChange={(e) =>
                    handleChapterChange(index, "description", e.target.value)
                  }
                  placeholder="Brief description with the chapter cover..."
                  row={2}
                  className="w-full pl-9 text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-400"
                />
              </div>
            ))
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleAddChapter} icon={Plus}>
                Add Chapter
              </Button>
              <Button onClick={handleFinalizeBook} icon={isFinalizingBook}>
                Create ebook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CreateBookModal