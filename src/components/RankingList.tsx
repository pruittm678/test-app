"use client";

import { Movie, getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { X, GripVertical, Trophy } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface RankingListProps {
  rankings: Movie[];
  onReorder: (movies: Movie[]) => void;
  onRemove: (id: number) => void;
}

function SortableItem({
  movie,
  index,
  onRemove,
}: {
  movie: Movie;
  index: number;
  onRemove: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: movie.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-zinc-900/80 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-zinc-500 hover:text-zinc-300 cursor-grab active:cursor-grabbing p-1 min-w-[28px] min-h-[28px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical size={20} aria-hidden />
      </button>
      <span className="text-2xl font-bold text-indigo-400 w-8 text-center">
        {index + 1}
      </span>
      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
        {movie.poster_path ? (
          <Image
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-100 truncate">
          {movie.title}
        </p>
        <p className="text-xs text-zinc-400">
          {year} &middot;{" "}
          <span className="text-yellow-500">
            {movie.vote_average?.toFixed(1)}
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(movie.id)}
        className="text-zinc-500 hover:text-red-400 transition-colors p-2 min-w-[32px] min-h-[32px] flex items-center justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label={`Remove ${movie.title} from list`}
      >
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}

export default function RankingList({
  rankings,
  onReorder,
  onRemove,
}: RankingListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rankings.findIndex((m) => m.id === active.id);
      const newIndex = rankings.findIndex((m) => m.id === over.id);
      onReorder(arrayMove(rankings, oldIndex, newIndex));
    }
  }

  return (
    <section className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-indigo-400" size={24} />
        <h2 className="text-2xl font-bold text-zinc-100">My Top Tier</h2>
      </div>

      {rankings.length === 0 ? (
        <div className="text-center py-20 px-6 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
          <p className="text-lg">Your ranking list is empty</p>
          <p className="text-sm mt-2">
            Search for movies or pick from trending to get started
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rankings.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3 max-w-2xl">
              {rankings.map((movie, index) => (
                <SortableItem
                  key={movie.id}
                  movie={movie}
                  index={index}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
