import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

const SortableItem = ({ chapter, index, selectedChapterIndex, onSelectChapter, onDeleteChapter, onGeneratedChapterContent, isGenerating }) => {
    return <div>

    </div>
}

const ChapterSidebar = (
    book,
    selectedChapterIndex,
    onSelectChapter,
    setSelectedChapterIndex,
    setIsSidebarOpen,
    onAddChapter,
    onGeneratedChapterContent,
    onDeleteChapter,
    isGenerating,
    onReorderChapters,
) => {
    const navigate = useNavigate();
    const chapterIds = book.chapters.map(
        (chapter, index) => chapter._id || `new-${index}`
    );
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = chapterIds.indexOf(active.id);
            const newIndex = chapterIds.indexOf(over.id);
            onReorderChapters(oldIndex, newIndex);
        }
    };
    return (
        <aside className=''>
            <div className="">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft className="" />
                    Back to Dashboard
                </Button>
                <h2
                    className=''
                    title={book.title}
                >
                    {book.title}
                </h2>
            </div>
            <div className="">
                <DndContext 
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chapterIds}
                        strategy={verticalListSortingStrategy}
                        >
                            <div className="">
                                {book.chapters.map((chapter,index)=>(
                                    <SortableItem
                                        key={chapter._id || `new-${index}`}
                                        chapter={chapter}
                                        index={index}
                                        selectedChapterIndex={selectedChapterIndex}
                                        onSelectChapter={onSelectChapter}
                                        onDeleteChapter={onDeleteChapter}
                                        onGeneratedChapterContent={onGeneratedChapterContent}
                                        isGenerating={isGenerating}
                                        />
                                ))}
                            </div>
                        </SortableContext>
                </DndContext>
            </div>
            <div className="">
                <Button
                    variant="secondary"
                    onClick={onAddChapter}
                    className=""
                    icon={Plus}
                    >
                        New Chapter
                    </Button>
            </div>
        </aside>
    )
}

export default ChapterSidebar