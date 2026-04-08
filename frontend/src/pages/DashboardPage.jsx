
import { API_PATHS } from "@/utils/apiPaths"
import axiosInstance from "@/utils/axiosInstance"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { randomToast, showError, showSuccess } from "@/components/ui/ToastFunctions";
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { FaPlus } from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"
import { Book } from "lucide-react";
import BookCard from "@/components/cards/BookCard";

const BookCardSkeleton = () => {
  <div className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
    <div className="w-full aspect-16/25 bg-slate-200 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-6 bg-slate-200 rounded-w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded-w-1/2"></div>
    </div>
  </div>
}

const DashboardPage = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        showError("Failed to fetch your ebooks")
      } finally {
        setIsLoading(false)
      }
    };
    fetchBooks();
  }, []);
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
  };
  const handleCreateBookClick = () => {
    setIsCreateModalOpen(true)
  }
  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`)
  }
  console.log(books)


  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">All eBooks</h1>
            <p className="text-[13px] text-slate-600 mt-1">
              create,edit,and manage all your AI-generated eBooks.
            </p>
          </div>
          <Button
            className="whitespace-nowrap"
            onClick={handleCreateBookClick}
            icon={FaPlus}
          >
            Create New eBook
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i)=>(
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-900 mb-2" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Ebooks found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md">
              You havent created any eBooks yet. Get started by creating your first one.
            </p>
            <Button onClick={handleCreateBookClick} icon={FaPlus}>
              Create your first eBook
            </Button>
          </div>
        ) : (<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book)=>(
              <BookCard
                key={book._id}
                book={book}
                onDelete={() => setBookToDelete(book._id)}
              />
            ))}
        </div>)}
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage