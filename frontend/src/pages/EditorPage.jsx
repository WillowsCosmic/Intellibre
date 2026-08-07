import ChapterSidebar from '@/components/editor/ChapterSidebar';
import { Button } from '@/components/ui/button';
import { showError } from '@/components/ui/ToastFunctions';
import { API_PATHS } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [Book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("editor");
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false)
  const [aiTopic, setAiTopic] = useState("")
  const [aiStyle, setAiStyle] = useState("Informative")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}${bookId}`
        )
        setBook(response.data);
      } catch (error) {
        showError("Failed to load book details")
        navigate("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBook()

  }, [bookId, navigate])

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  }

  const handleAddChapter = () => {

  };
  const handleDeleteChapter = (index) => {

  };

  const handleReorderChapters = (oldIndex, newIndex) => {

  };
  const handleSaveChanges = async (bookToSave = bookId, showSuccess = true) => {

  };
  const handleCoverImageUpload = async (e) => {

  };
  const handleGenerateOutline = async () => {

  };
  const handleGenerateChapterContent = async (index) => {

  };
  const handleExportPDF = async () => {

  };
  const handleExportDoc = async () => {

  };
  if (isLoading || !Book) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Editor...</p>
      </div>
    );
  }


  return (
    <>
      <div className="flex bg-slate-50 font-sans relative min-h-screen">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 flex md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div 
            className="fixed inset-0 bg-black/20 bg-opacity-75"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                  onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className='sr-only'>Close Sidebar</span>
                    <X className='h-6 w-6 text-white'/>
                  </button>
              </div>
              <ChapterSidebar
                book ={Book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index);
                  setIsSidebarOpen(false);
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                isGenerating={isGenerating}
                onReorderChapters={handleReorderChapters}
                />
            </div>
            <div 
            className="flex=shrink-0 w-14"
            aria-hidden="true"
            ></div>

          </div>
        )}
      </div>
    </>
  )
}

export default EditorPage